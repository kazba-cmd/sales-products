// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';

import { SSO_URL } from 'utils/constants';
// Redux
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { deleteUser } from 'features/user/userSlice';
import { store, persistor } from './store';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // if SSO url do nothing
    if (config.url.includes(SSO_URL)) return config;
    const {
      user: { currentUser }
    } = store.getState();

    // get the JWT token out of it
    // (obviously depends on how your store is structured)
    // Do something before request is sent\

    const newConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${currentUser.authTokenInfo.access_token}`
      }
    };
    return newConfig;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axios.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  (response) => response,

  (error) => {
    const {
      user: { currentUser }
    } = store.getState();
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error) {
      if (error.response.data.error === 'invalid_token') {
        store.dispatch(deleteUser(currentUser.userInfo.id));
      }
      // if (error.response.status === 401) {
      //   store.dispatch(deleteUser(currentUser.userInfo.id));
      // }
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <HelmetProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
