import React from 'react';
import { Alert, Stack } from '@material-ui/core';

const DEFAULTTITLE = 'Здесь пока ничего нет';

function Empty({ title = DEFAULTTITLE }) {
  return (
    <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
      <Alert severity="info">{title}</Alert>
    </Stack>
  );
}

export default Empty;
