import Button from '@/components/common/Buttons';
import { DeleteOutlinedIcon } from '@/assets/icons';

type ModalFooterProps = {
    currentStep: 1 | 2;
    setCurrentStep: (step: 1 | 2) => void;
    onRemove: () => void;
    onSave: () => void;
    isDeleting: boolean;
    isSaving: boolean;
    isNewsletter?: boolean;
    isLeadForm?: boolean;
};

const ModalFooter = ({
    currentStep,
    setCurrentStep,
    onRemove,
    onSave,
    isDeleting,
    isSaving,
    isNewsletter,
    isLeadForm,
}: ModalFooterProps) => {
    return (
        <div className='flex justify-between items-center'>
            <Button
                loading={isDeleting}
                danger
                className='rounded-xl h-8 flex items-center gap-2'
                onClick={onRemove}
            >
                <span className='flex items-center gap-1'>
                    <DeleteOutlinedIcon /> Remove
                </span>
            </Button>
            {currentStep === 1 ? (
                <Button
                    title={(isNewsletter || isLeadForm) ? 'Save' : 'Next'}
                    loading={(isNewsletter || isLeadForm) ? isSaving : false}
                    type='primary'
                    className='rounded-[10px] h-8'
                    onClick={() => setCurrentStep(2)}
                    htmlType='button'
                />
            ) : (
                <div className='flex items-center gap-2'>
                    <Button
                        title='Previous'
                        type='default'
                        htmlType='button'
                        className='rounded-[10px] h-8'
                        onClick={() => setCurrentStep(1)}
                    />
                    <Button
                        title='Save'
                        htmlType='submit'
                        type='primary'
                        className='rounded-[10px] h-8'
                        onClick={onSave}
                        loading={isSaving}
                    />
                </div>
            )}
        </div>
    );
};

export default ModalFooter;
