import Button from '@/components/common/Buttons';

type ActionFooterProps = {
    isSaving?: boolean;
    disableButtons?: boolean;
    handleSave: () => void;
};

const ActionFooter: React.FC<ActionFooterProps> = ({
    isSaving,
    disableButtons = false,
    handleSave,
}) => {
    return (
        <div className='w-full flex justify-end bg-white sticky border-t bottom-0 pt-3'>
            <Button
                type='primary'
                className='font-semibold px-5 !rounded-xl'
                loading={isSaving}
                disabled={disableButtons}
                onClick={handleSave}
            >
                Save
            </Button>
        </div>
    );
};

export default ActionFooter;
