type BaseUploaderProps = UploadProps & {
    handleRemove: (index: number, type?: string, imageIf?: string) => void;
    handleClick: () => void;
    isLoading?: boolean;
};
