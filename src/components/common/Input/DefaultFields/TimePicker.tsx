
import { TimePicker, } from 'antd';
import { formatDayJs, parseDayJs } from '@/utils/time';

const TimePickerInput: React.FC<TimePickerInputProps> = ({ value, onChange, ...props }) => {
    return (
        <TimePicker
            {...props}
            value={value ? parseDayJs(value, 'HH:mm') : null}
            onChange={(time) => onChange?.(formatDayJs(time, 'HH:mm'))}
            format={props?.format || 'h:mm A'}
            minuteStep={1}
        />
    );
};

export default TimePickerInput;
