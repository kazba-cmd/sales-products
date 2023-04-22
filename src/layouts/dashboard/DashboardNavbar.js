import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// redux
import { useSelector } from 'react-redux';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Stack, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import store from '_mocks_/store';
import { MHidden } from 'components/@material-extend';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  color: theme.palette.text.primary,
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));
// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const { currentUser } = useSelector((state) => state.user);
  const { currentTT } = useSelector((state) => state.SP);
  const {
    userInfo: { name, surname }
  } = currentUser;

  const fullName = `${name}  ${surname}`;

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1 }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        {/* <Searchbar /> */}

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }} ml="auto">
          <LanguagePopover />
          <Stack>
            <Typography variant="subtitle2">{fullName}</Typography>
            <Typography variant="subtitle2">{currentTT.title}</Typography>
            <Typography variant="caption" display="block">
              {store.numOfStore}
            </Typography>
          </Stack>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
