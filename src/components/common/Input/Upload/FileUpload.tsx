import { Button } from 'antd';

const FileUpload = ({ ...props }: BaseUploaderProps) => {
    const { handleClick, handleRemove, value = null, isLoading = false } = props;

    const getTitle = () => {
        if (props.fileType === 'image/*') {
            return 'Upload Image';
        } else if (props.fileType === 'video/*') {
            return 'Upload Video';
        } else if (props.fileType === 'application/*') {
            return 'Upload Document';
        }
        return 'Upload Document';
    };

    const getValue = () => {
        if (props.fileType === 'image/*') {
            return value?.image_id && value?.image_id + '.jpg';
        } else if (props.fileType === 'video/*') {
            return value?.video_id;
        } else if (props.fileType === 'application/*') {
            return value?.document_id;
        }
        return null;
    };

    return (
        <div className='flex w-full flex-wrap gap-4'>
            {!getValue() ? (
                <Button
                    size='small'
                    title={getTitle()}
                    variant='solid'
                    className='!text-xs !text-white !border-black rounded-lg !bg-black'
                    onClick={handleClick}
                    loading={isLoading}
                />
            ) : (
                <div className='flex items-center flex-row-reverse gap-2 text-xs'>{getValue()}</div>
            )}
            {getValue() && (
                <div className='flex items-center flex-row-reverse gap-2'>
                    <Button
                        size='small'
                        title='Change'
                        variant='solid'
                        className='!text-xs !text-black !border-black !bg-white'
                        onClick={handleClick}
                        loading={isLoading}
                    />
                    <Button
                        size='small'
                        title='Remove'
                        variant='solid'
                        className='!text-xs !bg-white !border !border-error !text-red-500'
                        onClick={() => handleRemove(0, props.fileType)}
                        loading={false}
                    />
                </div>
            )}
        </div>
    );
};

export default FileUpload;
