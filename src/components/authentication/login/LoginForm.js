import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Stack, TextField, IconButton, InputAdornment, Button } from '@material-ui/core';

import { postUserLogin } from 'features/user/userSlice';
import SnackbarErrorLogin from 'components/SnackbarErrorLogin';
import axios from 'axios';
import { DEP_URL } from 'utils/constants';
import { setCurrentTT } from 'features/sp/SPSlice';

// ----------------------------------------------------------------------

export default function LoginForm({ callback = () => {} }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarSmena, setOpenSnackbarSmena] = useState(false);
  const [openSnackbarToken, setOpenSnackbarToken] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Обязательное поле'),
    password: Yup.string().required('Обязательное поле')
  });

  const handleLogin = async ({ username, password }) => {
    const { error, payload, ...rest } = await dispatch(postUserLogin({ username, password }));
    if (payload?.error === 'unauthorized' || payload?.error === 'invalid_grant') {
      setOpenSnackbar(true);
      return;
    }
    if (payload?.status !== 200) {
      setOpenSnackbarToken(true);
      return;
    }
    if (!payload?.userInfo.active) {
      setOpenSnackbarSmena(true);
      return;
    }
    await getCurrentSP(payload?.userInfo?.id);
    navigate('/', { replace: true });
  };
  const getCurrentSP = async (id) => {
    await axios.get(`${DEP_URL}/user/${id}/shift/current`).then((resp) => {
      dispatch(setCurrentTT(resp?.data?.nodeShift?.sellingPoint));
    });
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      callback();
      handleLogin(values);
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };
  const handleCloseSnackSmena = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbarSmena(false);
  };
  const handleCloseSnackToken = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbarToken(false);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="username"
              label="Логин"
              {...getFieldProps('username')}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Пароль"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Button fullWidth size="large" type="submit" variant="contained" sx={{ mt: 4 }}>
            Войти
          </Button>
        </Form>
      </FormikProvider>
      <SnackbarErrorLogin
        title="Неверный логин или пароль"
        open={openSnackbar}
        handleClose={handleClose}
      />
      <SnackbarErrorLogin
        title="Ваша смена закрыта"
        open={openSnackbarSmena}
        handleClose={handleCloseSnackSmena}
      />
      <SnackbarErrorLogin
        title="Ошибка авторизации"
        open={openSnackbarToken}
        handleClose={handleCloseSnackToken}
      />
    </>
  );
}
