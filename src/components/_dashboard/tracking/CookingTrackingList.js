import PropTypes from 'prop-types';
// material
import { CircularProgress, Stack } from '@material-ui/core';
//
import axios from 'axios';
import { Empty } from 'components';
import { REST_URL } from 'utils/constants';
import { formatISO } from 'date-fns';
import { СookingTrackingCard } from 'components/_dashboard/tracking';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

CookingTrackingList.propTypes = {
  orders: PropTypes.array
};
const style = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  margin: 'auto'
};

export default function CookingTrackingList({ orders, loading, onOrderReady }) {
  const navigate = useNavigate();
  // при нажатии кнопки заказ готов
  const handleReady = async (order) => {
    await updateOrder(order).then(onOrderReady);
  };
  const updateOrder = async (order) => {
    const vremya_zaversheniya_gotovki = formatISO(new Date());
    order.cookingEndTime = vremya_zaversheniya_gotovki;
    order.orderStatus = {
      id: 2,
      key: 'COOKED',
      value: 'Готов',
      deleted: false
    };
    const response = await axios.put(`${REST_URL}/order`, order);
    navigate('/cooking-tracking');
    return response;
  };

  if (loading) return <CircularProgress sx={style} />;

  return (
    <Stack spacing={2}>
      {orders.length ? (
        orders
          .reverse()
          .map((order) => (
            <СookingTrackingCard order={order} handleReady={handleReady} key={order.id} />
          ))
      ) : (
        <Empty />
      )}
    </Stack>
  );
}
