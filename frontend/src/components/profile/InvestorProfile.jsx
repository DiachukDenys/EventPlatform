import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Typography, Box, Avatar, Stack, Divider, CircularProgress, Link as MuiLink
} from '@mui/material';
import { Paid as PaidIcon } from '@mui/icons-material';
import { Link} from 'react-router-dom';   // ⬅️ додали

const InvestorProfile = () => {
  const [donations, setDonations] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/payments/my`, { withCredentials: true })
      .then(res => setDonations(res.data))
      .catch(err => {
        console.error(err);
        setError('Не вдалося отримати ваші донати');
      });
  }, []);

  if (error)            return <Typography color="error">{error}</Typography>;
  if (donations === null) return <CircularProgress sx={{ mt: 4 }} />;

  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Paper sx={{ p: 3, mt: 2, minWidth: 700 }}>
      <Typography variant="h5" gutterBottom>Кабінет інвестора</Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Загалом інвестовано: {total.toLocaleString()} ₴
      </Typography>

      {donations.length === 0 ? (
        <Typography color="text.secondary">Ви ще не робили внесків.</Typography>
      ) : (
        <Box>
          {donations.map((d, idx) => {
            const event = d.event;                     // коротший доступ
            const hasEvent = Boolean(event && event._id);

            return (
              <Box key={idx} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={event?.images?.[0] ? `${process.env.REACT_APP_API_URL}/${event.images[0]}` : undefined}
                    variant="rounded"
                  >
                    <PaidIcon />
                  </Avatar>

                  <Box>
                    {hasEvent ? (
                      <MuiLink
                        component={Link}
                        to={`/event/${event._id}`}
                        underline="hover"
                        fontWeight={600}
                      >
                        {event.title}
                      </MuiLink>
                    ) : (
                      <Typography fontWeight={600}>Подію видалено</Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {new Date(d.date).toLocaleDateString('uk-UA')} — 
                      {d.amount.toLocaleString()} ₴
                    </Typography>

                    {event?.organizer && (
                      <Typography variant="body2" component={Link} to={`/organizer/${d.event.organizer._id}`} style={{ textDecoration: 'none' }}>
  Організатор:{d.event.organizer.name}
</Typography>
                    )}
                  </Box>
                </Stack>

                {idx !== donations.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default InvestorProfile;
