import React from 'react';
import { Stack, Typography } from '@material-ui/core';

import { fCurrency } from 'utils/formatNumber';
import { useSelector } from 'react-redux';

const KEYS = {
  averageCheck: 'Средний чек',
  averageCookingTime: 'Время приготовления',
  averageReceptionTime: 'Время принятия',
  totalAmount: 'Количество заказов'
};

function Stats({ stats }) {
  const { currentTT } = useSelector((state) => state.SP);
  return (
    <Stack
      direction="row"
      spacing={4}
      sx={{ p: 2 }}
      justifyContent="space-between"
      textAlign="center"
      mb={2}
    >
      {Object.entries(stats).map(([key, value]) => (
        <Stack key={key}>
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }} textAlign="center">
            {KEYS[key]}
          </Typography>
          <Typography>
            {key === 'averageCheck' ? fCurrency(value, currentTT.country.name) : value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default Stats;
