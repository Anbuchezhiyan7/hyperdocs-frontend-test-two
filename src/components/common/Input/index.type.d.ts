type InputOption = {
    label: string;
    value: any;
    sublabel?: string;
    disabled?: boolean;
};

type SublabelAlignment = 'right' | 'bottom';

type BaseInputProps = {
    label?: string;
    sublabel?: string;
    sublabelAlignment?: SublabelAlignment;
    description?: string;
    name: string;
    required?: boolean;
    format?: string;
    error?: any;
    disabled?: boolean;
    rootClassName?: string;
    className?: string;
    labelLineStyle?: boolean;
    labelClassName?: string;
    inputClassName?: string;
    contentType?: 'number' | 'text';
    baseInputClassName?: string;
};

type TextInputProps = BaseInputProps & {
    inputType: 'text';
    value?: string;
    onChange: (value: string) => void;
    pattern?: string;
    placeholder?: string;
    responseType?: string;
    contentEditable?: boolean;
};

type EmailInputProps = BaseInputProps & {
    inputType: 'email';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

type NumberInputProps = BaseInputProps & {
    inputType: 'number';
    value: number;
    onChange: (value: number | null) => void;
    placeholder?: string;
    responseType?: string;
    maxLength?: number;
    min?: number;
};

type TextAreaInputProps = BaseInputProps & {
    inputType: 'textarea';
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
};

type LinkUrlInputProps = BaseInputProps & {
    inputType: 'url';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    responseType?: string;
};

type SelectInputProps = BaseInputProps & {
    inputType: 'select';
    value: string | string[];
    onChange: (value: string | number | string[]) => void;
    options: InputOption[];
    variant?: 'single' | 'multi';
    placeholder?: string;
    isLoading?: boolean;
    showSearch?: boolean;
    optionRender?: any;
    isCreatable?: boolean;
    buttonLabel?: string;
    onOptionButtonClick?: any;
    fontPreview?: boolean;
};

type MultiSelectInputProps = BaseInputProps & {
    inputType: 'multiselect';
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    options: InputOption[];
    placeholder?: string;
    isLoading?: boolean;
};

type MultiSelectInputCreatableProps = BaseInputProps & {
    inputType: 'select-creatable';
    value: (string | number)[];
    options: InputOption[];
    placeholder?: string;
    variant?: 'single' | 'multi';
    isLoading?: boolean;
    creatable?: boolean;
    disabled?: boolean;
    allowCreate: boolean;
    endpoint: CommonPath;
    onError?: (error: Error) => void;
    onChange: (value: any) => void;
    onCreate: (value: any) => void;
};

type DatePickerInputProps = BaseInputProps & {
    inputType: 'datepicker';
    value: Date | string | null;
    onChange: (value: Date | string | null) => void;
    placeholder?: string;
    availableDays?: string[];
    maxDate?: any;
    minDate?: any;
};

type TimePickerInputProps = BaseInputProps & {
    inputType: 'timepicker';
    value: Dayjs | null | undefined;
    onChange: (value: any) => void;
    placeholder?: string;
    disabledTime?: () => {
        disabledHours?: () => number[];
        disabledMinutes?: (selectedHour: number) => number[];
    };
};

type SessionDatePickerInputProps = BaseInputProps & {
    inputType: 'sessionDatePicker';
    value: Date | null;
    onChange: (value: Date | null) => void;
    placeholder?: string;
};

type BirthDatePickerInputProps = BaseInputProps & {
    inputType: 'birthdatepicker';
    value?: Date | string | null;
    onChange: (value: Date | string | string[] | null) => void;
    placeholder?: string;
    birthDatePicker: { minAge: number | 0; maxAge: number | 100 };
};

type CheckboxInputProps = BaseInputProps & {
    inputType: 'checkbox';
    value: boolean | any[];
    onChange: (value: boolean | any[]) => void;
    placeholder?: string;
    children?: React.ReactNode;
    variant?: 'single' | 'multi';
    options?: any[];
};

type RadioVariant = 'default' | 'rating';

type RadioInputProps = BaseInputProps & {
    name?: string;
    disabled?: boolean;
    inputType: 'radio';
    value: string | number;
    onChange: (value: string | number) => void;
    options: InputOption[];
    variant?: RadioVariant;
    inputClassName?: string;
    optionsClassName?: string;
    optLabelClassName?: string;
    radioButtonClassName?: string;
};

type UploadProps = BaseInputProps & {
    inputType: 'upload';
    value: any;
    maxFiles?: number;
    inputClassName?: string;
    variant?: 'cover-image' | 'file' | 'profile-image';
    fileType?: 'image/*' | 'application/*' | 'video/*';
    error?: (error: Error) => void;
    hideBorder?: boolean;
    accept?: string;
    resetHeight?: boolean;
    buttonText?: string;
    defaultText?: string;
    isUploading?: boolean;
    onUpload?: (file: File) => void;
    onRemove?: () => void;
};

type SearchInputProps = BaseInputProps & {
    inputType: 'search';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
};

type SingleImageUploadProps = Partial<ImageUploadProps> & {
    handleRemove: (index: number) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type TimeRangeValue = {
    from: string;
    to: string;
};

type BaseAsyncSelectProps = BaseInputProps & {
    inputType: 'async-select';
    variant: 'multi' | 'single';
    creatable?: boolean;
    allowCreate: boolean;
    endpoint: CommonPath;
    responseAsLabel: string;
    responseAsValue: string | string[] | 'payload' | null;
    onError?: (error: Error) => void;
    onChange: (value: any) => void;
    value: any;
    placeholder?: string;
};

type CreatableSelectProps = BaseAsyncSelectProps & {
    creatable: true;
    onCreate: (value: string) => void;
};

type AsyncSelectProps = BaseAsyncSelectProps | CreatableSelectProps;

type ContactInputProps = BaseInputProps & {
    inputType: 'contact-input';
    value: {
        country_code: string;
        number: string;
    };
    onChange: (value: { country_code: string; number: string }) => void;
    changeErrorMsg: (string) => void;
};

type TimeRangeInputProps = BaseInputProps & {
    inputType: 'timerange';
    onChange: (value: any) => void;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    value: any;
};

type DatePickerInputProps = BaseInputProps & {
    inputType: 'datepicker';
    value: Date | null;
    onChange: (value: Date | null) => void;
    placeholder?: string;
    availableDays?: string[];
};

type DateRangeInputProps = BaseInputProps & {
    inputType: 'daterange';
    onChange: (value: any) => void;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    value: any;
    variant?: 'all' | 'after' | 'before';
};

type SwitchInputProps = BaseInputProps & {
    inputType: 'switch';
    value: boolean;
    onChange: (value: boolean) => void;
    options?: any[];
    loading?: boolean;
};

type ImageInputProps = BaseInputProps & {
    inputType: 'image';
    value: any;
    onChange: (value: any) => void;
    imageDimension?: string;
    inputContainerClassName?: string;
    isCroppable?: boolean;
    onAspectRatioChange?: (aspectRatio: '16:9' | '1:1') => void;
    aspectRatio?: '16:9' | '1:1';
};

type InputProps =
    | TextInputProps
    | EmailInputProps
    | LinkUrlInputProps
    | NumberInputProps
    | TextAreaInputProps
    | SelectInputProps
    | MultiSelectInputProps
    | MultiSelectInputCreatableProps
    | DatePickerInputProps
    | TimePickerInputProps
    | BirthDatePickerInputProps
    | CheckboxInputProps
    | RadioInputProps
    | UploadProps
    | MultiSelectInputProps
    | SearchInputProps
    | AsyncSelectProps
    | ContactInputProps
    | TimeRangeInputProps
    | DateRangeInputProps
    | SwitchInputProps;

type InputType =
    | 'text'
    | 'number'
    | 'textarea'
    | 'select'
    | 'multiselect'
    | 'datepicker'
    | 'switch';
