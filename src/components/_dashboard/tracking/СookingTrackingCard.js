import React, { useEffect, useState } from 'react';

// material
import { Box, Button, Divider, Grid, Stack, Typography } from '@material-ui/core';
//
import { createProducts } from 'utils/helpers';
import { fTime } from 'utils/formatTime';
import { ProductCard } from 'components/_dashboard/tracking';
import { addMinutes, format } from 'date-fns';

function СookingTrackingCard({ values = {}, handleReady, id, order, uuid, ...rest }) {
  const [timer, setTimer] = useState({
    minutes: 0,
    seconds: 0,
    expired: false
  });

  // Timer
  const countDownDate = addMinutes(new Date(order.cookingStartTime), 5).getTime();

  useEffect(() => {
    if (timer.expired) {
      return;
    }
    const myfunc = setInterval(() => {
      const now = new Date().getTime();
      const timeleft = countDownDate - now;

      // get minutes, seconds
      const [minutes, seconds] = format(timeleft, 'mm:ss').split(':');
      const expired = timeleft < 0;

      setTimer({
        minutes,
        seconds,
        expired
      });
    }, 1000);

    return () => {
      clearInterval(myfunc);
    };
  });

  const products = createProducts(values);
  const qwe = products
    .map((item) => {
      const temp = [...Array(parseInt(item.quantity, 10))].fill(null).map((i) => item);
      return temp;
    })
    .flat();
  return (
    <Box key={uuid}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">{order.orderNumber}</Typography>
        <Divider
          orientation="horizontal"
          sx={{
            flex: 1,
            mx: 3
          }}
        />
        <Button
          size="large"
          variant="outlined"
          onClick={() => {
            handleReady(order);
          }}
        >
          Готово
        </Button>
      </Stack>
      <Stack justifyContent="space-between" direction="row" mb={1}>
        <Typography variant="h6" ml={1}>
          Время принятия: {fTime(order.cookingStartTime)}
        </Typography>
        <Typography variant="h6" mr={1}>
          {timer.expired ? 'Опоздали' : `${timer.minutes} : ${timer.seconds}`}
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {order.orderCompositions.map((p, index) => (
          <Grid key={index} item xs={12} sm={4}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default СookingTrackingCard;
