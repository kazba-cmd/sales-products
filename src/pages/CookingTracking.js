import { useEffect, useState } from 'react';
// ws
import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';
// material
import { Container, Stack, Typography } from '@material-ui/core';
// components
import Page from 'components/Page';
import { CookingTrackingList } from 'components/_dashboard/tracking';

import axios from 'axios';
// format
import { fDate } from 'utils/formatTime';
import { REST_URL } from 'utils/constants';
import { useSelector } from 'react-redux';

// import { getLatestOrders } from 'utils/api';

export default function CookingTracking() {
  const { currentTT } = useSelector((state) => state.SP);
  // usestate hooks
  const [orders, setOrders] = useState([]);
  // websockets
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState();
  const [subscription, setSubscription] = useState({});

  // подписаться на обновления сокета
  const subscribeUpdates = () => {
    const sub = client.subscribe(`/selling-point/${currentTT.id}/cooking`, onUpdate, null);
    setSubscription(sub);
  };

  // отписаться от обновлений сокета
  const unsubscribeUpdates = () => {
    subscription.unsubscribe();
  };

  // подключение сокета
  const connectSocket = async () => {
    const sockjs = new SockJS(`${REST_URL}/ws/bigBrother`);
    const client = webstomp.over(sockjs, { debug: false });
    client.connect({}, (e) => {
      // успешно подключились
      if (e.command === 'CONNECTED') {
        setConnected(true);
      }
    });
    setClient(client);
  };

  // обновление когда приходит новый сокет
  const onUpdate = () => {
    setTimeout(() => {
      getCookingOrders();
    }, 0);
  };

  // закрыть и обнулить всё нахуй
  const closeConnection = () => {
    setConnected(false);
    setClient(null);
    unsubscribeUpdates();
  };
  // подписаться как подключились
  useEffect(() => {
    // subscribe of all OK
    if (client && connected) {
      subscribeUpdates();
    }
    // cleanup ЭТА ХУЕТА НО ДЕВЕ НЕ ОЧ РАБОТАЕТ поэтому убрал
    return () => closeConnection;
  }, [client, connected]);

  // подключиться к сокету и загрузить заказы
  useEffect(() => {
    getCookingOrders();
    connectSocket();
  }, []);
  const getCookingOrders = async () => {
    const response = await axios
      .get(
        `${REST_URL}/order?orderStatusKey=COOKING&sellingPointId=${currentTT?.id}
          &date=${fDate(new Date())}`
      )
      .then((resp) => {
        if (resp.data) {
          setOrders(resp.data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      });
    return response;
  };

  return (
    <Page title="Трекинг приготовления">
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" mb={4}>
          <Typography variant="h4">Трекинг приготовления</Typography>
          <Typography variant="h6">Количество продуктов: {orders.length}</Typography>
        </Stack>
        <CookingTrackingList orders={orders} loading={loading} onOrderReady={getCookingOrders} />
      </Container>
    </Page>
  );
}
