/**
 * Share destinations for a published post.
 *
 * Each network is a plain URL rather than an embedded widget, so no third-party
 * script runs on the public site and nothing tracks readers who never click.
 */

export type ShareNetwork = 'x' | 'linkedin' | 'facebook' | 'reddit' | 'whatsapp' | 'email';

export interface ShareTarget {
    network: ShareNetwork;
    label: string;
    href: string;
}

interface ShareInput {
    url: string;
    title: string;
    /** Used by the networks that support a longer body (email, WhatsApp). */
    summary?: string;
}

/**
 * Build the share URL for one network.
 *
 * Every value is passed through encodeURIComponent — a title containing an
 * ampersand or a hash would otherwise truncate the shared link.
 */
export function buildShareLink(network: ShareNetwork, { url, title, summary }: ShareInput): string {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const s = encodeURIComponent(summary ?? title);

    switch (network) {
        case 'x':
            return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
        case 'linkedin':
            return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        case 'reddit':
            return `https://www.reddit.com/submit?url=${u}&title=${t}`;
        case 'whatsapp':
            return `https://api.whatsapp.com/send?text=${t}%20${u}`;
        case 'email':
            return `mailto:?subject=${t}&body=${s}%0A%0A${u}`;
        default:
            return url;
    }
}

const NETWORK_LABELS: Record<ShareNetwork, string> = {
    x: 'X',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    reddit: 'Reddit',
    whatsapp: 'WhatsApp',
    email: 'Email',
};

/** The default set of destinations shown under a post. */
export const DEFAULT_SHARE_NETWORKS: ShareNetwork[] = ['x', 'linkedin', 'facebook', 'whatsapp', 'email'];

export function buildShareTargets(input: ShareInput, networks: ShareNetwork[] = DEFAULT_SHARE_NETWORKS): ShareTarget[] {
    return networks.map(network => ({
        network,
        label: NETWORK_LABELS[network],
        href: buildShareLink(network, input),
    }));
}

/**
 * Hand off to the operating system's own share sheet when the browser has one.
 *
 * On phones this is what readers expect — it lists the apps they actually use
 * instead of a fixed row of five. Returns false when unavailable or dismissed,
 * so the caller can fall back to the link row.
 */
export async function shareViaSystemSheet({ url, title, summary }: ShareInput): Promise<boolean> {
    if (typeof navigator === 'undefined' || typeof (navigator as any).share !== 'function') {
        return false;
    }
    try {
        await (navigator as any).share({ title, text: summary ?? title, url });
        return true;
    } catch {
        // A dismissed sheet rejects; that is a normal outcome, not an error.
        return false;
    }
}

/** Absolute URL for a post, given the site origin and the post's slug. */
export function postPermalink(origin: string, slug: string): string {
    const trimmedOrigin = origin.replace(/\/+$/, '');
    const trimmedSlug = String(slug ?? '').replace(/^\/+/, '');
    return `${trimmedOrigin}/${trimmedSlug}`;
}
