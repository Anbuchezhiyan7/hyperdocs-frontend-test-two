import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Formats a date string from server time to user's timezone
 * @param dateString - The date string from server (in UTC)
 * @param timezone - The user's timezone offset (e.g., "UTC+05:30")
 * @param format - The desired output format (default: 'DD MMM YYYY, hh:mm A')
 * @returns Formatted date string in user's timezone
 */
export const formatDateTime = (
    dateString: string,
    timezone: string,
    format: string = 'DD MMM YYYY, hh:mm A'
): string => {
    // Parse the UTC time
    const utcTime = dayjs.utc(dateString);

    // Get timezone offset from settings (e.g., "UTC+05:30" -> "+05:30")
    const tzStr = typeof timezone === 'string' ? timezone : 'UTC+00:00';
    const timezoneOffset = tzStr.replace('UTC', '');

    // Convert to local time with the specified offset
    const localTime = utcTime.utcOffset(timezoneOffset);

    return localTime.format(format);
};
