import React from 'react';
import { Switch } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from 'features/stuff/stuffSlice';

function ThemeSwitcher() {
  const { theme } = useSelector((state) => state.stuff);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(changeTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Switch
      checked={theme === 'light'}
      onChange={toggleTheme}
      color="primary"
      name="checkedB"
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  );
}

export default ThemeSwitcher;
