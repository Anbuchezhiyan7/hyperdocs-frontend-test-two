/**
 * activity.ts
 * Synthesises an ordered timeline of events for a given blog
 * from data that is already available client-side (blog record + leads list).
 *
 * Each ActivityEvent has a type, label, description, timestamp and icon key.
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export type ActivityEventType =
    | 'created'
    | 'published'
    | 'unpublished'
    | 'scheduled'
    | 'lead_captured'
    | 'seo_scored'
    | 'updated';

export interface ActivityEvent {
    id: string;
    type: ActivityEventType;
    label: string;
    description: string;
    /** ISO timestamp string */
    timestamp: string;
    /** Display-friendly relative time, e.g. "3 days ago" */
    relativeTime: string;
}

/**
 * Build an activity feed for a blog from available data.
 * @param blog  - The blog object from the API
 * @param leads - The leads list for this specific blog
 */
export function buildActivityFeed(blog: any, leads: any[]): ActivityEvent[] {
    const events: ActivityEvent[] = [];

    // ── 1. Blog Created ─────────────────────────────────────────────────────
    if (blog?.created_at) {
        events.push({
            id: 'created',
            type: 'created',
            label: 'Blog Created',
            description: `"${blog.blog_title || 'Untitled'}" was created`,
            timestamp: blog.created_at,
            relativeTime: dayjs(blog.created_at).fromNow(),
        });
    }

    // ── 2. Published / Unpublished / Scheduled ──────────────────────────────
    if (blog?.blog_status === 'published' && blog?.updated_at) {
        events.push({
            id: 'published',
            type: 'published',
            label: 'Blog Published',
            description: 'Blog went live and is now visible to readers',
            timestamp: blog.updated_at,
            relativeTime: dayjs(blog.updated_at).fromNow(),
        });
    }

    if (blog?.blog_status === 'scheduled' && blog?.schedule?.scheduled_time) {
        events.push({
            id: 'scheduled',
            type: 'scheduled',
            label: 'Blog Scheduled',
            description: `Set to publish on ${dayjs(blog.schedule.scheduled_time).format('DD MMM YYYY [at] h:mm A')}`,
            timestamp: blog.schedule.scheduled_time,
            relativeTime: dayjs(blog.schedule.scheduled_time).fromNow(),
        });
    }

    // ── 3. SEO Score computed ───────────────────────────────────────────────
    const seoScore = typeof blog?.seo_score === 'number'
        ? blog.seo_score
        : parseInt(String(blog?.seo_score || '0').replace('%', ''), 10);

    if (!isNaN(seoScore) && seoScore > 0 && blog?.updated_at) {
        events.push({
            id: 'seo_scored',
            type: 'seo_scored',
            label: 'SEO Score Updated',
            description: `SEO score evaluated at ${seoScore}%`,
            timestamp: blog.updated_at,
            relativeTime: dayjs(blog.updated_at).fromNow(),
        });
    }

    // ── 4. Last Edited ──────────────────────────────────────────────────────
    if (blog?.updated_at && blog?.updated_at !== blog?.created_at) {
        events.push({
            id: 'updated',
            type: 'updated',
            label: 'Blog Updated',
            description: 'Content or settings were last saved',
            timestamp: blog.updated_at,
            relativeTime: dayjs(blog.updated_at).fromNow(),
        });
    }

    // ── 5. Leads captured (one event per lead, max 10) ──────────────────────
    const leadEvents = (leads || [])
        .slice(0, 10)
        .map((lead: any, i: number) => ({
            id: `lead_${i}`,
            type: 'lead_captured' as ActivityEventType,
            label: 'Lead Captured',
            description: `${lead.user_name || 'Anonymous'} (${lead.user_email || lead.user_name || 'N/A'}) via ${lead.lead_type === 'newsletter' ? 'Newsletter' : lead.lead_type === 'lead_form' ? 'Lead Form' : 'Lead Magnet'}`,
            timestamp: lead.created_date || blog.updated_at,
            relativeTime: dayjs(lead.created_date || blog.updated_at).fromNow(),
        }));

    events.push(...leadEvents);

    // ── Sort most-recent first ───────────────────────────────────────────────
    return events.sort(
        (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
    );
}
