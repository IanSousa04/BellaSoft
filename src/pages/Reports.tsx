import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Card,
  CardContent,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { mockAppointments, mockClients, mockProfessionals, mockProducts, mockServices } from '../data/mockData';
import { parseISO, format, isWithinInterval, subMonths } from 'date-fns';

const Reports = () => {
  const theme = useTheme();
  const [reportType, setReportType] = useState('revenue');
  const [startDate, setStartDate] = useState<Date | null>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [professionalId, setProfessionalId] = useState('all');
  const [serviceCategory, setServiceCategory] = useState('all');

  const handleReportTypeChange = (event: SelectChangeEvent<string>) => {
    setReportType(event.target.value);
  };

  const handleProfessionalChange = (event: SelectChangeEvent<string>) => {
    setProfessionalId(event.target.value);
  };

  const handleServiceCategoryChange = (event: SelectChangeEvent<string>) => {
    setServiceCategory(event.target.value);
  };

  // Get unique service categories
  const serviceCategories = ['all', ...Array.from(new Set(mockServices.map((service) => service.category)))];

  // Filter appointments by date range and professional
  const filteredAppointments = mockAppointments.filter((appointment) => {
    const appointmentDate = parseISO(appointment.date);
    const isInDateRange = startDate && endDate 
      ? isWithinInterval(appointmentDate, { start: startDate, end: endDate })
      : true;
    
    const matchesProfessional = professionalId === 'all' || appointment.professionalId === professionalId;
    
    const service = mockServices.find((s) => s.id === appointment.serviceId);
    const matchesCategory = serviceCategory === 'all' || (service && service.category === serviceCategory);
    
    return isInDateRange && matchesProfessional && matchesCategory;
  });

  // Calculate revenue by professional
  const revenueByProfessional = mockProfessionals.map((professional) => {
    const professionalAppointments = filteredAppointments.filter(
      (appointment) => appointment.professionalId === professional.id
    );
    
    const revenue = professionalAppointments.reduce((total, appointment) => {
      const service = mockServices.find((s) => s.id === appointment.serviceId);
      return total + (service ? service.price : 0);
    }, 0);
    
    return {
      id: professional.id,
      name: professional.name,
      appointments: professionalAppointments.length,
      revenue,
    };
  }).filter((item) => item.appointments > 0);

  // Calculate revenue by service category
  const revenueByCategory = serviceCategories
    .filter((category) => category !== 'all')
    .map((category) => {
      const categoryServices = mockServices.filter((service) => service.category === category);
      const categoryAppointments = filteredAppointments.filter((appointment) => 
        categoryServices.some((service) => service.id === appointment.serviceId)
      );
      
      const revenue = categoryAppointments.reduce((total, appointment) => {
        const service = mockServices.find((s) => s.id === appointment.serviceId);
        return total + (service ? service.price : 0);
      }, 0);
      
      return {
        category,
        appointments: categoryAppointments.length,
        revenue,
      };
    }).filter((item) => item.appointments > 0);

  // Calculate total revenue
  const totalRevenue = filteredAppointments.reduce((total, appointment) => {
    const service = mockServices.find((s) => s.id === appointment.serviceId);
    return total + (service ? service.price : 0);
  }, 0);

  // Calculate total appointments
  const totalAppointments = filteredAppointments.length;

  // Calculate average revenue per appointment
  const averageRevenue = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

  // Calculate low stock products
  const lowStockProducts = mockProducts
    .filter((product) => product.stock < 5)
    .sort((a, b) => a.stock - b.stock);

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderRevenueReport = () => (
    <Box>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Faturamento Total
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {totalAppointments} agendamentos no período
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Ticket Médio
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatCurrency(averageRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Valor médio por atendimento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Profissional Destaque
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {revenueByProfessional.length > 0
                  ? revenueByProfessional.sort((a, b) => b.revenue - a.revenue)[0].name
                  : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {revenueByProfessional.length > 0
                  ? `${formatCurrency(revenueByProfessional.sort((a, b) => b.revenue - a.revenue)[0].revenue)} em faturamento`
                  : 'Nenhum dado disponível'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="medium" mb={2}>
        Faturamento por Profissional
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profissional</TableCell>
              <TableCell align="right">Atendimentos</TableCell>
              <TableCell align="right">Faturamento</TableCell>
              <TableCell align="right">Média por Atendimento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {revenueByProfessional.length > 0 ? (
              revenueByProfessional
                .sort((a, b) => b.revenue - a.revenue)
                .map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">{item.appointments}</TableCell>
                    <TableCell align="right">{formatCurrency(item.revenue)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.revenue / item.appointments)}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum dado disponível para o período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" fontWeight="medium" mb={2}>
        Faturamento por Categoria de Serviço
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Atendimentos</TableCell>
              <TableCell align="right">Faturamento</TableCell>
              <TableCell align="right">% do Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {revenueByCategory.length > 0 ? (
              revenueByCategory
                .sort((a, b) => b.revenue - a.revenue)
                .map((item) => (
                  <TableRow key={item.category} hover>
                    <TableCell component="th" scope="row">
                      {item.category}
                    </TableCell>
                    <TableCell align="right">{item.appointments}</TableCell>
                    <TableCell align="right">{formatCurrency(item.revenue)}</TableCell>
                    <TableCell align="right">
                      {totalRevenue > 0
                        ? `${((item.revenue / totalRevenue) * 100).toFixed(1)}%`
                        : '0%'}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum dado disponível para o período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderClientReport = () => {
    // Calculate clients with most appointments
    const clientAppointments = mockClients.map((client) => {
      const clientAppointments = filteredAppointments.filter(
        (appointment) => appointment.clientId === client.id
      );
      
      const spent = clientAppointments.reduce((total, appointment) => {
        const service = mockServices.find((s) => s.id === appointment.serviceId);
        return total + (service ? service.price : 0);
      }, 0);
      
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        appointments: clientAppointments.length,
        spent,
      };
    }).filter((item) => item.appointments > 0);

    // Calculate new clients in the period
    const newClients = mockClients.filter((client) => {
      // In a real app, we would check registration date
      // For mock data, let's assume clients with 0 or 1 visits are new
      return client.totalVisits <= 1;
    });

    return (
      <Box>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total de Clientes Atendidos
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {clientAppointments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No período selecionado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Novos Clientes
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {newClients.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Clientes recentes na base
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Ticket Médio por Cliente
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {clientAppointments.length > 0
                    ? formatCurrency(
                        clientAppointments.reduce((total, client) => total + client.spent, 0) /
                          clientAppointments.length
                      )
                    : formatCurrency(0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Valor médio gasto por cliente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight="medium" mb={2}>
          Clientes com Maior Valor
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell align="right">Atendimentos</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell align="right">Média por Atendimento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientAppointments.length > 0 ? (
                clientAppointments
                  .sort((a, b) => b.spent - a.spent)
                  .slice(0, 10)
                  .map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell component="th" scope="row">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        {client.email}
                        <br />
                        {client.phone}
                      </TableCell>
                      <TableCell align="right">{client.appointments}</TableCell>
                      <TableCell align="right">{formatCurrency(client.spent)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(client.spent / client.appointments)}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum dado disponível para o período selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" fontWeight="medium" mb={2}>
          Clientes com Maior Frequência
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell align="right">Atendimentos</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell align="right">Média por Atendimento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientAppointments.length > 0 ? (
                clientAppointments
                  .sort((a, b) => b.appointments - a.appointments)
                  .slice(0, 10)
                  .map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell component="th" scope="row">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        {client.email}
                        <br />
                        {client.phone}
                      </TableCell>
                      <TableCell align="right">{client.appointments}</TableCell>
                      <TableCell align="right">{formatCurrency(client.spent)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(client.spent / client.appointments)}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum dado disponível para o período selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderInventoryReport = () => (
    <Box>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total de Produtos
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {mockProducts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Produtos em estoque
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Produtos com Estoque Baixo
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={lowStockProducts.length > 0 ? 'error' : 'primary'}>
                {lowStockProducts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Produtos com menos de 5 unidades
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Valor Total em Estoque
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatCurrency(
                  mockProducts.reduce((total, product) => total + product.price * product.stock, 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Baseado no preço de venda
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="medium" mb={2}>
        Produtos com Estoque Baixo
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="right">Estoque</TableCell>
              <TableCell align="right">Valor em Estoque</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                  <TableCell align="right" sx={{ color: product.stock <= 0 ? 'error.main' : 'warning.main' }}>
                    {product.stock} un
                  </TableCell>
                  <TableCell align="right">{formatCurrency(product.price * product.stock)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Não há produtos com estoque baixo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" fontWeight="medium" mb={2}>
        Inventário por Categoria
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Quantidade de Produtos</TableCell>
              <TableCell align="right">Unidades em Estoque</TableCell>
              <TableCell align="right">Valor em Estoque</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(new Set(mockProducts.map((product) => product.category))).map((category) => {
              const categoryProducts = mockProducts.filter((product) => product.category === category);
              const totalUnits = categoryProducts.reduce((total, product) => total + product.stock, 0);
              const totalValue = categoryProducts.reduce(
                (total, product) => total + product.price * product.stock,
                0
              );

              return (
                <TableRow key={category} hover>
                  <TableCell component="th" scope="row">
                    {category}
                  </TableCell>
                  <TableCell align="right">{categoryProducts.length}</TableCell>
                  <TableCell align="right">{totalUnits} un</TableCell>
                  <TableCell align="right">{formatCurrency(totalValue)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Relatórios
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => alert('Funcionalidade de exportação será implementada em breve.')}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="medium" mb={3}>
          Filtros do Relatório
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Tipo de Relatório</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label="Tipo de Relatório"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="revenue">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChartIcon sx={{ mr: 1 }} />
                    Faturamento
                  </Box>
                </MenuItem>
                <MenuItem value="clients">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PieChartIcon sx={{ mr: 1 }} />
                    Clientes
                  </Box>
                </MenuItem>
                <MenuItem value="inventory">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1 }} />
                    Estoque
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {reportType !== 'inventory' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Data Inicial"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Data Final"
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </>
          )}
          
          {reportType === 'revenue' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="professional-label">Profissional</InputLabel>
                  <Select
                    labelId="professional-label"
                    id="professional"
                    value={professionalId}
                    label="Profissional"
                    onChange={handleProfessionalChange}
                  >
                    <MenuItem value="all">Todos os profissionais</MenuItem>
                    {mockProfessionals.map((professional) => (
                      <MenuItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Categoria de Serviço</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={serviceCategory}
                    label="Categoria de Serviço"
                    onChange={handleServiceCategoryChange}
                  >
                    <MenuItem value="all">Todas as categorias</MenuItem>
                    {serviceCategories
                      .filter((category) => category !== 'all')
                      .map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            {reportType === 'revenue'
              ? 'Relatório de Faturamento'
              : reportType === 'clients'
              ? 'Relatório de Clientes'
              : 'Relatório de Estoque'}
          </Typography>
          {reportType !== 'inventory' && startDate && endDate && (
            <Typography variant="body2" color="text.secondary">
              Período: {format(startDate, 'dd/MM/yyyy')} a {format(endDate, 'dd/MM/yyyy')}
            </Typography>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {reportType === 'revenue' && renderRevenueReport()}
        {reportType === 'clients' && renderClientReport()}
        {reportType === 'inventory' && renderInventoryReport()}
      </Paper>
    </Box>
  );
};

export default Reports;