import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTT: ''
};
export const SPSlice = createSlice({
  name: 'SP',
  initialState,
  reducers: {
    setCurrentTT(state, action) {
      state.currentTT = action.payload;
    },
    resetAll() {
      return initialState;
    }
  }
});

export const { setCurrentTT, resetAll, setAllTT } = SPSlice.actions;
