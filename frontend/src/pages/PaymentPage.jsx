// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const { id }      = useParams();          // id події
  const navigate    = useNavigate();
  const { user }    = useAuth();            // потрібен JWT‑cookie
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ type: '', text: '' });

  /* локальний state форми */
  const [cardNumber,  setCardNumber]  = useState('');
  const [expiryDate,  setExpiryDate]  = useState('');
  const [cvv,         setCvv]         = useState('');
  const [amount,      setAmount]      = useState('');

  /*** невеличка перевірка картки (дуже спрощена) ***/
  const isCardDataValid = () =>
    cardNumber.replace(/\s/g, '').length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiryDate) &&
    /^\d{3}$/.test(cvv) &&
    Number(amount) > 0;

  const handlePayment = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!isCardDataValid()) {
      setMsg({ type: 'error', text: 'Перевірте коректність введених даних.' });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/${id}`,
        { amount },
        { withCredentials: true }                     // ⬅️ передає cookie‑JWT
      );

      setMsg({ type: 'success', text: 'Дякуємо! Платіж успішно проведено.' });
      setTimeout(() => navigate(`/event/${id}`), 1500); // редирект через 1½ с
    } catch (err) {
      console.error(err);
      const m = err.response?.data?.message || 'Помилка на сервері';
      setMsg({ type: 'error', text: m });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form"
         onSubmit={handlePayment}
         sx={{ maxWidth: 420, mx: 'auto', mt: 5, p: 3,
               border: '1px solid #ccc', borderRadius: 2 }}>

      <Typography variant="h6" gutterBottom>Зробити внесок</Typography>

      {msg.text && (
        <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>
      )}

      <TextField
        label="Номер картки"
        placeholder="0000 0000 0000 0000"
        fullWidth required sx={{ mb: 2 }}
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="MM/YY"
          placeholder="12/30"
          required fullWidth
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <TextField
          label="CVV"
          placeholder="123"
          required fullWidth
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
      </Box>

      <TextField
        label="Сума (₴)"
        type="number" fullWidth required sx={{ mb: 3 }}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Button type="submit" fullWidth variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={26} /> : 'Оплатити'}
      </Button>
    </Box>
  );
};

export default PaymentPage;
