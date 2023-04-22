import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ws
import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';

import axios from 'axios';
// format
import { fDate } from 'utils/formatTime';
import { REST_URL } from 'utils/constants';

// material
import { Container, Stack, Typography } from '@material-ui/core';
// components
// components
import Page from 'components/Page';
import { IssuetrackingList, ModalIssueTracking } from 'components/_dashboard/tracking';

export default function IssueTracking() {
  // usestate hooks
  const user = useSelector((state) => state.user);
  const { currentTT } = useSelector((state) => state.SP);
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState({ values: {} });
  // websockets
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState();
  const [subscription, setSubscription] = useState({});
  // модалка заказа
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // подписаться на обновления сокета
  const subscribeUpdates = () => {
    const sub = client.subscribe(`/selling-point/${currentTT.id}/giving`, onUpdate, null);
    setSubscription(sub);
  };

  // отписаться от обновлений сокета
  const unsubscribeUpdates = () => {
    subscription.unsubscribe();
  };

  // подключение сокета
  const connectSocket = () => {
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
    getLatestOrders();
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
    getLatestOrders();
    connectSocket();
  }, []);

  const getLatestOrders = async () => {
    // Получить готовые заказы
    setLoading(true);
    const response = await axios
      .get(
        `${REST_URL}/order?orderStatusKey=COOKED&sellingPointId=${currentTT.id}&date=${fDate(
          new Date()
        )}`
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

  const handleOpen = (order) => {
    setModalOrder(order);
    setOrderModalOpen(true);
  };

  const handleClose = () => {
    setOrderModalOpen(false);
    getLatestOrders();
  };
  return (
    <Page title="Выдача">
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" mb={4}>
          <Typography variant="h4">Трекинг выдачи</Typography>
          <Typography variant="h4">Количество заказов: {orders.length}</Typography>
        </Stack>
        {/* <Grid container spacing={2}> */}
        <IssuetrackingList
          orders={orders}
          handleOpen={handleOpen}
          setModalOrder={setModalOrder}
          loading={loading}
        />
        {/* </Grid> */}
        <ModalIssueTracking
          orderModalOpen={orderModalOpen}
          onClose={handleClose}
          modalOrder={modalOrder}
        />
      </Container>
    </Page>
  );
}
