'use client';

import { cn, withRef } from '@udecode/cn';
import { PlateElement, withHOC } from '@udecode/plate/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { SparkleIcon } from '@/assets/icons';
import Button from '@/components/common/Buttons';
import YoutubeVideoPreview from '@/components/editor/YoutubeVideo/YoutubeVideoPreview';
import { Modal } from 'antd';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

export const YoutubeVideoElement = withHOC(
    ResizableProvider,
    withRef<typeof PlateElement>(({ className, ...props }, ref) => {
        const editor = props.editor;
        const element = props.element as any;
        const readOnly = editor.api.isReadOnly();

        /**
         * REJECT: remove the node from editor.
         */
        const handleReject = () => {
            const path = editor.api.findPath(element);
            if (path) {
                editor.tf.removeNodes({ at: path });
            }
        };

        /**
         * ACCEPT: strip the is_ai_suggested flag so the node stays in the editor.
         */
        const handleAccept = () => {
            const path = editor.api.findPath(element);
            if (path) {
                editor.tf.setNodes({ is_ai_suggested: false }, { at: path });
            }
        };

        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleDelete = () => {
            const path = editor.api.findPath(element);
            if (path) {
                editor.tf.removeNodes({ at: path });
            }
            setIsModalOpen(false);
        };

        // ── Render ──────────────────────────────────────────────────────────
        return (
            <PlateElement
                ref={ref}
                className={cn(className, 'py-2.5 !w-full select-none')}
                contentEditable={false}
                data-tour="youtube-block"
                {...props}
            >
                {element.is_ai_suggested && !readOnly ? (
                    <div className="relative border-2 border-orange-200 rounded-2xl bg-orange-50/20 p-4 transition-all hover:border-orange-300">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-orange-100 rounded-lg">
                                    <SparkleIcon className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">Suggested Video</h4>
                                    <p className="text-[11px] text-gray-500">AI found a relevant video for this section</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={handleReject}
                                    className="rounded-xl border-gray-200 hover:text-red-500 hover:border-red-200 h-9 flex items-center"
                                >
                                    Reject
                                </Button>
                                <Button 
                                    type="primary"
                                    onClick={handleAccept}
                                    className="rounded-xl bg-orange-600 border-orange-600 hover:bg-orange-700 px-6 h-9 flex items-center text-white"
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                        <YoutubeVideoPreview
                            videoId={element.video_id}
                            videoTitle={element.video_title}
                            channelName={element.channel_name}
                            videoDescription={element.video_description}
                        />
                    </div>
                ) : (
                    <div className="relative group/yt-video">
                        <YoutubeVideoPreview
                            videoId={element.video_id}
                            videoTitle={element.video_title}
                            channelName={element.channel_name}
                            videoDescription={element.video_description}
                        />
                        
                        {!readOnly && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/yt-video:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-xl pointer-events-none">
                                <div 
                                    className="p-3 bg-white rounded-full shadow-lg cursor-pointer pointer-events-auto transform hover:scale-110 transition-transform text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Trash2Icon className="w-6 h-6" />
                                </div>
                            </div>
                        )}

                        <Modal
                            title="Delete Video"
                            open={isModalOpen}
                            onOk={handleDelete}
                            onCancel={() => setIsModalOpen(false)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true, type: 'primary' }}
                            centered
                        >
                            <p>Are you sure you want to delete this video from the blog?</p>
                        </Modal>
                    </div>
                )}
                {/* Plate requires children rendered for void elements */}
                <span className="hidden">{props.children}</span>
            </PlateElement>
        );
    })
);
