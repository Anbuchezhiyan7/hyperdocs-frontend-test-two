/**
 * lead-scoring.ts
 * Pure client-side function that assigns a 0–100 engagement score to a lead
 * based on signals that are already available in the lead list payload.
 *
 * Score breakdown:
 *  - Recency (how recently they signed up)       → max 30 pts
 *  - Lead type quality (lead_magnet > form > nl) → max 30 pts
 *  - Email present                               → 10 pts
 *  - Phone present                               → 10 pts
 *  - Name present                                → 10 pts
 *  - Same day activity boost                     → 10 pts
 */

import dayjs from 'dayjs';

export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface LeadScore {
    score: number;
    temperature: LeadTemperature;
    label: string; // "Hot", "Warm", "Cold"
}

/**
 * Compute a 0–100 lead score for a single lead record.
 */
export function computeLeadScore(lead: {
    user_name?: string;
    user_email?: string;
    phone?: string;
    lead_type?: string;
    created_date?: string;
}): LeadScore {
    let score = 0;

    // 1. Recency — max 30 pts
    if (lead.created_date) {
        const daysAgo = dayjs().diff(dayjs(lead.created_date), 'day');
        if (daysAgo === 0) score += 30;          // Today
        else if (daysAgo <= 3) score += 25;      // Last 3 days
        else if (daysAgo <= 7) score += 18;      // Last week
        else if (daysAgo <= 30) score += 10;     // Last month
        else if (daysAgo <= 90) score += 4;      // Last quarter
        // older → 0 pts
    }

    // 2. Lead type quality — max 30 pts
    const type = lead.lead_type || '';
    if (type === 'lead_magnet') score += 30;
    else if (type === 'lead_form') score += 20;
    else if (type === 'newsletter') score += 10;

    // 3. Data completeness
    if (lead.user_email?.trim()) score += 10;
    if (lead.phone?.trim()) score += 10;
    if (lead.user_name?.trim()) score += 10;

    // 4. Same-day activity boost
    const isToday = lead.created_date
        ? dayjs(lead.created_date).isSame(dayjs(), 'day')
        : false;
    if (isToday) score += 10;

    // Cap at 100
    score = Math.min(100, score);

    const temperature: LeadTemperature =
        score >= 70 ? 'hot' : score >= 30 ? 'warm' : 'cold';

    const label = temperature === 'hot' ? 'Hot' : temperature === 'warm' ? 'Warm' : 'Cold';

    return { score, temperature, label };
}
