import dayjs, { Dayjs } from 'dayjs';

type DateType = Dayjs | Date | string | null;

export const getLocalUTC = () => {
    return dayjs().format('UTCZ') || 'UTC+00:00';
};


export const formatDayJs = (date: DateType, format: string) => {
    return date ? dayjs(date).format(format) : null;
};

export const parseDayJs = (date: DateType, format: string) => {
    return date ? dayjs(date, format) : null;
};

/**
 * Formats a date smartly: Today, Yesterday, or MMM D, YYYY
 */
export const formatSmartDate = (date: DateType) => {
  if (!date) return '';
  
  const d = dayjs(date);
  if (!d.isValid()) return String(date);
  
  const now = dayjs();
  
  if (d.isSame(now, 'day')) {
    return 'Today';
  }
  
  if (d.isSame(now.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  
  return d.format('MMM D, YYYY');
};


