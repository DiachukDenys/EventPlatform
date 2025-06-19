import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Typography,
  Paper,
  Box,
  Rating,
  TextField,
  Button,
} from '@mui/material';
import dayjs from 'dayjs';

const BASE = process.env.REACT_APP_API_URL;

const VolunteerPublicProfile = () => {
  const { id } = useParams();
  const [vol, setVol] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rate, setRate] = useState(5);

  /* ------------------------------------------------------------------ */
  /* helpers                                                             */
  /* ------------------------------------------------------------------ */

  const fetchReviews = async () => {
    const { data } = await axios.get(
      `${BASE}/api/volunteers/reviews`,
      { params: { volunteer: id }, withCredentials: true }
    );
    setReviews(data);
  };

  /* ------------------------------------------------------------------ */
  /* load profile + reviews                                              */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    (async () => {
      // публічний профіль
      const u = await axios.get(
        `${BASE}/api/users/${id}/public`,
        { withCredentials: true }
      );
      // бекенд може повернути { user: {...} } або просто {...}
      setVol(u.data.user ?? u.data);

      // відгуки
      await fetchReviews();
    })();
  }, [id]);

  /* ------------------------------------------------------------------ */
  /* submit review                                                       */
  /* ------------------------------------------------------------------ */

  const submitReview = async () => {
    if (!text.trim()) return;
    await axios.post(
      `${BASE}/api/volunteers/reviews`,
      { volunteerId: id, text, rating: rate },
      { withCredentials: true }
    );
    setText('');
    await fetchReviews();
  };

  if (!vol) return null;

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box display="flex" gap={2}>
        <Avatar
          src={vol.photo ? `${BASE}/uploads/${vol.photo}` : undefined}
          sx={{ width: 120, height: 120 }}
        />
        <Box>
          <Typography variant="h5">{vol.name}</Typography>
          <Rating value={vol.avgRating || 0} precision={0.5} readOnly />
          {vol.bio && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {vol.bio}
            </Typography>
          )}
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Відгуки
      </Typography>

      {reviews.map((rv) => (
        <Paper key={rv._id} sx={{ p: 2, my: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={
                rv.author?.photo
                  ? `${BASE}/uploads/${rv.author.photo}`
                  : undefined
              }
            />
            <Typography variant="subtitle2">
              {rv.author?.name || '—'}
            </Typography>
            <Rating value={rv.rating} size="small" readOnly />
            <Typography variant="caption" sx={{ ml: 'auto' }}>
              {dayjs(rv.createdAt).format('DD.MM.YYYY')}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {rv.text}
          </Typography>
        </Paper>
      ))}

      <Typography variant="h6" sx={{ mt: 3 }}>
        Залишити відгук
      </Typography>
      <Rating value={rate} onChange={(_, v) => setRate(v || 1)} />
      <TextField
        fullWidth
        multiline
        rows={3}
        sx={{ my: 1 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="contained" onClick={submitReview}>
        Надіслати
      </Button>
    </Paper>
  );
};

export default VolunteerPublicProfile;
