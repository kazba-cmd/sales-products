import { createSlice } from '@reduxjs/toolkit';
import { isInShoppingCart, isInAmazonShoppingCart } from 'utils/helpers';
// import toast from 'react-hot-toast';

const initialState = {
  cartList: [],
  totalPrice: 0
};

const calculateTotal = (arr = []) =>
  arr.reduce((a, b) => {
    console.log(a, b);
    // if (b.sauces && b.drinks) {
    //   return (
    //     a +
    //     window.Number(b.values.cena_ru) * b.quantity +
    //     b.sauces.reduce((z, x) => z + window.Number(x.values.cena_ru) * x.quantity, 0) +
    //     b.drinks.reduce((z, x) => z + window.Number(x.values.cena_ak) * x.quantity, 0)
    //   );
    // }
    // console.log(b.sauces, 'ss');
    // if (b.sauces) {
    //   return (
    //     a +
    //     window.Number(b?.product?.price) * b.quantity +
    //     b.sauces.reduce((z, x) => z + window.Number(x.values.cena_ru) * x.quantity, 0)
    //   );amount
    // }
    return a + window.Number(b?.sum) * b.amount;
  }, 0);
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const counter = isInShoppingCart(state.cartList, payload.id);
      if (counter === 0 || !state.cartList.length) {
        const body = {
          product: payload,
          amount: 1,
          sum: payload.price,
          sauce: {},
          toppings: []
        };
        state.cartList.push(body);
        state.totalPrice = calculateTotal(state.cartList);
      } else {
        state.cartList.map((prod) => {
          if (prod?.product?.id === payload.id) {
            prod.amount += 1;
          }
          return prod;
        });
        state.totalPrice = calculateTotal(state.cartList);
      }
      // const itemIndex = getItemIndex(state.cartList, payload.uuid);
      // console.log(itemIndex);
      // if (itemIndex < 0) {
      //   state.cartList.push(payload);
      //   console.log(state);
      //   state.totalPrice = calculateTotal(state.cartList);
      // } else {
      //   state.cartList[itemIndex].quantity += payload.quantity;
      //   console.log(state);
      //   state.totalPrice = calculateTotal(state.cartList);
      // }
    },
    incrementAmount(state, { payload }) {
      // const itemIndex = getItemIndex(state.cartList, payload.uuid);
      state.cartList.find((product) => product?.product?.id === payload?.product?.id).amount += 1;
      // state.cartList[itemIndex].quantity += 1;
      state.totalPrice = calculateTotal(state.cartList);
    },
    decrementAmount(state, { payload }) {
      // const a = state.cartList.find((product) => product.id === payload.id).quantity;
      // console.log(a);
      state.cartList.map((product) => {
        if (product?.product?.id === payload?.product?.id) {
          if (product?.amount > 1) {
            product.amount -= 1;
          } else {
            state.cartList.splice(state.cartList.indexOf(product), 1);
          }
        }
        state.totalPrice = calculateTotal(state.cartList);
        return product.amount;
      });

      // const itemIndex = getItemIndex(state.cartList, payload.uuid);
      // if (state.cartList[itemIndex].quantity > 1) {
      //   state.cartList[itemIndex].quantity -= 1;
      //   state.totalPrice = calculateTotal(state.cartList);
      // } else {
      //   state.cartList.splice(itemIndex, 1);
      //   state.totalPrice = calculateTotal(state.cartList);
      // }
    },
    addEventToCart(state, { payload }) {
      console.log(payload);
      console.log(state.cartList);
      state.cartList.push(payload);
      state.totalPrice = calculateTotal(state.cartList);
    },
    // Amazon
    addAmazonToCart(state, { payload }) {
      const counter = isInAmazonShoppingCart(state.cartList, payload);
      if (counter === 0) {
        const body = {
          ...payload,
          amount: 1,
          sum:
            payload.product?.price +
            (Object.keys(payload.sauce).length ? payload.sauce?.price : 0) +
            (payload.toppings.length &&
              payload.toppings?.reduce((a, b) => a + b?.product?.price * b?.amount, 0))
        };
        state.cartList.push(body);
      } else {
        state.cartList.find((item) => JSON.stringify(item) === JSON.stringify(payload)).amount += 1;
      }
      state.totalPrice = calculateTotal(state.cartList);
    },
    incrementAmazonAmount(state, { payload }) {
      state.cartList.find((item) => JSON.stringify(item) === JSON.stringify(payload)).amount += 1;
      // const itemIndex = getAmazonItemIndex(state.cartList, payload.uuid, payload.sauces);
      // state.cartList[itemIndex].quantity += 1;
      // state.cartList[itemIndex].sauces.map((count) => (count.quantity += count.fixedQuantity));
      // state.cartList[itemIndex].drinks?.map((count) => (count.quantity += count.fixedQuantity));
      state.totalPrice = calculateTotal(state.cartList);
    },
    decrementAmazonAmount(state, { payload }) {
      const order = state.cartList.find((item) => JSON.stringify(item) === JSON.stringify(payload));
      if (order.amount > 1) {
        order.amount -= 1;
      } else {
        state.cartList.splice(state.cartList.indexOf(order), 1);
      }
      // const itemIndex = getAmazonItemIndex(state.cartList, payload.uuid, payload.sauces);
      // if (state.cartList[itemIndex].quantity > 1) {
      //   state.cartList[itemIndex].quantity -= 1;
      //   state.cartList[itemIndex].sauces.map((count) => (count.quantity -= count.fixedQuantity));
      //   state.cartList[itemIndex].drinks?.map((count) => (count.quantity -= count.fixedQuantity));
      //   state.totalPrice = calculateTotal(state.cartList);
      // } else {
      //   state.cartList.splice(itemIndex, 1);
      state.totalPrice = calculateTotal(state.cartList);
      // }
    },
    // batchRemove(state, action) {
    //   return state.cartList.filter((item) => !action.payload.ids.includes(item.id));
    // },
    // removeFromCart(state, action) {
    //   return { ...state, cartList: state.cartList.filter((item) => item.name !== action.payload) };
    // },
    clearCart: (state) => {
      state.cartList = [];
      state.totalPrice = 0;
    },
    clearAll: () => initialState
  },
  extraReducers: {}
});

export const {
  addToCart,
  incrementAmount,
  decrementAmount,
  addEventToCart,
  // Amazon
  addAmazonToCart,
  incrementAmazonAmount,
  decrementAmazonAmount,
  // removeFromCart,
  // batchRemove,
  clearAll,
  clearCart
} = cartSlice.actions;
