import React from 'react';
import { Button, Box, Typography } from '@mui/material';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    // можна логувати в Sentry / console
    console.error('UI error:', err, info);
  }

  handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    /* кастомна сторінка */
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Упс… Щось пішло не так 😔
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Спробуйте перезавантажити сторінку або поверніться на головну.
        </Typography>
        <Button variant="contained" onClick={this.handleReload}>
          Перезавантажити
        </Button>
      </Box>
    );
  }
}
