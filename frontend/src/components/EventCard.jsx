import React from 'react';
import { Card, Button, Box, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: 410,
        height: 300,
        maxWidth: 410,
        maxHeight: 300,
        overflow: 'hidden',
      }}
    >
      {/* Зображення зліва */}
      <Box
        component="img"
        src={event.image}
        alt={event.title}
        sx={{
          width: 160,
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Контент справа */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          p: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {event.title}
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            {new Date(event.startDate).toLocaleDateString()} –{' '}
            {new Date(event.endDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
  {event.description.length > 40
    ? `${event.description.slice(0, 40)}... `
    : event.description}
  
</Typography>

        </Box>

        {/* Кнопка "Дізнатись більше" */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/event/${event._id}`}
            fullWidth
          >
            Дізнатись більше
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
