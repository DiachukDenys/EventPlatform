import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { VolunteerActivism, MonetizationOn, EventAvailable, EmojiPeople } from '@mui/icons-material';
import { HideLoginElement, AccessElement } from '../components/AccessControl';
import {Link} from 'react-router-dom';


const FeatureCard = ({ icon, title, description }) => (
  <Card elevation={3} sx={{ p: 2 }}>
    <CardContent>
      <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>{icon}</Avatar>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </CardContent>
  </Card>
);

const heroImage = '../../Images/carousel1.jpg';

const HomePage = () => {
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/stats/user-count`)
      .then(res => setUserCount(res.data.count))
      .catch(err => console.error('Помилка отримання кількості користувачів', err));
  }, []);

  return (
    <Box>
      {/* Hero Section with Single Image */}
      <Box
        sx={{
          height: '80vh',
          backgroundImage: `url(https://imglife.pravda.com.ua/life/images/doc/1/6/45928/16e20e3-blagodiynist-1320.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            top: 0,
            left: 0,
          }}
        />
        <Container sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Об'єднуємо зусилля заради добра
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Платформа, яка дозволяє кожному створювати, підтримувати чи знаходити благодійні ініціативи.
          </Typography>
          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <HideLoginElement allowedRoles={["Організатор","Волонтер","Інвестор"]}>
            <Button variant="contained" color="primary" component={Link} to="/register">Стати волонтером</Button>
            </HideLoginElement>
            <Button variant="outlined" color="primary" component={Link} to="/events">Переглянути події</Button>
          </Box>
        </Container>
      </Box>

      {/* Кожен знайде себе тут */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={600} align="center" gutterBottom>
          Кожен знайде себе тут
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <FeatureCard icon={<EmojiPeople />} title="Я — Волонтер" description="Допомагай фізично або інформаційно." />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard icon={<MonetizationOn />} title="Я — Інвестор" description="Фінансуй ініціативи з прозорими звітами." />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard icon={<EventAvailable />} title="Я — Організатор" description="Створюй події, знаходь підтримку." />
          </Grid>
        </Grid>
      </Container>

      {/* Лічильник користувачів */}
      <Box bgcolor="grey.100" py={6} textAlign="center">
        <Container>
          <Typography variant="h5" gutterBottom>
            Приєдналися вже:
          </Typography>
          {userCount !== null ? (
            <Typography variant="h3" color="primary" fontWeight={700}>
              {userCount} користувачів
            </Typography>
          ) : (
            <CircularProgress color="primary" />
          )}
        </Container>
      </Box>

   <HideLoginElement allowedRoles={["Організатор","Волонтер","Інвестор"]}>
      <Box bgcolor="primary.dark" color="white" py={8} textAlign="center">
        <Container>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Готові зробити світ кращим?
          </Typography>
          <Typography variant="body1" mb={4}>
            Приєднуйтесь до спільноти небайдужих вже сьогодні.
          </Typography>
          <Button variant="contained" color="secondary">
            Зареєструватися
          </Button>
        </Container>
      </Box>
      </HideLoginElement>
    </Box>
  );
};

export default HomePage;
