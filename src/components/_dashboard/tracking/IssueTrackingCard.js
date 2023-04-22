// material
import { Card, Typography, Stack } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

//
import { fCurrency } from 'utils/formatNumber';
import { useSelector } from 'react-redux';

IssueTrackingCard.propTypes = {
  order: PropTypes.object
};

export default function IssueTrackingCard({ order, handleOpen }) {
  const { currentTT } = useSelector((state) => state.SP);
  const openModal = () => {
    handleOpen(order);
  };

  return (
    <>
      <Card onClick={openModal}>
        <Stack direction="column" spacing={1} sx={{ p: 2 }} justifyContent="center">
          <Stack
            direction="row"
            spacing={1}
            sx={{ p: 2 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" textAlign="center" noWrap>
              {/* TODO поменять как будет нормальный номер заказа */}
              {order.orderNumber}-{order.orderCompositions.length}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 4 }}>
            <Typography variant="body2" sx={{ ml: 1 }} textAlign="left">
              {order.givenTime || '00:00'}
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }} textAlign="right">
              {fCurrency(order.sum, currentTT.country.name)}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
