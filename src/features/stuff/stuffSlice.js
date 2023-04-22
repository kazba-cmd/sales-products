import { createSlice } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';

const initialState = {
  theme: 'light',
  currentLanguage: 'ru',
  customerName: '',
  receptionStartTime: formatISO(new Date())
};

export const stuffSlice = createSlice({
  name: 'stuff',
  initialState,
  reducers: {
    changeTheme(state, action) {
      state.theme = action.payload;
    },
    changeCustomerName(state, action) {
      state.customerName = action.payload;
    },
    clearCustomerName(state) {
      state.customerName = '';
    },
    setReceptionStartTime(state, { payload }) {
      state.receptionStartTime = payload;
    }
  },
  extraReducers: {}
});

export const { changeTheme, changeCustomerName, clearCustomerName, setReceptionStartTime } =
  stuffSlice.actions;
