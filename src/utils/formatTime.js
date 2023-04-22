import { format, formatDistanceToNow } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd.MM.yyyy', {
    locale: ruLocale
  });
}
export function fDateHyphen(date) {
  return format(new Date(date), 'yyyy-MM-dd', {
    locale: ruLocale
  });
}
export function fDateTime(date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fTime(date) {
  return format(new Date(date), 'HH:mm');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: false,
    locale: ruLocale
  });
}
