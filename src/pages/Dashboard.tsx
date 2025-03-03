import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
  Inventory as InventoryIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockAppointments } from '../data/mockData';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Get today's appointments
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(
    (appointment) => appointment.date.split('T')[0] === todayStr
  );

  // Calculate statistics
  const stats = {
    clients: 124,
    professionals: 8,
    services: 32,
    products: 76,
    appointmentsToday: todayAppointments.length,
    revenue: 'R$ 12.450,00',
  };

  const quickLinks = [
    { title: 'Clientes', icon: <PeopleIcon fontSize="large" />, path: '/clients', color: theme.palette.primary.main },
    { title: 'Profissionais', icon: <PersonIcon fontSize="large" />, path: '/professionals', color: '#5e35b1' },
    { title: 'Serviços', icon: <SpaIcon fontSize="large" />, path: '/services', color: '#00897b' },
    { title: 'Produtos', icon: <InventoryIcon fontSize="large" />, path: '/products', color: '#d81b60' },
    { title: 'Agenda', icon: <CalendarIcon fontSize="large" />, path: '/schedule', color: '#1e88e5' },
    { title: 'Relatórios', icon: <TrendingUpIcon fontSize="large" />, path: '/reports', color: '#fb8c00' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              Clientes
            </Typography>
            <Typography variant="h3" fontWeight="bold" mt={2}>
              {stats.clients}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }} mt={1}>
              Total de clientes cadastrados
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(135deg, #1e88e5 0%, #64b5f6 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              Agendamentos Hoje
            </Typography>
            <Typography variant="h3" fontWeight="bold" mt={2}>
              {stats.appointmentsToday}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }} mt={1}>
              Agendamentos para hoje
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              Faturamento Mensal
            </Typography>
            <Typography variant="h3" fontWeight="bold" mt={2}>
              {stats.revenue}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }} mt={1}>
              Faturamento do mês atual
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Access */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Acesso Rápido
      </Typography>
      <Grid container spacing={3} mb={4}>
        {quickLinks.map((link) => (
          <Grid item xs={6} sm={4} md={2} key={link.title}>
            <Card
              className="card-hover"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
            >
              <CardActionArea
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}
                onClick={() => navigate(link.path)}
              >
                <Box
                  sx={{
                    backgroundColor: `${link.color}15`,
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box sx={{ color: link.color }}>{link.icon}</Box>
                </Box>
                <Typography variant="subtitle1" fontWeight="medium" align="center">
                  {link.title}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Today's Appointments */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Agendamentos de Hoje
      </Typography>
      <Paper elevation={0} sx={{ p: 0, borderRadius: 2, mb: 4 }}>
        {todayAppointments.length > 0 ? (
          todayAppointments.slice(0, 5).map((appointment, index) => (
            <React.Fragment key={appointment.id}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: appointment.status === 'confirmed' ? 'success.main' : 'warning.main',
                    mr: 2,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {appointment.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.serviceName} com {appointment.professionalName}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  {new Date(appointment.date).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
              {index < todayAppointments.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Não há agendamentos para hoje.
            </Typography>
          </Box>
        )}
        {todayAppointments.length > 5 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 'medium' }}
              onClick={() => navigate('/schedule')}
            >
              Ver todos os agendamentos
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;