import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Professionals from './pages/Professionals';
import Services from './pages/Services';
import Products from './pages/Products';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Hooks
import { useAuth } from './hooks/useAuth';
import Cidades from './pages/Cidades';
import ClientesPage from './pages/ClientesPage';

function App() {
  const { isAutenticado } = useAuth();


  console.log('isAutenticado', isAutenticado);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <CssBaseline />
      <Routes>
        {/* Rota pública para login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientesPage />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/cidades" element={<Cidades />} />
          </Route>
        </Route>

        {/* Redirecionamentos raiz */}
        <Route 
          path="/" 
          element={<Navigate to={isAutenticado ? "/dashboard" : "/login"} replace />} 
        />
        
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;