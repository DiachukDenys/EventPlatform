import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Avatar, Grid, CircularProgress, Paper, Box, LinearProgress
} from '@mui/material';
import EventCardForOrganizer from '../components/EventCardForOrganizer';

const PublicOrganizerPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${id}/public`)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 6 }} />;
  if (!profile)  return <Typography variant="h6">Організатора не знайдено</Typography>;

  const { user, events } = profile;

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.photo ? `${process.env.REACT_APP_API_URL}/${user.photo}` : undefined}
                  sx={{ width: 64, height: 64 }}/>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary">Організатор</Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Події організатора</Typography>
      {events.length === 0 ? (
        <Typography color="text.secondary">Подій ще немає.</Typography>
      ) : (
        <Grid container spacing={2}>
          {events.map(ev => (
            <Grid item xs={12} sm={6} md={4} key={ev._id}>
              <EventCardForOrganizer
                event={ev}
                onDelete={() => {}}          
                hideActions                 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PublicOrganizerPage;
