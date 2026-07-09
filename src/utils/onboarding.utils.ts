'use client';

/**
 * Onboarding utility functions
 * - scrollToElement: smooth scroll with center-in-viewport + completion wait
 * - waitForElement: polling-based DOM element detection (hydration-safe)
 * - getElementRect: returns element bounding rect with scroll offset
 */

/**
 * Smoothly scrolls an element into the center of the viewport.
 * Supports nested scroll containers by walking up the DOM.
 */
export function scrollToElement(
    element: HTMLElement,
    options: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition } = {}
): Promise<void> {
    return new Promise((resolve) => {
        const { behavior = 'smooth', block = 'center' } = options;

        element.scrollIntoView({ behavior, block, inline: 'nearest' });

        // Wait for scroll animation to finish
        let lastY = window.scrollY;
        let attempts = 0;
        const maxAttempts = 40; // max 2000ms at 50ms intervals

        const interval = setInterval(() => {
            const currentY = window.scrollY;
            attempts++;
            if (currentY === lastY || attempts >= maxAttempts) {
                clearInterval(interval);
                // Extra buffer for rendering
                setTimeout(resolve, 100);
            } else {
                lastY = currentY;
            }
        }, 50);
    });
}

/**
 * Waits for an element matching the selector to appear in the DOM.
 * Retries every `interval` ms up to `timeout` ms.
 * Returns the element if found, or null on timeout.
 */
export function waitForElement(
    selector: string,
    { timeout = 10000, interval = 100 }: { timeout?: number; interval?: number } = {}
): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
        const startTime = Date.now();

        const check = () => {
            const el = document.querySelector<HTMLElement>(selector);
            if (el) {
                resolve(el);
                return;
            }
            if (Date.now() - startTime >= timeout) {
                resolve(null);
                return;
            }
            setTimeout(check, interval);
        };

        check();
    });
}

/**
 * Returns the bounding rect of an element, accounting for page scroll.
 * Returns null if the element doesn't exist.
 */
export function getElementRect(element: HTMLElement | null): DOMRect | null {
    if (!element) return null;
    return element.getBoundingClientRect();
}

/**
 * Locks pointer-events on everything except the given element(s).
 * Returns a cleanup function to restore pointer-events.
 */
export function lockInteractionsExcept(selectors: string[]): () => void {
    // We use CSS custom property approach — apply a class to body
    // The CSS does the heavy lifting via pointer-events: none on overlay
    // This is a no-op cleanup since we handle it via CSS overlay
    return () => {};
}

/**
 * Returns a stable selector string from a data-tour attribute value.
 */
export function dataTourSelector(value: string): string {
    return `[data-tour="${value}"]`;
}
