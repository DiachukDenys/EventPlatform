// src/pages/NotFound.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const NotFound = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h3" gutterBottom>
      404
    </Typography>
    <Typography variant="h5" gutterBottom>
      Сторінку не знайдено
    </Typography>

    <Button
      variant="contained"
      href="/"
      sx={{ mt: 3 }}
    >
      На головну
    </Button>
  </Box>
);

export default NotFound;
