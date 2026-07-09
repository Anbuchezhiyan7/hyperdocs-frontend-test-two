'use client';

import React, { useMemo, useState } from 'react';

interface ViewsChartProps {
    data: PageViewSeriesItem[];
    range: AnalyticsRange;
}

const WIDTH = 760;
const HEIGHT = 260;
const PAD_X = 36;
const PAD_TOP = 20;
const PAD_BOTTOM = 34;

const formatLabel = (date: string, range: AnalyticsRange) => {
    const d = new Date(date + 'T00:00:00');
    if (range === '1y' || range === 'all') return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ViewsChart = ({ data, range }: ViewsChartProps) => {
    const [hover, setHover] = useState<number | null>(null);
    const todayIso = new Date().toISOString().slice(0, 10);

    const { points, areaPath, linePath, maxVal, stepX } = useMemo(() => {
        const n = Math.max(data.length, 1);
        const maxVal = Math.max(...data.map(d => d.views), 1);
        const innerW = WIDTH - PAD_X * 2;
        const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
        const stepX = n > 1 ? innerW / (n - 1) : 0;

        const points = data.map((d, i) => {
            const x = PAD_X + (n > 1 ? i * stepX : innerW / 2);
            const y = PAD_TOP + innerH - (d.views / maxVal) * innerH;
            return { x, y, ...d };
        });

        if (points.length === 0) {
            return { points, areaPath: '', linePath: '', maxVal, stepX };
        }

        const linePath = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
            .join(' ');

        const baseY = PAD_TOP + innerH;
        const areaPath =
            `M ${points[0].x.toFixed(1)} ${baseY} ` +
            points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
            ` L ${points[points.length - 1].x.toFixed(1)} ${baseY} Z`;

        return { points, areaPath, linePath, maxVal, stepX };
    }, [data]);

    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full"
                style={{ minWidth: 480 }}
                onMouseLeave={() => setHover(null)}
            >
                <defs>
                    <linearGradient id="viewsArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF5200" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FF5200" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* horizontal grid + y labels */}
                {gridLines.map((g, i) => {
                    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
                    const y = PAD_TOP + innerH - g * innerH;
                    const val = Math.round(maxVal * g);
                    return (
                        <g key={i}>
                            <line
                                x1={PAD_X}
                                x2={WIDTH - PAD_X}
                                y1={y}
                                y2={y}
                                stroke="#f0f0f0"
                                strokeWidth={1}
                            />
                            <text x={4} y={y + 3} fontSize={10} fill="#9ca3af">
                                {val}
                            </text>
                        </g>
                    );
                })}

                {areaPath && <path d={areaPath} fill="url(#viewsArea)" />}
                {linePath && (
                    <path d={linePath} fill="none" stroke="#FF5200" strokeWidth={2.5} strokeLinejoin="round" />
                )}

                {/* x labels — thin out when many points */}
                {points.map((p, i) => {
                    const showLabel =
                        range === '1y' ||
                        points.length <= 8 || i % Math.ceil(points.length / 8) === 0 || i === points.length - 1;
                    return (
                        showLabel && (
                            <text
                                key={`xl-${i}`}
                                x={p.x}
                                y={HEIGHT - 12}
                                fontSize={10}
                                fill="#9ca3af"
                                textAnchor="middle"
                            >
                                {formatLabel(p.date, range)}
                            </text>
                        )
                    );
                })}

                {/* hover hit-areas + dots */}
                {points.map((p, i) => {
                    const isToday = range === 'today' && p.date === todayIso;
                    return (
                        <g key={`pt-${i}`}>
                            <rect
                                x={p.x - (stepX || 24) / 2}
                                y={PAD_TOP}
                                width={stepX || 24}
                                height={HEIGHT - PAD_TOP - PAD_BOTTOM}
                                fill="transparent"
                                onMouseEnter={() => setHover(i)}
                            />
                            {(hover === i || isToday) && (
                                <line
                                    x1={p.x}
                                    x2={p.x}
                                    y1={PAD_TOP}
                                    y2={HEIGHT - PAD_BOTTOM}
                                    stroke="#FF5200"
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                />
                            )}
                            {isToday && (
                                <circle cx={p.x} cy={p.y} r={9} fill="#FF5200" fillOpacity={0.18} />
                            )}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={isToday ? 5.5 : hover === i ? 5 : 3}
                                fill={isToday ? '#FF5200' : '#fff'}
                                stroke="#FF5200"
                                strokeWidth={2}
                            />
                            {isToday && hover !== i && (
                                <text
                                    x={p.x}
                                    y={p.y - 14}
                                    fontSize={10}
                                    fontWeight="bold"
                                    fill="#FF5200"
                                    textAnchor="middle"
                                >
                                    Today
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* tooltip */}
                {hover !== null && points[hover] && (
                    <g>
                        {(() => {
                            const p = points[hover];
                            const boxW = 96;
                            const boxX = Math.min(Math.max(p.x - boxW / 2, 2), WIDTH - boxW - 2);
                            const boxY = Math.max(p.y - 50, 2);
                            return (
                                <>
                                    <rect
                                        x={boxX}
                                        y={boxY}
                                        width={boxW}
                                        height={40}
                                        rx={8}
                                        fill="#111827"
                                    />
                                    <text x={boxX + boxW / 2} y={boxY + 16} fontSize={10} fill="#9ca3af" textAnchor="middle">
                                        {formatLabel(p.date, range)}
                                    </text>
                                    <text x={boxX + boxW / 2} y={boxY + 31} fontSize={12} fontWeight="bold" fill="#fff" textAnchor="middle">
                                        {p.views} views
                                    </text>
                                </>
                            );
                        })()}
                    </g>
                )}
            </svg>
        </div>
    );
};

export default ViewsChart;
