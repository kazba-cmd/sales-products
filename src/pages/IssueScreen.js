import { useEffect, useState } from 'react';
// ws
import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';
// material
import { Box, Button, CircularProgress, Container, Divider, Stack } from '@material-ui/core';
// components
import Page from 'components/Page';
import axios from 'axios';
// format
import { fDate } from 'utils/formatTime';
import { REST_URL } from 'utils/constants';

// components
import { useNavigate } from 'react-router-dom';
import { IssueScreenCard } from 'components/_dashboard/tracking';
import { useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  margin: 'auto'
};

export default function IssueScreen() {
  const { currentTT } = useSelector((state) => state.SP);
  const navigate = useNavigate();

  const backtoCash = () => {
    navigate('/cash-box');
  };

  const [loading, setLoading] = useState(false);
  // usestate hooks
  const [cookedOrders, setCookedOrders] = useState([]);
  const [cookingOrders, setCookingOrders] = useState([]);
  // websockets
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState();
  const [subscription, setSubscription] = useState({});

  // подписаться на обновления сокета
  const subscribeUpdates = () => {
    const sub = client.subscribe(`/selling-point/${currentTT.id}/board`, onUpdate, null);
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
    setTimeout(() => {
      getLatestCookingOrders();
      getLatestCookedOrders();
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
    connectSocket();
    getLatestCookingOrders();
    getLatestCookedOrders();
  }, []);

  const getLatestCookingOrders = async () => {
    // Получить готовые заказы
    setLoading(true);
    const response = await axios
      .get(
        `${REST_URL}/order?orderStatusKey=COOKING&sellingPointId=${currentTT?.id}&date=${fDate(
          new Date()
        )}`
      )
      .then((resp) => {
        if (resp.data) {
          setCookingOrders(resp.data);
        } else {
          setCookingOrders([]);
        }
        setLoading(false);
      });
    return response;
  };
  const getLatestCookedOrders = async () => {
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
          setCookedOrders(resp.data);
        } else {
          setCookedOrders([]);
        }
        setLoading(false);
      });
    return response;
  };
  return (
    <Page title="Табло выдачи">
      <Container maxWidth="xl">
        <Button
          size="small"
          variant="outlined"
          color="warning"
          onClick={backtoCash}
          sx={{
            mr: '50px',
            mt: '10px'
          }}
        >
          Назад
        </Button>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" color="white" />}
          spacing={1}
          justifyContent="space-around"
          mt={1}
        >
          <Stack sx={{ width: '50%' }} textAlign="center" color="white" fontSize="30px">
            <Box
              sx={{
                padding: 2,
                bgcolor: (theme) => theme.palette.warning.dark,
                mb: 2
              }}
            >
              Готовится
            </Box>
            <Stack spacing={2}>
              {cookingOrders.map((order) => (
                <IssueScreenCard order={order} key={order.id} />
              ))}
            </Stack>
          </Stack>
          <Stack sx={{ width: '50%' }} textAlign="center" color="white" fontSize="30px">
            <Box
              component="span"
              sx={{
                padding: 2,
                bgcolor: (theme) => theme.palette.primary.dark,
                mb: 2
              }}
            >
              Готово
            </Box>
            <Stack spacing={2}>
              {loading ? (
                <CircularProgress sx={style} />
              ) : (
                cookedOrders.map((order) => <IssueScreenCard order={order} key={order.id} />)
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
      {/* <Backdrop open={loading} /> */}
    </Page>
  );
}
