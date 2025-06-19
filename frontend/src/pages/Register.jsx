import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box,
  FormGroup, FormControlLabel, Checkbox, InputAdornment, IconButton, FormHelperText
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const roleOptions = ['Організатор', 'Волонтер', 'Інвестор'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    roles: []
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const isPasswordValid = password => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  const isPhoneValid = phone => /^\+380\d{9}$/.test(phone);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    setFormData(prev => ({ ...prev, phone: '+380' + digits }));
  };

  const handleRoleChange = e => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не збігаються!';
    }

    if (!isPasswordValid(formData.password)) {
      newErrors.password = 'Пароль має містити мінімум 8 символів, хоча б одну літеру та одну цифру';
    }

    if (!isPhoneValid(formData.phone)) {
      newErrors.phone = 'Телефон має бути у форматі +380XXXXXXXXX';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      roles: formData.roles
    };

    const success = await register(payload);
    if (success) {
      navigate('/profile');
    } else {
      alert('Реєстрація не вдалася');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>Реєстрація</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Ім'я"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Номер телефону"
            name="phone"
            defaultValue="+380"
            onChange={handlePhoneChange}
            required
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            label="Повторіть пароль"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <FormGroup sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Обери роль (можна декілька):</Typography>
            {roleOptions.map(role => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    checked={formData.roles.includes(role)}
                    onChange={handleRoleChange}
                    value={role}
                  />
                }
                label={role}
              />
            ))}
          </FormGroup>

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
            Зареєструватись
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
