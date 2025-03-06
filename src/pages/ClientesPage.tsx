import React, { useEffect, useState } from 'react';
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
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
// import { mockClients } from '../data/mockData';
import { Cliente } from '../entities/Cliente';
import ClienteService from '../services/ClienteService';

const ClientesPage = () => {
  const theme = useTheme();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClients, setFilteredClients] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentClient, setCurrentClient] = useState<Cliente | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const clienteService = new ClienteService()


  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = clientes?.filter(
        (client) =>
          client.nome.toLowerCase().includes(value.toLowerCase()) ||
          client.email.toLowerCase().includes(value.toLowerCase()) ||
          client.telefone.includes(value)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clientes);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (client?: Cliente) => {
    if (client) {
      setCurrentClient(client);
      setFormData({
        name: client.nome,
        email: client.email,
        phone: client.telefone,
      });
    } else {
      setCurrentClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (client: Cliente) => {
    setCurrentClient(client);
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

  const handleSaveClient = () => {
    if (currentClient) {
      // Update existing client
      const updatedClients = clientes.map((client) =>
        client.id === currentClient.id
          ? { ...client, ...formData }
          : client
      );
      setClientes(updatedClients);
      setFilteredClients(updatedClients);
    } else {
      // Add new client
      const newClient: Cliente = {
        id: Date.now().toString(),
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        ultimaVisita: 'Nunca',
        totalVisita: 0,
      };
      const updatedClients = [...clientes, newClient];
      setClientes(updatedClients);
      setFilteredClients(updatedClients);
    }
    handleCloseDialog();
  };

  const handleDeleteClient = () => {
    if (currentClient) {
      const updatedClients = clientes.filter((client) => client.id !== currentClient.id);
      setClientes(updatedClients);
      setFilteredClients(updatedClients);
    }
    handleCloseDeleteDialog();
  };

const fetchClients = async () => {
  try {
    const resposta = await clienteService.getMany()
    console.log("resposta",resposta)

if (resposta && resposta.length > 0){
  setClientes(resposta)
}

  } catch (error) {
    console.error("Erro ao buscar clientes",error)
  }


}

useEffect(() => {
  fetchClients()
},[])

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Cliente
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Cliente
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome, email ou telefone..."
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
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Última Visita</TableCell>
                <TableCell>Total de Visitas</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell component="th" scope="row">
                      {client.nome}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.telefone}</TableCell>
                    <TableCell>
                      {client.ultimaVisita === 'Nunca' ? (
                        <Chip
                          label="Nunca"
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.grey[200],
                            color: theme.palette.text.secondary,
                          }}
                        />
                      ) : (
                        client.ultimaVisita
                      )}
                    </TableCell>
                    <TableCell>{client.totalVisita}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Histórico">
                        <IconButton color="primary">
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(client)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(client)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Nenhum cliente encontrado.
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
          count={filteredClients.length}
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

      {/* Add/Edit Cliente Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentClient ? 'Editar Cliente' : 'Novo Cliente'}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveClient}
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.phone}
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
            Tem certeza que deseja excluir o cliente{' '}
            <strong>{currentClient?.nome}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteClient} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesPage;