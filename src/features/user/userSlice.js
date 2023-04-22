import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import qs from 'qs';

import { SSO_URL } from 'utils/constants';

const initialState = {
  currentUser: {},
  loggedUsers: [],
  error: false
};

// Check if user is already logged
const isUserLogged = (id, users) => users.some(({ userInfo }) => userInfo?.id === id);

// Get users index
const getUserIndex = (id, users) => users.map((user) => user.userInfo.id).indexOf(id);
// users.indexOf(({ userInfo }) => userInfo.id === id);

const getUserInfo = async (token) =>
  axios.get(`${SSO_URL}/user/info`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

const getAuthToken = async ({ username, password }) => {
  const data = qs.stringify({
    username,
    password,
    grant_type: 'password',
    client_id: 'amazon'
  });

  return axios.post(`${SSO_URL}/oauth/token`, data);
};
const checkLoggedUsers = (state, { payload }) => {
  if (isUserLogged(payload.userInfo?.id, state.loggedUsers) || payload.userInfo?.active === false)
    return state.loggedUsers;
  if (payload.userInfo) return [...state.loggedUsers, payload];
  return [...state.loggedUsers];
};
export const postUserLogin = createAsyncThunk('user/getUser', async (values) => {
  try {
    const { data: authTokenInfo, status } = await getAuthToken(values);
    if (status === 200) {
      const { data: userInfo } = await getUserInfo(authTokenInfo.access_token);
      return { authTokenInfo, userInfo, status };
    }
  } catch (e) {
    return e.response.data;
  }
});
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    deleteUser(state, { payload }) {
      const updated = state.loggedUsers.filter((user) => user.userInfo.id !== payload);
      const [current] = updated;
      return {
        ...state,
        currentUser: { ...current },
        loggedUsers: updated
      };
    },
    clearUser() {
      return initialState;
    },
    resetAll() {
      return initialState;
    }
  },
  extraReducers: {
    [postUserLogin.fulfilled]: (state, { payload }) => ({
      ...(payload.userInfo?.active === true
        ? { currentUser: payload }
        : { currentUser: state.currentUser }),

      // Check if user already logged
      loggedUsers: checkLoggedUsers(state, { payload }),
      // isUserLogged(payload.userInfo.id, state.loggedUsers) || payload.userInfo.active === false
      //   ? state.loggedUsers
      //   : payload.userInfo ? [...state.loggedUsers, payload] :null,
      error: false
    }),
    [postUserLogin.rejected]: (state, action) => ({ ...state, ...action.payload, error: true })
  }
});

export const { setCurrentUser, clearUser, deleteUser } = userSlice.actions;
