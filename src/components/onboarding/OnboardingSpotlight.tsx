'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface OnboardingSpotlightProps {
    /** CSS selector or data-tour selector to highlight */
    targetSelector: string | null;
    /** Extra padding around the spotlight cutout */
    padding?: number;
    /** Called when the overlay (non-spotlight area) is clicked */
    onOverlayClick?: () => void;
    /** Whether to show the overlay at all */
    active: boolean;
}

/**
 * Full-screen dark overlay with a transparent spotlight cutout.
 * Uses SVG mask for a perfectly smooth, animated spotlight.
 */
export default function OnboardingSpotlight({
    targetSelector,
    padding = 8,
    onOverlayClick,
    active,
}: OnboardingSpotlightProps) {
    const [rect, setRect] = useState<SpotlightRect | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const animFrameRef = useRef<number>(0);
    const prevRectRef = useRef<SpotlightRect | null>(null);

    const updateRect = useCallback(() => {
        if (!targetSelector) {
            setRect(null);
            return;
        }
        const el = document.querySelector<HTMLElement>(targetSelector);
        if (!el) {
            setRect(null);
            return;
        }
        const bounding = el.getBoundingClientRect();
        const newRect: SpotlightRect = {
            top: bounding.top - padding,
            left: bounding.left - padding,
            width: bounding.width + padding * 2,
            height: bounding.height + padding * 2,
        };

        // Only update state if rect actually changed (perf)
        const prev = prevRectRef.current;
        if (
            !prev ||
            Math.abs(prev.top - newRect.top) > 0.5 ||
            Math.abs(prev.left - newRect.left) > 0.5 ||
            Math.abs(prev.width - newRect.width) > 0.5 ||
            Math.abs(prev.height - newRect.height) > 0.5
        ) {
            prevRectRef.current = newRect;
            setRect(newRect);
        }
    }, [targetSelector, padding]);

    // Continuously track element position (handles scroll + resize)
    useEffect(() => {
        if (!active) return;

        const tick = () => {
            updateRect();
            animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [active, updateRect]);

    // Track window size
    useEffect(() => {
        const update = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    if (!active) return null;

    const { width: W, height: H } = windowSize;
    const borderRadius = 10;

    // Build SVG clip path: full rect with a rounded-rect hole punched out
    let maskPath = `M 0 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z`;
    if (rect) {
        const { top, left, width, height } = rect;
        const r = borderRadius;
        // Rounded rectangle path (clockwise)
        maskPath += ` M ${left + r} ${top}
            L ${left + width - r} ${top}
            Q ${left + width} ${top} ${left + width} ${top + r}
            L ${left + width} ${top + height - r}
            Q ${left + width} ${top + height} ${left + width - r} ${top + height}
            L ${left + r} ${top + height}
            Q ${left} ${top + height} ${left} ${top + height - r}
            L ${left} ${top + r}
            Q ${left} ${top} ${left + r} ${top}
            Z`;
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99998,
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        >
            {/* SVG overlay with spotlight cutout */}
            <svg
                width={W}
                height={H}
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    transition: 'all 0.05s linear',
                }}
            >
                <defs>
                    <mask id="onboarding-spotlight-mask">
                        <rect width={W} height={H} fill="white" />
                        {rect && (
                            <rect
                                x={rect.left}
                                y={rect.top}
                                width={rect.width}
                                height={rect.height}
                                rx={borderRadius}
                                ry={borderRadius}
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width={W}
                    height={H}
                    fill="rgba(0,0,0,0.72)"
                    mask="url(#onboarding-spotlight-mask)"
                />
            </svg>

            {/* Glow ring around spotlight */}
            {rect && (
                <div
                    style={{
                        position: 'absolute',
                        top: rect.top - 2,
                        left: rect.left - 2,
                        width: rect.width + 4,
                        height: rect.height + 4,
                        borderRadius: borderRadius + 2,
                        border: '2px solid rgba(255, 82, 0, 0.7)',
                        boxShadow: '0 0 0 3px rgba(255, 82, 0, 0.15), 0 0 20px rgba(255, 82, 0, 0.3)',
                        pointerEvents: 'none',
                        animation: 'onboarding-pulse 2s ease-in-out infinite',
                    }}
                />
            )}

            {/* Click-blocking overlay (blocks clicks outside spotlight) */}
            {rect ? (
                <>
                    {/* Top */}
                    <div
                        onClick={onOverlayClick}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: W,
                            height: rect.top,
                            cursor: 'not-allowed',
                            pointerEvents: 'all',
                        }}
                    />
                    {/* Bottom */}
                    <div
                        onClick={onOverlayClick}
                        style={{
                            position: 'absolute',
                            top: rect.top + rect.height,
                            left: 0,
                            width: W,
                            height: H - rect.top - rect.height,
                            cursor: 'not-allowed',
                            pointerEvents: 'all',
                        }}
                    />
                    {/* Left */}
                    <div
                        onClick={onOverlayClick}
                        style={{
                            position: 'absolute',
                            top: rect.top,
                            left: 0,
                            width: rect.left,
                            height: rect.height,
                            cursor: 'not-allowed',
                            pointerEvents: 'all',
                        }}
                    />
                    {/* Right */}
                    <div
                        onClick={onOverlayClick}
                        style={{
                            position: 'absolute',
                            top: rect.top,
                            left: rect.left + rect.width,
                            width: W - rect.left - rect.width,
                            height: rect.height,
                            cursor: 'not-allowed',
                            pointerEvents: 'all',
                        }}
                    />
                </>
            ) : (
                // No target: block everything
                <div
                    onClick={onOverlayClick}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        cursor: 'not-allowed',
                        pointerEvents: 'all',
                    }}
                />
            )}

            <style>{`
                @keyframes onboarding-pulse {
                    0%, 100% { box-shadow: 0 0 0 3px rgba(255, 82, 0, 0.15), 0 0 20px rgba(255, 82, 0, 0.3); }
                    50% { box-shadow: 0 0 0 6px rgba(255, 82, 0, 0.08), 0 0 30px rgba(255, 82, 0, 0.5); }
                }
            `}</style>
        </div>
    );
}
