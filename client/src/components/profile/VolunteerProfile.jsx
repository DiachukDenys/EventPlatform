// src/components/profile/VolunteerProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, Button,
  Box, Rating, Avatar, Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BASE = process.env.REACT_APP_API_URL;

export default function VolunteerProfile() {
  const { user, refreshUser, setUser } = useAuth();

  /* чернетка для редагування */
  const [draftBio, setDraftBio] = useState('');
  const [editing, setEditing]  = useState(false);
  const [reviews, setReviews]  = useState([]);

  /* коли user приходить або змінився — синхронізуємо чернетку */
  useEffect(() => {
    setDraftBio(user?.bio || '');
  }, [user?.bio]);

  /* відгуки */
  useEffect(() => {
    if (!user?._id) return;
    axios.get(`${BASE}/api/volunteers/reviews`, {
      params: { volunteer: user._id },
      withCredentials: true,
    })
    .then(res => setReviews(res.data))
    .catch(console.error);
  }, [user?._id]);

  /* зберегти */
  const saveBio = async () => {
    try {
      await axios.patch(
   `${BASE}/api/users/${user._id}`,
   { bio: draftBio },
   { withCredentials: true }
);

 // миттєво вносимо зміни у контекст
 setUser((prev) => ({ ...prev, bio: draftBio }));

// option‑2: далі можете _не_ чекати refreshUser,
 // але корисно підтягти найсвіжіші дані з БД
 refreshUser();

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Не вдалося зберегти біо');
    }
  };

  if (!user) return null;

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Волонтер
      </Typography>

      {/* -------- Про себе -------- */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Про себе</Typography>

        {editing ? (
          <>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              sx={{ my: 1 }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={saveBio}>Зберегти</Button>
              <Button color="inherit" onClick={() => setEditing(false)}>Скасувати</Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography sx={{ whiteSpace: 'pre-wrap', my: 1 }}>
              {user.bio || 'Поки що немає опису.'}
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setEditing(true)}>
              Редагувати
            </Button>
          </>
        )}
      </Box>

      {/* -------- Відгуки -------- */}
      <Typography variant="h6" gutterBottom>Відгуки</Typography>

      {reviews.length === 0 && (
        <Typography color="text.secondary">Поки що немає відгуків.</Typography>
      )}

      {reviews.map((rv) => (
        <Paper key={rv._id} sx={{ p: 2, my: 1 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              src={rv.author?.photo ? `${BASE}/uploads/${rv.author.photo}` : undefined}
            />
            <Typography variant="subtitle2">{rv.author?.name || '—'}</Typography>
            <Rating value={rv.rating} size="small" readOnly />
            <Typography variant="caption" sx={{ ml: 'auto' }}>
              {dayjs(rv.createdAt).format('DD.MM.YYYY')}
            </Typography>
          </Stack>
          <Typography sx={{ mt: 1 }}>{rv.text}</Typography>
        </Paper>
      ))}
    </Paper>
  );
}
