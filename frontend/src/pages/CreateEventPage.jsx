import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Checkbox,
  Alert,
  FormControlLabel,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import {AccessControl} from '../components/AccessControl';
const CreateEventPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    endDate: '',
    image: '',
    targetAmount: '',
  });
const [errors, setErrors] = useState([]);
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [oneDayOnly, setOneDayOnly] = useState(true);

  const { user } = useAuth(); // ← витягуємо користувача з AuthContext
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrors([]);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (oneDayOnly) setEndDate(newStartDate);
    setErrors([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];
     if (!form.title.trim()) validationErrors.push('Назва події обовʼязкова.');
    if (!form.description.trim()) validationErrors.push('Опис події обовʼязковий.');
    if (!form.location.trim()) validationErrors.push('Локація події обовʼязкова.');
    if (!startDate) validationErrors.push('Дата початку обовʼязкова.');
    if (!endDate) validationErrors.push('Дата завершення обовʼязкова.');
    if (new Date(endDate) < new Date(startDate)) {
      validationErrors.push('Дата завершення не може бути раніше за дату початку.');
    }

    if (!user || !user.id) {
      validationErrors.push('Користувача не знайдено або він неавторизований.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (!user || !user.id) {
        throw new Error('Користувача не знайдено або він неавторизований');
      }
      const eventData = {
  ...form,
  startDate,
  endDate,
  organizer: user.id,
};

      await axios.post(`${process.env.REACT_APP_API_URL}/api/events/createEvent`, eventData);
      navigate('/events');
    } catch (error) {
const serverError =
        error.response?.data?.message || 'Помилка при створенні події на сервері.';
      setErrors([serverError]);
    }    
  };

  return (
    <AccessControl allowedRoles={['Організатор']}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3} align="center">
            Створити нову подію
          </Typography>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Назва події"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Опис"
              name="description"
              value={form.description}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Локація"
              name="location"
              value={form.location}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              label="Дата початку"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
              margin="normal"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={oneDayOnly}
                  onChange={(e) => {
                    setOneDayOnly(e.target.checked);
                    if (e.target.checked) setEndDate(startDate);
                  }}
                />
              }
              label="Подія триває один день"
            />

            <TextField
              label="Дата завершення"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={oneDayOnly}
              required
              fullWidth
              margin="normal"
            />
            <TextField
  fullWidth
  label="Необхідна сума (грн)"
  name="targetAmount"
  type="number"
  value={form.targetAmount}
  onChange={handleChange}
  required
  margin="normal"
/>

            <TextField
              fullWidth
              label="Посилання на зображення"
              name="image"
              value={form.image}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Створити подію
            </Button>
          </Box>
        </Paper>
      </Container>
    </AccessControl>
  );
};


export default CreateEventPage;