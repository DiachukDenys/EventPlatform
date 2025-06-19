// EventCardForOrganizer.jsx
import {
  Card, CardMedia, CardContent,
  Typography, Button, Box, LinearProgress, Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';

const EventCardForOrganizer = ({
  event,
  onDelete,
  hideActions = false,
}) => {
  // ➤ нові поля  (за замовчуванням порожні)
  const {
    _id,
    title           = 'Без назви',
    description     = '',
    collectedAmount = 0,
    targetAmount    = 1,
    image           = '',        // ①  ← одне фото‑URL
    images          = [],        // ②  ← масив (якщо залишився)
  } = event;

  /** 1️⃣ Вибираємо превʼю
   *    пріоритет: image (рядок) → перший із images */
  const preview =
    image?.trim() ||
    (Array.isArray(images) && images.length ? images[0] : '');

  /** 2️⃣ Якщо превʼю відносне («uploads/…») — додаємо хост */
  const previewSrc = preview.startsWith('http')
    ? preview
    : preview
    ? `${process.env.REACT_APP_API_URL}/${preview}`
    : ''; // порожній ⇒ не рендеримо <CardMedia/>

  const progress = Math.min(100, (collectedAmount / targetAmount) * 100);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', }}>
      {previewSrc && (
        <CardMedia
          component="img"
          height="140"
          image={previewSrc}
          alt={title}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          <Link to={`/event/${_id}`} style={{ textDecoration: 'none' }}>
            {title}
          </Link>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description.length > 40 ? `${description.slice(0, 40)}…` : description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Зібрано: {collectedAmount.toLocaleString()} / {targetAmount.toLocaleString()} ₴
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>

        {!hideActions && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              to={`/event/${_id}/edit`}
            >
              Редагувати
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onDelete?.(_id)}
            >
              Видалити
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCardForOrganizer;
