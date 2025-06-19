import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button,IconButton, Typography, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';


const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
const base = process.env.REACT_APP_API_URL;
  useEffect(() => {
  axios.get(`${base}/api/events/${id}`)
    .then(res => {
      setDescription(res.data.description);

      // одразу нормалізуємо шляхи при завантаженні
      const imgs = (res.data.images || []).map(img =>
        img.startsWith('http') ? img : `${base}/${img}`
      );
      setExistingImages(imgs);
    })
    .catch(err => console.error(err));
}, [id, base]);
const handleRemoveImage = (indexToRemove) => {

  setExistingImages(prev =>
    prev.filter((_, index) => index !== indexToRemove)
  );
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('existingImages', JSON.stringify(existingImages));
    images.forEach((image) => formData.append('images', image));

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/event/${id}`);
    } catch (error) {
      console.error('Помилка при оновленні:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h5">Редагувати подію</Typography>
      <TextField
        fullWidth
        label="Опис"
        value={description}
        multiline 
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Завантажити фото
        <input type="file" hidden multiple onChange={(e) => setImages([...e.target.files])} />
      </Button>

      <Box sx={{ mt: 2 }}>
  <Typography>Існуючі фото:</Typography>
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
  {existingImages.map((img, index) => {
    const src =  img;
    console.log(src);
    return (
      <Box
        key={index}
        sx={{
          position: 'relative',
          width: 100,
          height: 100,
          overflow: 'hidden',
          borderRadius: 2,
          '&:hover .overlay': { opacity: 1 },
        }}
      >
        <img
          src={src}
          alt={`event-${index}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* затемнення + кнопка видалення */}
        <Box
          className="overlay"
          onClick={() => handleRemoveImage(index)}
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            opacity: 0,
            transition: 'opacity .25s',
            cursor: 'pointer',
          }}
        >
          <DeleteIcon fontSize="small" />
          <Typography variant="caption">Видалити</Typography>
        </Box>
      </Box>
    );
  })}
</Box>
</Box>

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>
        Оновити подію
      </Button>
    </Box>
  );
};

export default EditEventPage;
