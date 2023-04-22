import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userSlice } from 'features/user/userSlice';
import { cartSlice } from 'features/cart/cartSlice';
import { stuffSlice } from 'features/stuff/stuffSlice';
import { SPSlice } from 'features/sp/SPSlice';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

const reducers = combineReducers({
  user: userSlice.reducer,
  stuff: stuffSlice.reducer,
  cart: cartSlice.reducer,
  SP: SPSlice.reducer
  // cabinetMenu: cabinetMenuSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store);
