import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Typography, Button, Box } from '@mui/material';
const BASE = process.env.REACT_APP_API_URL;
export default function VolunteerApplyPage() {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE}/api/volunteers/applications`, {
        eventId,
        message: msg,
      },{withCredentials: true});
      navigate(`/event/${eventId}`); // або toast + назад
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Помилка');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Заявка волонтера</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Ім’я"
          fullWidth
          margin="normal"
          value={user.name}
          disabled
        />
        <TextField
          label="Телефон"
          fullWidth
          margin="normal"
          value={user.phone}
          disabled
        />
        <TextField
          label="Е‑пошта"
          fullWidth
          margin="normal"
          value={user.email}
          disabled
        />
        <TextField
          label="Чому (і ким) хочу допомагати"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Надіслати
        </Button>
      </Box>
    </Paper>
  );
}
