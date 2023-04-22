import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import {
  Button,
  Container,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@material-ui/core';
import QrModal from 'components/QrModal';
import QrGenerator from '../../QrGenerator';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  }
}));

const INSTRUCTIONS = [
  {
    name: 'Приготовьте вашу карту с QR-кодом'
  },
  {
    name: 'Наведите QR-код на камеру'
  },
  {
    name: 'Готово! Вы авторизовались!'
  }
];

export default function AlignItemsList() {
  const classes = useStyles();
  const [qrReaderOpen, setQrReaderOpen] = useState(false);
  const [qrGeneratorOpen, setQrGeneratorOpen] = useState(false);
  const handleOpen = () => setQrReaderOpen(true);
  const handleClose = () => setQrReaderOpen(false);
  const handleOpenG = () => setQrGeneratorOpen(true);
  const handleCloseG = () => setQrGeneratorOpen(false);

  return (
    <Container maxWidth="xl">
      <List className={classes.root}>
        {INSTRUCTIONS.map((inst, i) => (
          <div key={i}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={`/static/mock-images/count/${i + 1}.png`} />
              </ListItemAvatar>
              <ListItemText primary={inst.name} />
            </ListItem>
            {i !== INSTRUCTIONS.length - 1 && <Divider variant="inset" component="li" />}
          </div>
        ))}
      </List>
      <Button
        sx={{ mt: 2 }}
        fullWidth
        size="large"
        color="secondary"
        variant="contained"
        onClick={handleOpen}
      >
        Войти по QR
      </Button>
      <Button
        sx={{ mt: 2 }}
        fullWidth
        size="large"
        color="secondary"
        variant="contained"
        onClick={handleOpenG}
      >
        Сгенерировать QR
      </Button>
      <QrModal open={qrReaderOpen} handleClose={handleClose} />
      <QrGenerator open={qrGeneratorOpen} handleClose={handleCloseG} />
    </Container>
  );
}
