import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Divider } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
//
import { isDarkTheme } from 'utils/helpers';
import { fCurrency } from 'utils/formatNumber';
import { useSelector } from 'react-redux';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: isDarkTheme(theme.palette.mode)
    ? theme.palette.info.darker
    : theme.palette.info.lighter,
  borderRadius: theme.shape.borderRadiusMd,
  padding: theme.spacing(2)
}));

CashSummary.propTypes = {
  customerCash: PropTypes.number
};

function CashSummary({ totalPrice, customerCash, isCashEnough, customerChange }) {
  const { currentTT } = useSelector((state) => state.SP);
  return (
    <StyledBox sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Общая сумма:</Typography>
        <Typography variant="h5">{fCurrency(totalPrice, currentTT.country.name)}</Typography>
      </Stack>
      <Divider orientation="horizontal" sx={{ my: 1 }} />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body1">Принято:</Typography>
        <Typography variant="body1">{fCurrency(customerCash, currentTT.country.name)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body1">Сдача:</Typography>
        <Typography variant="body1">
          {isCashEnough
            ? fCurrency(customerChange, currentTT.country.name)
            : 'Не достаточно средств'}
        </Typography>
      </Stack>
    </StyledBox>
  );
}

export default CashSummary;
