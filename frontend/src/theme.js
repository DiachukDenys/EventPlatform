// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // темно-зелений (подібний до "миру")
      light: '#60ad5e',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a5d6a7', // світло-зелений
      contrastText: '#000',
    },
    background: {
      default: '#f1f8e9', // дуже світлий зелений/білий
      paper: '#ffffff', // білий для паперових контейнерів
    },
    text: {
      primary: '#2e7d32', // темно-зелений для тексту
      secondary: '#4caf50', // світло-зелений
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export default theme;
