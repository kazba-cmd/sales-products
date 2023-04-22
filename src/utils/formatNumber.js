import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

const valuta = {
  Казахстан: 'тг',
  Россия: 'руб'
};
const setValuta = (country) => valuta[country];

export function fCurrency(number, country) {
  return `${numeral(number).format(`0,0`)} ${setValuta(country) || 'нет валюты'}`;
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
