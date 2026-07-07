import { formatInTimeZone } from 'date-fns-tz';

export const formatCityTime = (date: Date | number, timezone: string, is24Hour: boolean, showSeconds: boolean) => {
  let formatStr = is24Hour ? 'HH:mm' : 'hh:mm a';
  if (showSeconds) {
    formatStr = is24Hour ? 'HH:mm:ss' : 'hh:mm:ss a';
  }
  
  try {
    return formatInTimeZone(date, timezone, formatStr);
  } catch (e) {
    return 'Invalid Time';
  }
};

export const formatCityDate = (date: Date | number, timezone: string) => {
  try {
    return formatInTimeZone(date, timezone, 'EEEE, MMM d, yyyy');
  } catch (e) {
    return '';
  }
};

export const getUTCOffset = (date: Date | number, timezone: string) => {
  try {
    return formatInTimeZone(date, timezone, 'xxx'); // e.g. +05:30 or Z
  } catch (e) {
    return '';
  }
};

export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return 'UTC';
  }
};
