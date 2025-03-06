import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('ian04sousa@gmail.com');
  const [password, setPassword] = useState('856247k4I@');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false); // Estado para o Snackbar

  const { entrar } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setSnackOpen(true);
      return;
    }

    setLoading(true);
    try {
      const success = await entrar(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('E-mail ou senha inválidos.');
        setSnackOpen(true);
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnack = () => {
    setSnackOpen(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(245, 240, 245)',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          maxWidth: '900px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Scissors size={64} color="white" />
            <Typography variant="h4" component="h1" fontWeight="bold" mt={2}>
              BellaSoft
            </Typography>
            <Typography variant="body1" mt={1}>
              Gestão eficiente e descomplicada
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: '1',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold" mb={1}>
            Bem-vindo(a)
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Faça login para acessar o sistema
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@bellasoft.com"
              autoComplete="email"
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
              <Link href="#" underline="hover">
                Esqueci minha senha
              </Link>
            </Box>
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.5 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Credenciais de demonstração:
              <br />
              Email: demo@bellasoft.com | Senha: demo123
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar para exibir erros */}
      <Snackbar open={snackOpen} autoHideDuration={5000} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnack} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
