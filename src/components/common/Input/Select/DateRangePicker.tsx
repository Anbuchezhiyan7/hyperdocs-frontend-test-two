import React, { useMemo } from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const DateRangeInput: React.FC<DateRangeInputProps> = ({ value = [null, null], variant, onChange, ...props }) => {
  const [start, end] = value;

  const getDisabledDate = (picker: 'start' | 'end') => {
    return (current: Dayjs) => {
      if (!current) return false;

      const today = dayjs().startOf('day');

      if (variant === 'after') {
        if (picker === 'start') return current.isBefore(today);
        return start ? current.isBefore(start.startOf('day')) : current.isBefore(today);
      }

      if (variant === 'before') {
        const endOfToday = dayjs().endOf('day');
        if (picker === 'start') return current.isAfter(endOfToday);
        return start
          ? current.isBefore(start.startOf('day')) || current.isAfter(endOfToday)
          : current.isAfter(endOfToday);
      }

      if (picker === 'end' && start) return current.isBefore(start.startOf('day'));
      return false;
    };
  };

  const handleChange = (type: 'start' | 'end', date: Dayjs | null) => {
    const newStart = type === 'start' ? date : start;
    const newEnd = type === 'end' ? date : end;

    if (newStart && newEnd && newStart.isAfter(newEnd)) {
      onChange?.([newEnd, newStart]);
    } else {
      onChange?.([newStart, newEnd]);
    }
  };

  return (
    <div className="flex gap-3">
      <DatePicker
        {...props}
        value={start}
        onChange={(date) => handleChange('start', date)}
        placeholder="Start Date"
        format="DD-MM-YYYY"
        disabledDate={getDisabledDate('start')}
        className="w-full p-2"
      />
      <DatePicker
        {...props}
        value={end}
        onChange={(date) => handleChange('end', date)}
        placeholder="End Date"
        format="DD-MM-YYYY"
        disabledDate={getDisabledDate('end')}
        className="w-full p-2"
      />
    </div>
  );
};

export default DateRangeInput;