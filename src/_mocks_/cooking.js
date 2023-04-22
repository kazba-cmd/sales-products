import faker from 'faker';
import { sample } from 'lodash';
import { PRODUCT_NAME } from '_mocks_/products';

// ----------------------------------------------------------------------

const cooking = new Array(9).fill(null).map(() => ({
  id: faker.datatype.uuid(),
  orderN: faker.datatype.number({ max: 30 }),
  name: faker.name.findName(),
  ready: faker.datatype.boolean(),
  dateAccepted: faker.date.past(),
  totalPrice: faker.datatype.number({ min: 990, max: 1990 }),
  testing: faker.random.arrayElement(['A', 'B', 'AB', 'O']),
  products: new Array(faker.datatype.number({ min: 1, max: 5 })).fill(null).map(() => ({
    name: sample(PRODUCT_NAME),
    sauce: sample(['Сырный', 'Чесночный', ''])
  }))
}));

export default cooking;
