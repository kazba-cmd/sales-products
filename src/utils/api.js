import axios from 'axios';
import { fDate } from 'utils/formatTime';
import { REST_URL } from 'utils/constants';

export const getLatestOrders = ({ pageSize = 9, date_ru = fDate(new Date()), status_ru = '' }) => {
  const body = {
    valueEquals: {
      date_ru
    },
    keyEquals: {
      status_ru
    }
  };

  return axios.post(
    `${REST_URL}/api/registries/getLast?registryCode=zakaz&idOnly=false&pageSize=999&pageNumber=0&straight=false&sortField=vremya_start_prinyatiya_ru&ascending=false&coverValues`,
    body
  );
};

export const submitOrder = (body) => axios.post(`${REST_URL}/api/orders/create`, body);
