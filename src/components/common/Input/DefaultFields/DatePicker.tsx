import { DatePicker } from 'antd';
import { parseDayJs, formatDayJs } from '@/utils/time';

const DatePickerInput: React.FC<DatePickerInputProps> = ({
    format = 'DD-MM-YYYY',
    onChange,
    ...props
}) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <DatePicker
            {...props}
            name={props?.name || 'date-picker-input'}
            value={parseDayJs(props.value, format)}
            onChange={date => onChange?.(formatDayJs(date, format))}
            format={format}
            maxDate={props.maxDate}
            minDate={props.minDate}
        />
    );
};

export default DatePickerInput;
