import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material
import { Card, CircularProgress, Grid, Stack, Typography } from '@material-ui/core';

//
import { Empty } from 'components';
import { isEmptyObject } from 'utils/helpers';
import { fCurrency } from 'utils/formatNumber';
import { fTime } from 'utils/formatTime';

import { useSelector } from 'react-redux';
import ModalLatestOrder from './ModalLatestOrder';

// ----------------------------------------------------------------------

LatestOrders.propTypes = {
  orders: PropTypes.array.isRequired
};

const style = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  margin: 'auto'
};

export default function LatestOrders({ orders, loading }) {
  const { currentTT } = useSelector((state) => state.SP);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  // handle oppen modal accept order, to display in modal
  const handleOpenModal = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };
  const handleClose = () => {
    setCurrentOrder({});
    setOpen(false);
  };
  if (loading) return <CircularProgress sx={style} />;
  // Мб пригодится, но не точно
  // const { palette } = useTheme();
  // const readyColor = isDarkTheme(palette.mode) ? palette.primary.darker : palette.primary.lighter;
  return (
    <>
      {isEmptyObject(currentOrder) ? (
        <></>
      ) : (
        <ModalLatestOrder order={currentOrder} open={open} onClose={handleClose} />
      )}
      <Grid container spacing={3}>
        {!orders.length ? (
          <Grid item xs={12}>
            <Empty />
          </Grid>
        ) : (
          orders.map((o) => (
            <Grid key={o.id} item xs={12} sm={4}>
              <Card onClick={() => handleOpenModal(o)} sx={{ cursor: 'pointer' }}>
                <Stack direction="column" spacing={1} sx={{ p: 1 }} justifyContent="center">
                  <Stack direction="row" spacing={1} sx={{ p: 1 }} justifyContent="space-between">
                    <Typography variant="h4" textAlign="center" noWrap>
                      {/* TODO поменять как будет нормальный номер заказа */}
                      {o.orderNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 1 }} textAlign="center">
                      {fTime(o.cookingStartTime) || ''}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ p: 1 }}>
                    {o.clientName || 'Безымянный'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ p: 1 }} justifyContent="space-between">
                    <Typography variant="body2" textAlign="center" noWrap>
                      {o.orderStatus.value}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 1 }} textAlign="center">
                      {fCurrency(o.sum, currentTT.country.name)}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}
