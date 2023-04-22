import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// material
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@material-ui/core/styles';
//
import shape from './shape';
import lightPalette from './light-palette';
import darkPalette from './dark-palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
// import shadows, { customShadows } from './shadows';
import { createShadow, createCustomShadow } from './shadows';
// import palette from './light-palette';
// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node
};

export default function ThemeConfig({ children }) {
  const { theme } = useSelector((state) => state.stuff);
  const palette = theme === 'light' ? lightPalette : darkPalette;

  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      breakpoints,
      shadows: createShadow(palette),
      customShadows: createCustomShadow(palette)
    }),
    [palette]
  );

  const muitheme = createTheme(themeOptions);
  muitheme.components = componentsOverride(muitheme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muitheme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
