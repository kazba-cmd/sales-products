import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgProduct } from '../utils/mockImages';

// ----------------------------------------------------------------------

const PRODUCT_NAME = ['Coca-Cola 0,5', 'Fanta 0,5', 'Sprite 0,5', 'Airan 0,2'];
// ----------------------------------------------------------------------

const products = PRODUCT_NAME.map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: mockImgProduct(setIndex),
    name: PRODUCT_NAME[index],
    price: faker.datatype.number({ min: 150, max: 200 }),
    priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29 }),
    status: sample([''])
  };
});

export default products;
