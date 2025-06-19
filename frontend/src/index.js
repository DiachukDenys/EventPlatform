import { AuthProvider } from './context/AuthContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);