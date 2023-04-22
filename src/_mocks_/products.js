import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgProduct } from '../utils/mockImages';

// ----------------------------------------------------------------------

export const PRODUCT_NAME = [
  'Auz.t Баранина  KISHI',
  'Auz.t Баранина  ORTA',
  'Auz.t Баранина  ULI',
  'Auz.t Говядина  KISHI',
  'Auz.t Говядина  ORTA',
  'Auz.t Говядина  ULI',
  'Auz.t Конина  KISHI',
  'Auz.t Конина  ORTA',
  'Auz.t Конина  ULI'
];
// ----------------------------------------------------------------------

const products = PRODUCT_NAME.map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: mockImgProduct(setIndex),
    name: PRODUCT_NAME[index],
    price: faker.datatype.number({ min: 990, max: 1990 }),
    priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29 }),
    type: 'amazon',
    sauce: [],
    status: sample(['sale', 'new', '', ''])
  };
});

export default products;
