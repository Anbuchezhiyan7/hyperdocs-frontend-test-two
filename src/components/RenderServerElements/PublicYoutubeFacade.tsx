'use client';

/**
 * PUBLIC-ONLY YouTube facade — click-to-load.
 *
 * The editor's YoutubeVideoPreview renders the real <iframe> eagerly, which
 * pulls ~1.5MB of YouTube player JS on first paint and tanks LCP/TBT. On the
 * public blog page we instead render a lightweight thumbnail + play button
 * (zero third-party JS) and only swap in the iframe once the reader clicks.
 */

import { useState } from 'react';

interface PublicYoutubeFacadeProps {
    videoId: string;
    videoTitle?: string;
    channelName?: string;
}

export default function PublicYoutubeFacade({
    videoId,
    videoTitle,
    channelName,
}: PublicYoutubeFacadeProps) {
    const [activated, setActivated] = useState(false);

    if (!videoId) return null;

    // hqdefault is universally available; mqdefault as a small fallback.
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;

    return (
        <div className="youtube-video-block my-6 w-full" suppressHydrationWarning>
            <div
                style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: '12px',
                    background: '#000',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
            >
                {activated ? (
                    <iframe
                        src={embedUrl}
                        title={videoTitle || 'YouTube Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '12px',
                        }}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setActivated(true)}
                        aria-label={videoTitle ? `Play video: ${videoTitle}` : 'Play YouTube video'}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            backgroundImage: `url(${thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Play badge */}
                        <span
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '68px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'rgba(0,0,0,0.75)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: '10px solid transparent',
                                    borderBottom: '10px solid transparent',
                                    borderLeft: '16px solid #fff',
                                    marginLeft: '3px',
                                }}
                            />
                        </span>
                    </button>
                )}
            </div>

            {channelName && (
                <div
                    style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: 400,
                        textAlign: 'left',
                    }}
                >
                    Video credit:{' '}
                    <span style={{ color: '#374151', fontWeight: 500 }}>{channelName}</span>
                </div>
            )}
        </div>
    );
}
