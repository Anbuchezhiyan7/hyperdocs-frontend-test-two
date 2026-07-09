'use client';

interface YoutubeVideoPreviewProps {
    videoId: string;
    videoTitle?: string;
    channelName?: string;
    videoDescription?: string;
}

/**
 * Renders a YouTube embed (full-width, 16:9) with channel credit below.
 * Used both inside the editor element and in the blog post page.
 */
export default function YoutubeVideoPreview({
    videoId,
    videoTitle,
    channelName,
    videoDescription,
}: YoutubeVideoPreviewProps) {
    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

    return (
        <div
            className="youtube-video-block w-full my-6"
            contentEditable={false}
            suppressHydrationWarning
        >
            {/* 16:9 responsive wrapper */}
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
                <iframe
                    src={embedUrl}
                    title={videoTitle || 'YouTube Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '12px',
                    }}
                />
            </div>

            {/* Simplified Video credit */}
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
                    Video credit: <span style={{ color: '#374151', fontWeight: 500 }}>{channelName}</span>
                </div>
            )}
        </div>
    );
}
