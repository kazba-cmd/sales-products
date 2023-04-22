import { PRODUCTTYPE } from 'utils/constants';
import * as CryptoJS from 'crypto-js';

export const getItemIndex = (arr = [], uuid, key = 'uuid') => {
  const names = arr.map((item) => item[key]);
  return names.indexOf(uuid);
};
export const isInShoppingCart = (arr, id) => {
  let counter = 0;
  if (arr.some((item) => item.product?.id === id)) {
    counter += 1;
  }
  return counter;
};
export const isInAmazonShoppingCart = (arr, payload) => {
  let counter = 0;
  if (arr.some((item) => JSON.stringify(item) === JSON.stringify(payload))) {
    counter += 1;
  }
  return counter;
};
// export const getItemIndex2 = (arr = [], uuid2, key = 'uuid') => {
//   const names = arr.map((item) => item[key]);
//   return names.indexOf(uuid2);
// };
export function getAmazonItemIndex(arr, uuid, sauces) {
  for (let i = 0; i < arr.length; i += 1) {
    const el = arr[i];
    if (el.uuid === uuid && sauceF(el.sauces) === sauceF(sauces)) return i;
  }
  return -1;
}

export const sauceF = (a) => {
  const sorted = sortSauce(a);
  return JSON.stringify(sorted);
};

export function isEmptyObject(obj) {
  if (obj) {
    return Object.keys(obj).length === 0;
  }
  return true;
}

export function isArray(arr) {
  if (arr) {
    return Array.isArray(arr);
  }
  return false;
}

// проверяет если продукт аузти
export const isAmazon = (key) => key === PRODUCTTYPE.amazon;

export const isDarkTheme = (mode) => mode === 'dark';

// сортировка соусов чтобы добавлять в корзину повторяющиеся продукты
const sortSauce = (arr) =>
  [...arr].sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });

// проверить если последний элемиент в массиве
export const isLast = (arr = [], index) => arr.length === index;

// говноебучая функция чтобы получить соусы
export const getSous = (values, number) => {
  const names = values?.[`reglink_sous-b${number}`]
    .split(';')
    .filter((a) => a !== '___' && a !== '');
  const counts = values?.[`souses_kolvo-b${number}`].split(';').filter((a) => a !== '');
  // const result = names.map((sous, index) => `${sous} : ${counts[index].split(':')[1]}`);
  const result = names.map((sous, index) => {
    const obj = {
      label: `${sous}`,
      quantity: `${counts[index].split(':')[1]}`,
      number: `${counts[index].split(':')[1]}`,
      cost: Number(`${counts[index].split(':')[2]}` * Number(`${counts[index].split(':')[1]}`))
    };
    return obj;
  });

  return result;
};

// ХУЕТА для формирования массива продуктов внутри заказа
export const createProducts = (values = {}, includeDrinks = false, includeSous = false) =>
  Object.entries(values)
    // фильтруем если есть reglink_ это товары
    // TODO этот кусок говнокода не будет работать, если отдельно соус продали
    .filter(([key]) => {
      // вытащить только товары на приготовление
      const searchWord = includeDrinks ? 'reglink_' : 'reglink_product';
      return key.includes(searchWord) || (includeSous ? key.includes('reglink_sous') : false);
    })
    // возвращаем массив объетов по типу {reglink_drinks-b1: }
    .map(([key, value]) => {
      // получить номер позиции
      const [, number] = key.split('-b');

      // const sousValue
      // если это аузти добавить плашку аузти
      if (key.includes('product')) {
        return {
          label: value,
          number,
          // добавить поле соус если сука это аузти и есть соусы
          ...(key.includes('product') && {
            // далее кусок говнокода чтобы добавить количество соусов
            sous: values?.[`reglink_sous-b${number}`] ? getSous(values, number) : ['Без соуса']

            // общее количество позиции
          }),
          quantity: values?.[`kolvo-b${number}`] || 1,
          type: 'amazon'
        };
      }
      return { label: value, number, quantity: values?.[`kolvo-b${number}`] || 1 };
    });

