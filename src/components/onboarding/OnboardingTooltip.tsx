'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { apiUpdateProductTour } from '@/api/auth';

export interface TooltipContent {
    title: string | React.ReactNode;
    description?: string;
    /** Text for the primary action button */
    actionLabel?: string;
    /** Callback for the primary action button */
    onAction?: () => void;
    /** Whether to show a skip button */
    showSkip?: boolean;
    onSkip?: () => void;
    /** Step indicator  */
    step?: number;
    totalSteps?: number;
    /** Extra icon */
    icon?: 'sparkles' | 'zap';
}

interface OnboardingTooltipProps {
    targetSelector: string | null;
    content: TooltipContent;
    active: boolean;
    placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
}

type PlacementResult = 'top' | 'bottom' | 'left' | 'right';

const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT_ESTIMATE = 160;
const GAP = 18;

/**
 * Premium floating tooltip that anchors to the spotlight target element.
 * Automatically positions itself to avoid viewport clipping.
 */
export default function OnboardingTooltip({
    targetSelector,
    content,
    active,
    placement = 'auto',
}: OnboardingTooltipProps) {
    const [pos, setPos] = useState<{ top: number; left: number; placement: PlacementResult }>({
        top: 0,
        left: 0,
        placement: 'bottom',
    });
    const [visible, setVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number>(0);

    const computePosition = useCallback(() => {
        if (!targetSelector) return;
        const el = document.querySelector<HTMLElement>(targetSelector);
        if (!el) return;

        const bounding = el.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const tooltipH = tooltipRef.current?.offsetHeight || TOOLTIP_HEIGHT_ESTIMATE;
        const tooltipW = tooltipRef.current?.offsetWidth || TOOLTIP_WIDTH;

        let finalPlacement: PlacementResult = 'bottom';

        if (placement === 'auto') {
            // Choose best placement based on available space
            const spaceAbove = bounding.top;
            const spaceBelow = vh - bounding.bottom;
            const spaceLeft = bounding.left;
            const spaceRight = vw - bounding.right;

            if (spaceBelow >= tooltipH + GAP) finalPlacement = 'bottom';
            else if (spaceAbove >= tooltipH + GAP) finalPlacement = 'top';
            else if (spaceRight >= tooltipW + GAP) finalPlacement = 'right';
            else if (spaceLeft >= tooltipW + GAP) finalPlacement = 'left';
            else finalPlacement = spaceBelow > spaceAbove ? 'bottom' : 'top';
        } else {
            finalPlacement = placement as PlacementResult;
        }

        let top = 0;
        let left = 0;

        switch (finalPlacement) {
            case 'bottom':
                top = bounding.bottom + GAP;
                left = bounding.left + bounding.width / 2 - tooltipW / 2;
                break;
            case 'top':
                top = bounding.top - tooltipH - GAP;
                left = bounding.left + bounding.width / 2 - tooltipW / 2;
                break;
            case 'right':
                top = bounding.top + bounding.height / 2 - tooltipH / 2;
                left = bounding.right + GAP;
                break;
            case 'left':
                top = bounding.top + bounding.height / 2 - tooltipH / 2;
                left = bounding.left - tooltipW - GAP;
                break;
        }

        // Clamp to viewport
        left = Math.max(12, Math.min(left, vw - tooltipW - 12));
        top = Math.max(12, Math.min(top, vh - tooltipH - 12));

        setPos({ top, left, placement: finalPlacement });
    }, [targetSelector, placement]);

    // Track element position
    useEffect(() => {
        if (!active) {
            setVisible(false);
            return;
        }

        // Slight delay for mount animation
        setTimeout(() => setVisible(true), 80);

        const tick = () => {
            computePosition();
            animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [active, computePosition]);

    if (!active) return null;

    const arrowStyles = getArrowStyles(pos.placement);

    return (
        <div
            ref={tooltipRef}
            style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                width: TOOLTIP_WIDTH,
                zIndex: 99999,
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(4px)',
                transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'all',
            }}
            role="dialog"
            aria-modal="true"
            aria-label={typeof content.title === 'string' ? content.title : 'Onboarding'}
        >
            {/* Arrow pointer */}
            <div style={arrowStyles} />

            {/* Card */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,82,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                    padding: '20px 22px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background shimmer */}
                <div
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,82,0,0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    {/* Icon badge */}
                    <div
                        style={{
                            flexShrink: 0,
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #FF5200, #ff7c3f)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255,82,0,0.4)',
                        }}
                    >
                        {content.icon === 'zap' ? (
                            <Zap size={16} color="white" />
                        ) : (
                            <Sparkles size={16} color="white" />
                        )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: 15,
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.3,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {content.title}
                        </h3>
                        {content.step !== undefined && content.totalSteps !== undefined && (
                            <p
                                style={{
                                    margin: '2px 0 0',
                                    fontSize: 11,
                                    color: 'rgba(255,255,255,0.4)',
                                    fontWeight: 500,
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Step {content.step} of {content.totalSteps}
                            </p>
                        )}
                    </div>

                    {content.showSkip && (
                        <button
                            onClick={() => {
                                apiUpdateProductTour().catch(e => console.error('Failed to update product tour:', e));
                                content.onSkip?.();
                            }}
                            style={{
                                flexShrink: 0,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.35)',
                                padding: 4,
                                borderRadius: 6,
                                lineHeight: 1,
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
                            aria-label="Skip onboarding"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Description */}
                {content.description && (
                    <p
                        style={{
                            margin: '0 0 16px',
                            fontSize: 13.5,
                            color: 'rgba(255,255,255,0.65)',
                            lineHeight: 1.6,
                        }}
                    >
                        {content.description}
                    </p>
                )}

                {/* Progress dots */}
                {content.step !== undefined && content.totalSteps !== undefined && content.totalSteps > 1 && (
                    <div style={{ display: 'flex', gap: 5, marginBottom: content.actionLabel ? 14 : 0 }}>
                        {Array.from({ length: content.totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: i + 1 === content.step ? 20 : 6,
                                    height: 6,
                                    borderRadius: 3,
                                    background:
                                        i + 1 === content.step
                                            ? '#FF5200'
                                            : i + 1 < (content.step || 0)
                                            ? 'rgba(255,82,0,0.5)'
                                            : 'rgba(255,255,255,0.15)',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Action button */}
                {content.actionLabel && content.onAction && (
                    <button
                        id="onboarding-action-btn"
                        onClick={content.onAction}
                        style={{
                            marginTop: 12,
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: 10,
                            border: 'none',
                            background: 'linear-gradient(135deg, #FF5200 0%, #ff7c3f 100%)',
                            color: '#fff',
                            fontSize: 13.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            boxShadow: '0 4px 16px rgba(255,82,0,0.4)',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            letterSpacing: '-0.01em',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(255,82,0,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(255,82,0,0.4)';
                        }}
                    >
                        {content.actionLabel}
                        <ChevronRight size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}

function getArrowStyles(placement: PlacementResult): React.CSSProperties {
    const base: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
        zIndex: 1,
    };

    const arrowSize = 8;

    switch (placement) {
        case 'top':
            return {
                ...base,
                bottom: -arrowSize,
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderTop: `${arrowSize}px solid #1a1a2e`,
            };
        case 'bottom':
            return {
                ...base,
                top: -arrowSize,
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid #1a1a2e`,
            };
        case 'left':
            return {
                ...base,
                right: -arrowSize,
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid transparent`,
                borderLeft: `${arrowSize}px solid #1a1a2e`,
            };
        case 'right':
            return {
                ...base,
                left: -arrowSize,
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid #1a1a2e`,
            };
    }
}
