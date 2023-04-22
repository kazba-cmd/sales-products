import { alpha } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// 0: '#161C24',
// 100: '#212B36',
// 200: '#454F5B',
// 300: '#637381',
// 400: '#919EAB',
// 500: '#C4CDD5',
// 600: '#DFE3E8',
// 700: '#F4F6F8',
// 800: '#F9FAFB',
// 900: '#FFFFFF',

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  500_8: alpha('#9e9e9e', 0.08),
  500_12: alpha('#9e9e9e', 0.12),
  500_16: alpha('#9e9e9e', 0.16),
  500_24: alpha('#9e9e9e', 0.24),
  500_32: alpha('#9e9e9e', 0.32),
  500_48: alpha('#9e9e9e', 0.48),
  500_56: alpha('#9e9e9e', 0.56),
  500_80: alpha('#9e9e9e', 0.8)
};

const PRIMARY = {
  lighter: '#d4fcdb',
  light: '#befac8',
  main: '#93f7a4',
  dark: '#589462',
  darker: '#3b6342'
  // contrastText: '#000000de'
};

const SECONDARY = {
  lighter: '#fde2d3',
  light: '#fbd4bc',
  main: '#f9b790',
  dark: '#956e56',
  darker: '#64493a'
  // contrastText: '#000000de'
};

const INFO = {
  lighter: '#d3eafd',
  light: '#bcdffb',
  main: '#90caf9',
  dark: '#567995',
  darker: '#3a5164'
  // contrastText: '#000000de'
};
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800]
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#BE8E1C',
  darker: '#7A4F01',
  contrastText: GREY[800]
};
const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff'
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
};

const palette = {
  mode: 'dark',
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[500_24],
  text: { primary: GREY[0], secondary: GREY[200], disabled: GREY[400] },
  background: { paper: '#2C2C2C', default: '#2C2C2C', neutral: GREY[200] },
  action: {
    active: GREY[200],
    hover: GREY[200_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
};

export default palette;
