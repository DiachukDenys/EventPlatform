import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {AccessControl} from './components/AccessControl.jsx';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreateEventPage from './pages/CreateEventPage';
import EventPage from './pages/Event';
import AllEventsPage from './pages/AllEventsPage';
import EditEventPage from './pages/EditEventPage';
import PaymentPage from './pages/PaymentPage';
import PublicOrganizerPage from './pages/PublicOrganizerPage.jsx';
import VolunteerApplyPage      from './pages/VolunteerApplyPage';
import ApplicationsManagePage  from './pages/ApplicationsManagePage';
import VolunteerPublicProfile  from './pages/VolunteerPublicProfile';
import NotFound from './pages/NotFound';
function App() {
  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Box component="main" flex={1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/events" element={<AllEventsPage/>}/>
            <Route path="/events/createEvent" element={<CreateEventPage />} />
            <Route path="/event/:id/edit" element={<EditEventPage/>} />
            <Route path="/event/:id/payment" element={<PaymentPage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/organizer/:id" element={<PublicOrganizerPage />} />
            <Route path="/event/:id/apply"      element={
              <AccessControl allowedRoles={['Волонтер']}><VolunteerApplyPage /> </AccessControl> 
              } />
            <Route path="/organizer/applications" element={
              <AccessControl allowedRoles={['Організатор']}><ApplicationsManagePage /></AccessControl>
              } />
            <Route path="/volunteer/:id"        element={<VolunteerPublicProfile />} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;