export const createKorzina = (cartList) =>
  cartList.map(({ values, type, uuid, sauces = [], quantity, drinks }) => {
    // чекаю какой тип продукта чтобы менять reglinks
    const mainKey = PRODUCTTYPE[type];
    const data = [];
    const drinksObj = [
      {
        values: {
          [mainKey]: `${values.name_ru} - ${values.cena_ru} - Акция Брэдмит + Кофе`,
          // Чекаем если аузти то добавить ключи соусы
          ...(isAmazon(mainKey) && {
            // reglink_sous: sauces.map(({ values }) => values.sous).join(';')
            reglink_sous: sauces
              .map(({ values }) => (values.sous === 'Разделитель' ? '___;' : `${values.sous};`))
              .join('')
          }),
          kolvo: quantity,
          ...(isAmazon(mainKey) && {
            souses_kolvo: sauces
              // .map((s) => `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`)
              .map(
                (s) =>
                  s.uuid &&
                  s.quantity &&
                  s.values.cena_ru &&
                  `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`
              )
              .join(';')
          })
        },
        keys: {
          [mainKey]: uuid,
          ...(isAmazon(mainKey) && { reglink_sous: sauces.map(({ uuid }) => uuid).join(';') }),
          kolvo: quantity
        }
      },
      // OSY JERDEN JALGASTYRU
      // BREADMEAT
      // aktsiya_name: "Акция Брэдмит + Кофе"
      {
        values: {
          reglink_drinks:
            drinks !== undefined ? `${drinks[0].values.name_ru} - ${drinks[0].values.cena_ak}` : '',
          kolvo: quantity
        },
        keys: {
          reglink_drinks: drinks !== undefined ? `${drinks[0].uuid}` : '',
          kolvo: quantity
        }
      }
    ];

    const regularObj = {
      values: {
        [mainKey]: `${values.name_ru} - ${values.cena_ru}`,
        // Чекаем если аузти то добавить ключи соусы
        ...(isAmazon(mainKey) && {
          // reglink_sous: sauces.map(({ values }) => values.sous).join(';')
          reglink_sous: sauces
            .map(({ values }) => (values.sous === 'Разделитель' ? '___;' : `${values.sous};`))
            .join('')
        }),
        kolvo: quantity,
        ...(isAmazon(mainKey) && {
          souses_kolvo: sauces
            // .map((s) => `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`)
            .map(
              (s) =>
                s.uuid &&
                s.quantity &&
                s.values.cena_ru &&
                `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`
            )
            .join(';')
        })
      },
      keys: {
        [mainKey]: uuid,
        ...(isAmazon(mainKey) && { reglink_sous: sauces.map(({ uuid }) => uuid).join(';') }),
        kolvo: quantity
      }
    };

    if (drinks !== undefined) {
      data.push(drinksObj);
    } else {
      data.push(regularObj);
    }
    return data[0];
    // return {
    //   values: {
    //     [mainKey]: `${values.name_ru} - ${values.cena_ru}`,
    //     // Чекаем если аузти то добавить ключи соусы
    //     ...(isAmazon(mainKey) && {
    //       // reglink_sous: sauces.map(({ values }) => values.sous).join(';')
    //       reglink_sous: sauces
    //         .map(({ values }) => (values.sous === 'Разделитель' ? '___;' : `${values.sous};`))
    //         .join('')
    //     }),
    //     kolvo: quantity,
    //     ...(isAmazon(mainKey) && {
    //       souses_kolvo: sauces
    //         // .map((s) => `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`)
    //         .map(
    //           (s) =>
    //             s.uuid &&
    //             s.quantity &&
    //             s.values.cena_ru &&
    //             `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`
    //         )
    //         .join(';')
    //     })
    //   },
    //   keys: {
    //     [mainKey]: uuid,
    //     ...(isAmazon(mainKey) && { reglink_sous: sauces.map(({ uuid }) => uuid).join(';') }),
    //     kolvo: quantity
    //   }
    // };
    // OSY JERDEN JALGASTYRU
    // BREADMEAT
    // aktsiya_name: "Акция Брэдмит + Кофе"
    // [
    //   {
    //     values: {
    //       [mainKey]: `${values.name_ru} - ${values.cena_ru} - Акция Брэдмит + Кофе`,
    //       // Чекаем если аузти то добавить ключи соусы
    //       ...(isAmazon(mainKey) && {
    //         // reglink_sous: sauces.map(({ values }) => values.sous).join(';')
    //         reglink_sous: sauces
    //           .map(({ values }) => (values.sous === 'Разделитель' ? '___;' : `${values.sous};`))
    //           .join('')
    //       }),
    //       kolvo: quantity,
    //       ...(isAmazon(mainKey) && {
    //         souses_kolvo: sauces
    //           // .map((s) => `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`)
    //           .map(
    //             (s) =>
    //               s.uuid &&
    //               s.quantity &&
    //               s.values.cena_ru &&
    //               `'${s.uuid}': ${s.quantity}: ${s.values.cena_ru}`
    //           )
    //           .join(';')
    //       })
    //     },
    //     keys: {
    //       [mainKey]: uuid,
    //       ...(isAmazon(mainKey) && { reglink_sous: sauces.map(({ uuid }) => uuid).join(';') }),
    //       kolvo: quantity
    //     }
    //   },
    //   // OSY JERDEN JALGASTYRU
    //   // BREADMEAT
    //   // aktsiya_name: "Акция Брэдмит + Кофе"
    // {
    //   values: {
    //     reglink_drinks: `${drinks[0].values.name_ru} - ${drinks[0].values.cena_ak}`,
    //     kolvo: quantity
    //   },
    //   keys: {
    //     reglink_drinks: `${drinks[0].uuid}`,
    //     kolvo: quantity
    //   }
    // }
    // ];
  });

export const createDrinksWithKolvo = (values) => {
  const createDrinks = () => {
    const drinks = Object.entries(values)
      .filter(([key, value]) => {
        if (key.includes('reglink_drinks')) {
          return [key, value];
        }
        return '';
      })
      .map(([key, value]) => {
        const [, number] = key.split('-');
        const [val, sum] = value.split(' - ');
        return {
          key,
          val,
          number,
          sum
        };
      });
    return drinks;
  };
  const createKolvo = () => {
    const kolvo = Object.entries(values)
      .filter(([key, value]) => {
        if (key.startsWith('kolvo')) {
          return [key, value];
        }
        return '';
      })
      .map(([key, value]) => {
        const [, number] = key.split('-');
        return {
          key,
          value,
          number
        };
      });
    return kolvo;
  };
  const drinks = createDrinks();
  const kolvo = createKolvo();
  const drinksWithKolvo = drinks.filter((drink, id) => {
    for (let i = 0; i < kolvo.length; i += 1) {
      if (drink.number === kolvo[i].number) {
        drink.kolvo = kolvo[i].value;
      }
    }
    return drink;
  });
  return drinksWithKolvo;
};

export const encryptAES = (text, key) => CryptoJS.AES.encrypt(text, key).toString();

export const decryptAES = (encryptedBase64, key) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);
  if (decrypted) {
    try {
      const str = CryptoJS.enc.Utf8.stringify(decrypted);
      if (str.length > 0) {
        return str;
      }
      return 'error 1';
    } catch (e) {
      return 'error 2';
    }
  }
  return 'error 3';
};
