import { useState } from 'react';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Stack, Container, Typography, Card } from '@material-ui/core';
// layouts
// components
import { LoginForm, Instructions } from 'components/authentication/login';
import Page from 'components/Page';
import QrModal from 'components/QrModal';

import { MHidden } from 'components/@material-extend';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const [qrReaderOpen, setQrReaderOpen] = useState(false);
  const handleClose = () => setQrReaderOpen(false);

  return (
    <RootStyle title="">
      {/* <MHidden width="mdDown">
        <SectionStyle>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
          <Instructions />
        </SectionStyle>
      </MHidden> */}

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Введите логин и пароль
            </Typography>
            {/* <Typography sx={{ color: 'text.secondary' }}>Либо войдите по QR коду.</Typography> */}
          </Stack>

          <LoginForm />
        </ContentStyle>
      </Container>
      <QrModal open={qrReaderOpen} handleClose={handleClose} />
    </RootStyle>
  );
}
