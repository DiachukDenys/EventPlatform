import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Stack,
  Button,
  Paper,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinearProgress from '@mui/material/LinearProgress';
import { AccessElement } from '../components/AccessControl';

const BASE = process.env.REACT_APP_API_URL;

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Стан для вибраного фото у галереї (нижній блок)
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    axios.get(`${BASE}/api/events/${id}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedPhoto(res.data.images[0]);
        }
      })
      .catch(err => {
        console.error('Помилка при завантаженні події', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (!event) return <Typography variant="h6">Подію не знайдено</Typography>;

  const approvedVolunteers = event.approvedVolunteers || [];

  // Всі фото крім вибраного
  const otherPhotos = event.images?.filter(img => img !== selectedPhoto) || [];

  return (
    <Container sx={{ py: 6 }}>
      <Card>
        {/* Верхнє велике зображення події — НЕ міняється */}
        {event.image && (
          <CardMedia
            component="img"
            height="400"
            image={event.image.startsWith('http') ? event.image : `${BASE}/${event.image}`}
            alt={event.title}
            sx={{ objectFit: 'cover' }}
          />
        )}

        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {event.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
            <Avatar>
              <EventIcon />
            </Avatar>

            <Typography variant="body1">
              {new Date(event.startDate).toLocaleDateString('uk-UA')} –{' '}
              {new Date(event.endDate).toLocaleDateString('uk-UA')}
            </Typography>

            {event.location && (
              <>
                <Avatar>
                  <LocationOnIcon />
                </Avatar>
                <Typography variant="body1">{event.location}</Typography>
              </>
            )}
          </Stack>

          <Box sx={{ my: 3 }}>
            <Typography>
              Зібрано: {event.collectedAmount} / {event.targetAmount} ₴
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (event.collectedAmount / event.targetAmount) * 100)}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          <Stack direction="row" spacing={2} mb={3}>
            <Button variant="contained" component={Link} to="./payment">
              Підтримати
            </Button>
            <AccessElement allowedRoles="Волонтер">
              <Button color="inherit" variant="outlined" component={Link} to="./apply">
                Подати заявку
              </Button>
            </AccessElement>
          </Stack>

          <Typography variant="body1" mb={2}>
            {event.description}
          </Typography>

          {/* Галерея: ліворуч вибране фото, праворуч — решта */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Ліворуч - вибране фото */}
            <Paper
              elevation={3}
              sx={{
                width: 300,
                height: 300,
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {selectedPhoto ? (
                <img
                  src={`${BASE}/${selectedPhoto}`}
                  alt="selected"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#eee',
                  }}
                >
                  Немає фото
                </Box>
              )}
            </Paper>

            {/* Праворуч — інші фото */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                flexGrow: 1,
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {otherPhotos.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                  Інших фото немає
                </Typography>
              )}

              {otherPhotos.map((img, i) => (
                <Paper
                  key={i}
                  elevation={1}
                  onClick={() => setSelectedPhoto(img)}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6, borderColor: 'primary.main' },
                    border: '2px solid transparent',
                  }}
                  component="img"
                  src={`${BASE}/${img}`}
                  alt={`thumb-${i}`}
                  loading="lazy"
                />
              ))}
            </Box>
          </Box>

          {/* Список прийнятих волонтерів */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Прийняті волонтери
            </Typography>

            {approvedVolunteers.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Ще немає підтверджених волонтерів.
              </Typography>
            )}

            <Stack direction="row" spacing={2} flexWrap="wrap">
              {approvedVolunteers.map((v) => (
    <Link key={v._id} to={`/volunteer/${v._id}`} style={{ textDecoration:'none', color:'inherit' }}>
      <Stack alignItems="center" spacing={1} sx={{ width: 90 }}>
        <Avatar
          src={v.photo ? `${BASE}/uploads/${v.photo}` : undefined}
          alt={v.name}
          sx={{ width: 60, height: 60 }}
        />
        <Typography variant="body2" align="center" noWrap>
          {v.name}
        </Typography>
      </Stack>
    </Link>
  ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EventPage;
