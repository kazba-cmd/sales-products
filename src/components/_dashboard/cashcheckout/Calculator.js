import React from 'react';
import PropTypes from 'prop-types';
// material
import { Button, Grid } from '@material-ui/core';

Calculator.propTypes = {
  inputDigit: PropTypes.func,
  clear: PropTypes.func
};

export default function Calculator({ inputDigit, clear }) {
  return (
    <Grid container spacing={2}>
      {new Array(9).fill(null).map((_, index) => (
        <Grid item xs={4} key={index}>
          <Button
            size="large"
            variant="outlined"
            sx={{ py: 4 }}
            fullWidth
            name={index + 1}
            onClick={inputDigit}
          >
            {index + 1}
          </Button>
        </Grid>
      ))}
      <Grid item xs={4}>
        <Button
          size="large"
          variant="outlined"
          sx={{ py: 4 }}
          fullWidth
          name="0"
          onClick={inputDigit}
        >
          0
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          size="large"
          variant="outlined"
          sx={{ py: 4 }}
          fullWidth
          name="00"
          onClick={inputDigit}
        >
          00
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button size="large" variant="outlined" sx={{ py: 4 }} fullWidth onClick={clear}>
          C
        </Button>
      </Grid>
    </Grid>
  );
}
