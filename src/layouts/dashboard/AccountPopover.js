import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import personFill from '@iconify/icons-eva/person-fill';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, setCurrentUser } from 'features/user/userSlice';
// material
import { alpha } from '@material-ui/core/styles';
import { Avatar, Box, Button, Divider, IconButton, MenuItem, Typography } from '@material-ui/core';
//
// components
import MenuPopover from 'components/MenuPopover';

//
import { useNavigate } from 'react-router-dom';
import account from '../../_mocks_/account';
import AddSeller from '../../components/AddSeller';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  // redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loggedUsers } = useSelector((state) => state.user);
  // hooks
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [qrReaderOpen, setQrReaderOpen] = useState(false);

  // Modal
  const handleQrModalOpen = () => setQrReaderOpen(true);
  const handleQrModalClose = () => setQrReaderOpen(false);

  // Popover
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    userInfo: { id }
  } = currentUser;

  const activeUser = loggedUsers.find((user) => user.userInfo.id === currentUser.userInfo.id);

  const handleChangeUser = (user) => {
    if (user.userInfo.id !== id) dispatch(setCurrentUser(user));
    navigate(0);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 280 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1 " noWrap>
            Пользователи
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {loggedUsers.map((user) => (
          <MenuItem
            key={user.userInfo.id}
            onClick={() => {
              handleChangeUser(user);
            }}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={personFill}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {user.userInfo.name}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={handleQrModalOpen}>
            Добавить Кассира
          </Button>
          <Divider sx={{ my: 1 }} />
          <Button
            color="error"
            variant="outlined"
            fullWidth
            onClick={() => dispatch(deleteUser(id))}
          >
            Выйти
          </Button>
        </Box>
      </MenuPopover>
      <AddSeller open={qrReaderOpen} handleClose={handleQrModalClose} />
    </>
  );
}
