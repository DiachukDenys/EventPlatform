import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';



export const AccessElement = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  const hasAccess = user?.roles?.some(role => allowedRoles.includes(role));

  if (!hasAccess) {
    return null; // нічого не рендериться, якщо немає доступу
  }

  return <>{children}</>;
};

export const HideLoginElement = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  const hasAccess = user?.roles?.some(role => allowedRoles.includes(role));

  if (hasAccess) {
    return null; // нічого не рендериться, якщо немає доступу
  }

  return <>{children}</>;
};


export const AccessControl = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasAccess = user?.roles?.some(role => allowedRoles.includes(role));

  if (!hasAccess) {
    const missingRolesText = allowedRoles.join(', ');

    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 5, p: 3, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Доступ заборонено
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ця сторінка доступна лише користувачам з наступними ролями: <strong>{missingRolesText}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/events')}
          >
            На головну
            </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

