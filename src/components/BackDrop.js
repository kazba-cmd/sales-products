import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

function BackDrop({ open }) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BackDrop;
