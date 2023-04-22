import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';

export default function Test() {
  // usestate hooks
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState();
  const [subscription, setSubscription] = useState({});

  const subscribeUpdates = () => {
    const sub = client.subscribe('/tochka/TT_1', onUpdate, null);
    setSubscription(sub);
  };

  const unsubscribeUpdates = () => {
    subscription.unsubscribe();
  };

  const connectSocket = async () => {
    const sockjs = new SockJS('http://194.39.67.138:8000/ws/registries/dataUpdated');
    const client = webstomp.over(sockjs, { debug: false });
    client.connect({}, (e) => {
      // успешно подключились
      if (e.command === 'CONNECTED') {
        setConnected(true);
      }
    });
    setClient(client);
  };

  const onUpdate = ({ body = '{}' }) => {
    // do whatever you want, eg. setState to update view
    const registryCode = JSON.parse(body);
    if (registryCode === 'zakaz') {
      console.log('ok');
    }
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
    // cleanup
    return () => closeConnection;
  }, [client, connected]);

  // connect on page load
  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <>
      <Button onClick={closeConnection}> Close connection </Button>
      <Button onClick={subscribeUpdates}> Subscribe updates </Button>
    </>
  );
}
