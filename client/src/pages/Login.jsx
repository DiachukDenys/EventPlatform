import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate('/profile');
    } else {
      alert('Невірний email або пароль');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
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
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
