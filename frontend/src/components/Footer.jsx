import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center', p: 2, mt: 4 }}>
      <Typography variant="body2">© {new Date().getFullYear()} EventPlatform. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
