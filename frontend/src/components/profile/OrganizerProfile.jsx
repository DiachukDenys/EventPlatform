import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Pagination
} from '@mui/material';
import { AccessElement } from '../AccessControl';
import { useAuth } from '../../context/AuthContext';
import EventCardForOrganizer from '../EventCardForOrganizer';
import {Link} from 'react-router-dom';
const OrganizerProfile = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 6; // 6 подій = 2 в ряд * 3 ряди

  const handleDelete = async (eventId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю подію?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error('Помилка при видаленні події:', error);
      alert('Не вдалося видалити подію. Спробуйте пізніше.');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`, {
          params: {
            organizer: user.id,
            page,
            limit: LIMIT,
          },
        });

        setEvents(res.data.events);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Помилка при завантаженні подій організатора:', err);
      }
    };

    if (user?.id) {
      fetchEvents();
    }
  }, [user, page]);

  return (
    <Paper sx={{ p: 3, mt: 2, minHeight: '600px' }}>
      <Typography variant="h5" gutterBottom>Профіль організатора</Typography>

      <AccessElement allowedRoles="Організатор">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button color="inherit" variant="outlined" component={Link} to='../events/createEvent'>
            Створити Подію
          </Button>
          <Button color="primary" variant="contained" component={Link} to='../organizer/applications'>
            Керувати заявками
          </Button>
        </Box>
      </AccessElement>

      <Typography variant="h6" sx={{ mt: 2 }}>Мої події:</Typography>

      {events.length === 0 ? (
        <Typography color="text.secondary">Подій поки немає</Typography>
      ) : (
        <>
          <Grid container spacing={2} mt={1}>
  {events.map((event) => (
    <Grid
      item
      xs={12}          
      sm={6}           
      md={4}           
      key={event._id}
      sx={{ display: 'flex' }}  
    >
      <EventCardForOrganizer
        event={event}
        onDelete={handleDelete}
        sx={{ flexGrow: 1 }}    
      />
    </Grid>
  ))}
</Grid>

          {totalPages > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default OrganizerProfile;
