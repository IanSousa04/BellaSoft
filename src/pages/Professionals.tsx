import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Avatar,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { mockProfessionals } from '../data/mockData';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const Professionals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>(mockProfessionals);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    status: 'active',
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterProfessionals(value, statusFilter);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as 'all' | 'active' | 'inactive';
    setStatusFilter(value);
    filterProfessionals(searchTerm, value);
  };

  const filterProfessionals = (search: string, status: 'all' | 'active' | 'inactive') => {
    let filtered = professionals;
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (professional) =>
          professional.name.toLowerCase().includes(search.toLowerCase()) ||
          professional.email.toLowerCase().includes(search.toLowerCase()) ||
          professional.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter((professional) => professional.status === status);
    }
    
    setFilteredProfessionals(filtered);
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (professional?: Professional) => {
    if (professional) {
      setCurrentProfessional(professional);
      setFormData({
        name: professional.name,
        email: professional.email,
        phone: professional.phone,
        specialization: professional.specialization,
        status: professional.status,
      });
    } else {
      setCurrentProfessional(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (professional: Professional) => {
    setCurrentProfessional(professional);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfessional = () => {
    if (currentProfessional) {
      // Update existing professional
      const updatedProfessionals = professionals.map((professional) =>
        professional.id === currentProfessional.id
          ? { ...professional, ...formData, status: formData.status as 'active' | 'inactive' }
          : professional
      );
      setProfessionals(updatedProfessionals);
      setFilteredProfessionals(updatedProfessionals);
      filterProfessionals(searchTerm, statusFilter);
    } else {
      // Add new professional
      const newProfessional: Professional = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        status: formData.status as 'active' | 'inactive',
      };
      const updatedProfessionals = [...professionals, newProfessional];
      setProfessionals(updatedProfessionals);
      filterProfessionals(searchTerm, statusFilter);
    }
    handleCloseDialog();
  };

  const handleDeleteProfessional = () => {
    if (currentProfessional) {
      const updatedProfessionals = professionals.filter(
        (professional) => professional.id !== currentProfessional.id
      );
      setProfessionals(updatedProfessionals);
      filterProfessionals(searchTerm, statusFilter);
    }
    handleCloseDeleteDialog();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Profissionais
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Profissional
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nome, email ou especialização..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, minWidth: { xs: '100%', sm: '240px' } }}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativos</MenuItem>
                <MenuItem value="inactive">Inativos</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton 
              color="primary" 
              onClick={toggleViewMode}
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
            >
              {viewMode === 'list' ? <ViewModuleIcon /> : <ViewListIcon />}
            </IconButton>
          </Box>
        </Box>

        {viewMode === 'list' ? (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Profissional</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Especialização</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProfessionals
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((professional) => (
                      <TableRow key={professional.id} hover>
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={professional.avatar}
                              sx={{ mr: 2, bgcolor: 'primary.main' }}
                            >
                              {getInitials(professional.name)}
                            </Avatar>
                            <Typography variant="body1">{professional.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{professional.email}</TableCell>
                        <TableCell>{professional.phone}</TableCell>
                        <TableCell>{professional.specialization}</TableCell>
                        <TableCell>
                          <Chip
                            label={professional.status === 'active' ? 'Ativo' : 'Inativo'}
                            color={professional.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver Agenda">
                            <IconButton color="primary">
                              <CalendarIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(professional)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteDialog(professional)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredProfessionals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          Nenhum profissional encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProfessionals.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredProfessionals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((professional) => (
                  <Grid item xs={12} sm={6} md={4} key={professional.id}>
                    <Card 
                      className="card-hover"
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          right: 10,
                          zIndex: 1,
                        }}
                      >
                        <Chip
                          label={professional.status === 'active' ? 'Ativo' : 'Inativo'}
                          color={professional.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          pt: 4,
                          pb: 2,
                        }}
                      >
                        <Avatar
                          src={professional.avatar}
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mb: 2,
                            bgcolor: 'primary.main',
                          }}
                        >
                          {getInitials(professional.name)}
                        </Avatar>
                        <Typography variant="h6" align="center">
                          {professional.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          align="center"
                          sx={{
                            bgcolor: 'primary.light',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            mt: 1,
                          }}
                        >
                          {professional.specialization}
                        </Typography>
                      </Box>
                      <CardContent sx={{ pt: 0, flexGrow: 1 }}>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Email:
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {professional.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Telefone:
                          </Typography>
                          <Typography variant="body2">
                            {professional.phone}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button 
                          size="small" 
                          startIcon={<CalendarIcon />}
                          variant="outlined"
                        >
                          Agenda
                        </Button>
                        <Box>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDialog(professional)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteDialog(professional)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              {filteredProfessionals.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Nenhum profissional encontrado.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24]}
                component="div"
                count={filteredProfessionals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            </Box>
          </>
        )}
      </Paper>

      {/* Add/Edit Professional Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentProfessional ? 'Editar Profissional' : 'Novo Profissional'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Especialização"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveProfessional}
            variant="contained"
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.phone ||
              !formData.specialization
            }
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o profissional{' '}
            <strong>{currentProfessional?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteProfessional} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Professionals;