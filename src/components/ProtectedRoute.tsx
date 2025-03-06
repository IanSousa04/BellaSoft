import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  const { isAutenticado, isCarregando } = useAuth();

  if (isCarregando) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;