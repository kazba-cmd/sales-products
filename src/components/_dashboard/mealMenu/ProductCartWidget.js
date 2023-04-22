import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import shoppingCartFill from '@iconify/icons-eva/shopping-cart-fill';
import { useSelector } from 'react-redux';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Badge } from '@material-ui/core';

// ----------------------------------------------------------------------

CartWidget.propTypes = {
  toggleDrawer: PropTypes.func
};

const RootStyle = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: theme.shape.borderRadiusMd,
  borderBottomLeftRadius: theme.shape.borderRadiusMd,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 }
}));

// ----------------------------------------------------------------------

export default function CartWidget({ toggleDrawer }) {
  const { cartList } = useSelector((state) => state.cart);
  return (
    <RootStyle onClick={toggleDrawer(true)}>
      <Badge showZero badgeContent={cartList.length} color="error" max={99}>
        <Icon icon={shoppingCartFill} width={24} height={24} />
      </Badge>
    </RootStyle>
  );
}
