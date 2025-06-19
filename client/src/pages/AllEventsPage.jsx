import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Link,
  Grid,
  Pagination,
  CircularProgress,
  Button,
} from '@mui/material';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { AccessElement } from '../components/AccessControl';

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 6;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/events`,
        {
          params: {
            search,
            page,
            limit,
          },
        }
      );
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Помилка при завантаженні подій', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // повертаємося на першу сторінку при новому пошуку
  };

  return (

    
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={600} mb={3} align="center">
        Усі події
      </Typography>

      <TextField
        label="Пошук події за назвою"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : events.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography align="center" color="text.secondary">
          Подій не знайдено.
        </Typography>
      )}
    </Container>
  );
};

export default AllEventsPage;
