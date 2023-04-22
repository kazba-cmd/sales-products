import PropTypes from 'prop-types';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, IconButton, Modal, Stack, Typography } from '@material-ui/core';
// icons
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';

//
const dummyFunc = () => {};

const RootStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  minHeight: 200,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.customShadows.z24,
  outline: 'none',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    width: '70vw'
  },
  [theme.breakpoints.down('sm')]: {
    width: '90vw'
  }
}));

ModalRawError.propTypes = {
  label: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

function ModalRawError({ label = '', open = false, handleClose = dummyFunc }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <RootStyle>
        <Stack direction="row" justifyContent="flex-end">
          <IconButton onClick={handleClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>
        <Stack direction="column" mt={1}>
          <Typography variant="h5" align="center">
            {label}
          </Typography>
        </Stack>
      </RootStyle>
    </Modal>
  );
}
export default ModalRawError;
