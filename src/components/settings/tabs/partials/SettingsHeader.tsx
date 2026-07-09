
type SettingsHeaderProps = {
    title: string;
    description?: string;
};

const SettingsHeader = ({ title, description }: SettingsHeaderProps) => {
    return (
        <div className="flex flex-col gap-2 border-b border-[#E0E0E0] pb-4">
            <h2 className="text-base font-bold text-[#333]">{title}</h2>
            {description && (
                <p className="text-sm font-medium text-[#5D5D5D]">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SettingsHeader;
