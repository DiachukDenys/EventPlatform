import { React, useRef} from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import OrganizerProfile from '../components/profile/OrganizerProfile';
import VolunteerProfile from '../components/profile/VolunteerProfile';
import InvestorProfile from '../components/profile/InvestorProfile';

const Profile = () => {
  const { user, activeRole, uploadPhoto } = useAuth();

    const fileInputRef = useRef();

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    uploadPhoto(file); // <- функція з контексту або локально
  }
};

  if (!user || !activeRole) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Ви не авторизовані або не обрано роль
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Мій профіль
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT SIDE — Avatar + Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                src={user.photo ? `http://localhost:5000/uploads/${user.photo}` : undefined}
                alt={user.name}
                sx={{ width: 160, height: 160 }}
              />
              <Button onClick={() => fileInputRef.current?.click()} variant="outlined" size="small">
                Змінити фото
              </Button>
              <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  style={{ display: 'none' }}
  onChange={handlePhotoChange}
/>

              <Box textAlign="center" mt={2}>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                {user.phone && (
                  <Typography variant="body2" color="text.secondary">
                    Телефон: {user.phone}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Активна роль: <strong>{activeRole}</strong>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SIDE — Role-Specific */}
        <Grid item xs={12} md={12}>
          
            {activeRole === 'Організатор' && <OrganizerProfile />}
            {activeRole === 'Волонтер' && <VolunteerProfile />}
            {activeRole === 'Інвестор' && <InvestorProfile />}
        
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
