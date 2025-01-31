import {format, startOfMonth, endOfMonth} from 'date-fns';

import {DATE_FORMAT} from 'helpers/config';

export const formatDate = (date: Date) => {
  return format(date, DATE_FORMAT.ISO_DATE);
};

export const formatLongDate = (date: Date) => {
  return format(date, DATE_FORMAT.LONG_DATE_FORMAT);
};

export const getStartOfMonth = (date: Date) => {
  return startOfMonth(date);
};

export const getEndOfMonth = (date: Date) => {
  return endOfMonth(date);
};

export const formatMonthYear = (date: Date) => {
  return format(date, DATE_FORMAT.MONTH_YEAR_FORMAT);
};
