/**
 * Optimizes a Cloudinary delivery URL for the public blog reader.
 *
 * Injects `f_auto,q_auto,w_<width>` right after the `/upload/` segment:
 *   - f_auto  → serves AVIF/WebP to supporting browsers (smaller bytes)
 *   - q_auto  → automatic, perceptually-lossless compression
 *   - w_<width> → caps the delivered pixel width (content slot is ≤800px;
 *                 the default 1000 leaves retina headroom)
 *
 * Layout is unaffected: the rendered size is still controlled by CSS, and
 * Cloudinary scales height proportionally, so the aspect ratio is preserved.
 *
 * Defensive by design — returns the URL untouched when:
 *   - it's empty / not a string
 *   - it isn't a Cloudinary delivery URL (`res.cloudinary.com`)
 *   - it has no `/upload/` segment
 *   - a transform already exists right after `/upload/` (avoids double-transform)
 */
export function optimizeCloudinaryImage(
    url?: string | null,
    width = 1000,
    quality: string = 'auto',
): string {
    if (!url || typeof url !== 'string') return url ?? '';
    if (!url?.includes('res.cloudinary.com')) return url;

    const marker = '/upload/';
    const idx = url?.indexOf(marker);
    if (idx === -1) return url;

    const after = url?.slice(idx + marker?.length);
    // Already has a leading transform segment (f_/q_/w_/c_/e_/dpr_/g_…) → leave as-is.
    if (/^(f_|q_|w_|c_|e_|dpr_|g_|a_|b_|r_)/.test(after)) return url;

    const transform = `f_auto,q_${quality},w_${width}/`;
    return url.slice(0, idx + marker?.length) + transform + after;
}

/**
 * next/image `loader` for Cloudinary URLs.
 *
 * Lets <Image> emit a real responsive `srcset` (one Cloudinary URL per candidate
 * width) WITHOUT routing through `/_next/image` — Cloudinary does the resize +
 * f_auto/q_auto. The browser then downloads only the width its viewport/DPR
 * needs, instead of a single oversized fixed-width file (the "properly size
 * images" Lighthouse finding). Non-Cloudinary URLs (e.g. the local placeholder)
 * pass straight through unchanged.
 */
export function cloudinaryLoader({ src, width }: { src: string; width: number; quality?: number }): string {
    // q_auto:eco = Cloudinary's more aggressive perceptual compression. Blog
    // cover art stays visually clean while shedding ~25-35% of the bytes vs
    // plain q_auto — cuts the LCP hero download time on Slow 4G and clears the
    // "increase image compression" Lighthouse finding.
    return optimizeCloudinaryImage(src, width, 'auto:eco');
}

// Next's default `deviceSizes`. A preload built from these exact widths (via the
// same loader/quality as <Image fill sizes=...>) yields URLs identical to the
// ones in the rendered <img srcset>, so the browser preloads and then REUSES the
// same file — early LCP discovery with zero double-download.
export const NEXT_DEFAULT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;

/**
 * Builds a responsive `imageSrcSet` string for ReactDOM.preload that mirrors the
 * srcset next/image generates for a Cloudinary `fill` hero. Pair it with the
 * SAME `sizes` value used on the <Image> (passed as `imageSizes`) so the browser
 * selects — and reuses — the identical variant the LCP <img> requests.
 */
export function cloudinaryImageSrcSet(url: string, quality: string = 'auto:eco'): string {
    return NEXT_DEFAULT_DEVICE_SIZES
        ?.map(w => `${optimizeCloudinaryImage(url, w, quality)} ${w}w`)
        ?.join(', ');
}
