import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: 'center',
          maxWidth: 500,
        }}
      >
        <Scissors size={64} color="#9c27b0" />
        <Typography variant="h1" component="h1" fontWeight="bold" sx={{ mt: 2, fontSize: '5rem' }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" fontWeight="medium" sx={{ mt: 2 }}>
          Página não encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          A página que você está procurando não existe ou foi movida.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{ mt: 4 }}
        >
          Voltar para o início
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;