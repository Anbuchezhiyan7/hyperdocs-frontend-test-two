type UploadFileType = 'image' | 'video' | 'audio' | 'document' | 'other';


type ImageFileType = {
    image_id: string;
    url: string;
    aspect_ratio?: '16:9' | '1:1' | undefined;
}