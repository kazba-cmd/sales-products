import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { formatISO } from 'date-fns';

// material
import { Button, Container, Stack, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { setReceptionStartTime } from 'features/stuff/stuffSlice';

// ws
import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';

// icons
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import cogIcon from '@iconify-icons/mdi/cog';

// components
import Page from 'components/Page';
import { LatestOrders, ModalReport, Stats } from 'components/_dashboard/cashbox';

// format
import { REST_URL } from 'utils/constants';
import { fDate } from 'utils/formatTime';

// ----------------------------------------------------------------------

export default function CookingTracking() {
  const { currentTT } = useSelector((state) => state.SP);
  // hooks
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  // websockets
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState();
  const [subscription, setSubscription] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // modal
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  // entry function

  // const updateOrder = async (id) => {
  //   const vremya_zaversheniya_gotovki = formatISO(new Date());
  //   setLoading(true);
  //   const response = await axios.post(`${REST_URL}/api/registries/merge/zakaz/${id}`, {
  //     values: {
  //       status_ru: 'Готов',
  //       vremya_zaversheniya_gotovki
  //     },
  //     keys: {
  //       status_ru: '003',
  //       vremya_zaversheniya_gotovki
  //     }
  //   });
  //   setLoading(false);
  //   return response;
  // };
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

  const getLatestOrders = async () => {
    setLoading(true);
    try {
      const response = await axios
        .get(`${REST_URL}/order?date=${fDate(new Date())}&sellingPointId=${currentTT?.id}`)
        .then((resp) => {
          setLoading(false);
          setOrders(resp?.data);
        });
      // test(response.data.data);
      return response;
    } catch (e) {
      setLoading(false);
      setOrders([]);
    }
  };

  const handleClickNewOrder = () => {
    dispatch(setReceptionStartTime(formatISO(new Date())));
    navigate('/meal-menu');
  };

  // const test = async (order) => {
  //   if (!order[0].values['reglink_product-b1']) {
  //     await updateOrder(order[0].id);
  //   }
  // };

  useEffect(() => {
    getLatestOrders();
    connectSocket();
  }, []);
  return (
    <Page title="Зал">
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Последние заказы</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={handleModalOpen}
              size="large"
              variant="contained"
              color="info"
              startIcon={<Icon icon={cogIcon} />}
            >
              Отчеты
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleClickNewOrder}
              startIcon={<Icon icon={plusFill} />}
            >
              Новый заказ
            </Button>
          </Stack>
        </Stack>
        <Stats stats={stats} />
        <LatestOrders orders={orders} loading={loading} />
        <ModalReport open={isModalOpen} onClose={handleModalClose} />
      </Container>
    </Page>
  );
}
