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
  Chip,
  Tooltip,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import { mockCities, mockProfessionalCities, mockProfessionals } from '../data/mockData';

interface City {
  id: string;
  name: string;
  state: string;
  active: boolean;
}

const Cidades = () => {
  const [cities, setCities] = useState<City[]>(mockCities);
  const [filteredCities, setFilteredCities] = useState<City[]>(mockCities);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    active: true,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value) {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.state.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (city?: City) => {
    if (city) {
      setCurrentCity(city);
      setFormData({
        name: city.name,
        state: city.state,
        active: city.active,
      });
    } else {
      setCurrentCity(null);
      setFormData({
        name: '',
        state: '',
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (city: City) => {
    setCurrentCity(city);
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      active: e.target.checked,
    });
  };

  const handleSaveCity = () => {
    if (currentCity) {
      // Update existing city
      const updatedCities = cities.map((city) =>
        city.id === currentCity.id
          ? { ...city, ...formData }
          : city
      );
      setCities(updatedCities);
      setFilteredCities(updatedCities);
    } else {
      // Add new city
      const newCity: City = {
        id: Date.now().toString(),
        name: formData.name,
        state: formData.state,
        active: formData.active,
      };
      const updatedCities = [...cities, newCity];
      setCities(updatedCities);
      setFilteredCities(updatedCities);
    }
    handleCloseDialog();
  };

  const handleDeleteCity = () => {
    if (currentCity) {
      // Check if city is used in any professional-city relationship
      const isUsed = mockProfessionalCities.some(pc => pc.cityId === currentCity.id);
      
      if (isUsed) {
        // Instead of deleting, just set as inactive
        const updatedCities = cities.map((city) =>
          city.id === currentCity.id
            ? { ...city, active: false }
            : city
        );
        setCities(updatedCities);
        setFilteredCities(updatedCities);
      } else {
        // If not used, can be deleted
        const updatedCities = cities.filter((city) => city.id !== currentCity.id);
        setCities(updatedCities);
        setFilteredCities(updatedCities);
      }
    }
    handleCloseDeleteDialog();
  };

  // Get professionals for a city
  const getProfessionalsForCity = (cityId: string) => {
    const professionalIds = mockProfessionalCities
      .filter(pc => pc.cityId === cityId)
      .map(pc => pc.professionalId);
    
    return mockProfessionals
      .filter(p => professionalIds.includes(p.id))
      .map(p => p.name);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Cidades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Cidade
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome ou estado..."
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
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Cidade</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Profissionais</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCities
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((city) => {
                  const professionals = getProfessionalsForCity(city.id);
                  
                  return (
                    <TableRow key={city.id} hover>
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{city.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{city.state}</TableCell>
                      <TableCell>
                        <Chip
                          label={city.active ? 'Ativa' : 'Inativa'}
                          color={city.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {professionals.length > 0 ? (
                          <Box>
                            <Typography variant="body2">
                              {professionals.slice(0, 2).join(', ')}
                              {professionals.length > 2 && ` e mais ${professionals.length - 2}`}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Nenhum profissional
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(city)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(city)}
                            disabled={professionals.length > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filteredCities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Nenhuma cidade encontrada.
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
          count={filteredCities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>

      {/* Add/Edit City Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCity ? 'Editar Cidade' : 'Nova Cidade'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nome da Cidade"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Estado (UF)"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleSwitchChange}
                    name="active"
                    color="success"
                  />
                }
                label="Cidade ativa"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveCity}
            variant="contained"
            disabled={!formData.name || !formData.state}
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
            Tem certeza que deseja excluir a cidade{' '}
            <strong>{currentCity?.name} - {currentCity?.state}</strong>?
          </Typography>
          
          {currentCity && getProfessionalsForCity(currentCity.id).length > 0 ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Esta cidade está associada a profissionais e não pode ser excluída. 
              Ela será marcada como inativa.
            </Alert>
          ) : (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              Esta ação não pode ser desfeita.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteCity} color="error">
            {currentCity && getProfessionalsForCity(currentCity.id).length > 0 
              ? 'Desativar' 
              : 'Excluir'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cidades;