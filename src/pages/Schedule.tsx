import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  useTheme,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays, isSameDay, parseISO, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockAppointments, mockClients, mockProfessionals, mockServices } from '../data/mockData';

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
}

interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

const Schedule = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
        id: '1',
        clientId: '1',
        clientName: 'Ana Silva',
        professionalId: '1',
        professionalName: 'Dra. Sofia Cardoso',
        serviceId: '1',
        serviceName: 'Limpeza de Pele Profunda',
        date: '2025-05-15T10:00:00',
        status: 'confirmed',
        notes: 'Cliente com pele sensível',
      }
  ]);
  const [filteredProfessionals, setFilteredProfessionals] = useState(mockProfessionals.filter(p => p.status === 'active'));
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [professionalFilter, setProfessionalFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    professionalId: '',
    serviceId: '',
    date: new Date(),
    time: '',
    status: 'confirmed',
    notes: '',
  });

  // Generate time slots from 8:00 to 20:00 with 30-minute intervals
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour < 20; hour++) {
    timeSlots.push({ time: `${hour}:00`, hour, minute: 0 });
    timeSlots.push({ time: `${hour}:30`, hour, minute: 30 });
  }

  // Filter appointments for the selected date
  const getAppointmentsForDate = (date: Date, professionalId?: string) => {
    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const sameDay = isSameDay(appointmentDate, date);
      const matchesProfessional = professionalId ? appointment.professionalId === professionalId : true;
      return sameDay && matchesProfessional;
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleOpenDialog = (appointment?: Appointment, initialTime?: string, professionalId?: string) => {
    if (appointment) {
      // Edit existing appointment
      const appointmentDate = parseISO(appointment.date);
      const hours = appointmentDate.getHours();
      const minutes = appointmentDate.getMinutes();
      const timeString = `${hours}:${minutes === 0 ? '00' : minutes}`;

      setCurrentAppointment(appointment);
      setFormData({
        clientId: appointment.clientId,
        professionalId: appointment.professionalId,
        serviceId: appointment.serviceId,
        date: appointmentDate,
        time: timeString,
        status: appointment.status,
        notes: appointment.notes,
      });
    } else {
      // Create new appointment
      setCurrentAppointment(null);
      setFormData({
        clientId: '',
        professionalId: professionalId || '',
        serviceId: '',
        date: selectedDate,
        time: initialTime || '10:00',
        status: 'confirmed',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
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

  const handleSaveAppointment = () => {
    // Combine date and time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const appointmentDate = new Date(formData.date);
    const combinedDate = setMinutes(setHours(appointmentDate, hours), minutes);
    
    if (currentAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === currentAppointment.id
          ? {
              ...appointment,
              clientId: formData.clientId,
              clientName: mockClients.find((c) => c.id === formData.clientId)?.name || '',
              professionalId: formData.professionalId,
              professionalName: mockProfessionals.find((p) => p.id === formData.professionalId)?.name || '',
              serviceId: formData.serviceId,
              serviceName: mockServices.find((s) => s.id === formData.serviceId)?.name || '',
              date: combinedDate.toISOString(),
              status: formData.status as 'confirmed' | 'pending' | 'cancelled',
              notes: formData.notes,
            }
          : appointment
      );
      setAppointments(updatedAppointments);
    } else {
      // Add new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        clientId: formData.clientId,
        clientName: mockClients.find((c) => c.id === formData.clientId)?.name || '',
        professionalId: formData.professionalId,
        professionalName: mockProfessionals.find((p) => p.id === formData.professionalId)?.name || '',
        serviceId: formData.serviceId,
        serviceName: mockServices.find((s) => s.id === formData.serviceId)?.name || '',
        date: combinedDate.toISOString(),
        status: formData.status as 'confirmed' | 'pending' | 'cancelled',
        notes: formData.notes,
      };
      setAppointments([...appointments, newAppointment]);
    }
    handleCloseDialog();
  };

  const handleDeleteAppointment = () => {
    if (currentAppointment) {
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.id !== currentAppointment.id
      );
      setAppointments(updatedAppointments);
    }
    handleCloseDeleteDialog();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleProfessionalFilterChange = (event: SelectChangeEvent<string>) => {
    setProfessionalFilter(event.target.value);
    
    if (event.target.value === 'all') {
      setFilteredProfessionals(mockProfessionals.filter(p => p.status === 'active'));
    } else {
      setFilteredProfessionals(
        mockProfessionals.filter(p => p.id === event.target.value && p.status === 'active')
      );
    }
  };

  // Get appointment for a specific time slot and professional
  const getAppointmentForTimeSlot = (timeSlot: TimeSlot, professionalId: string) => {
    const appointmentsForDate = getAppointmentsForDate(selectedDate, professionalId);
    return appointmentsForDate.find((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      return (
        appointmentDate.getHours() === timeSlot.hour &&
        appointmentDate.getMinutes() === timeSlot.minute
      );
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get service duration
  const getServiceDuration = (serviceId: string) => {
    const service = mockServices.find((s) => s.id === serviceId);
    return service ? service.duration : 60; // Default to 60 minutes
  };

  // Check if a time slot is occupied by a longer appointment
  const isTimeSlotOccupied = (timeSlot: TimeSlot, professionalId: string) => {
    const appointmentsForDate = getAppointmentsForDate(selectedDate, professionalId);
    
    return appointmentsForDate.some((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const appointmentHour = appointmentDate.getHours();
      const appointmentMinute = appointmentDate.getMinutes();
      const serviceDuration = getServiceDuration(appointment.serviceId);
      
      // Calculate end time of the appointment
      const appointmentEndMinutes = appointmentHour * 60 + appointmentMinute + serviceDuration;
      const timeSlotMinutes = timeSlot.hour * 60 + timeSlot.minute;
      
      // Check if the time slot falls within the appointment duration
      return (
        timeSlotMinutes >= appointmentHour * 60 + appointmentMinute &&
        timeSlotMinutes < appointmentEndMinutes &&
        // Exclude the exact start time (as we want to show the appointment there)
        !(timeSlotMinutes === appointmentHour * 60 + appointmentMinute)
      );
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Agenda
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Agendamento
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handlePreviousDay}>
              <ChevronLeftIcon />
            </IconButton>
            <DatePicker
              label="Data"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{ textField: { size: 'small' } }}
            />
            <IconButton onClick={handleNextDay}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flex: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              placeholder="Buscar cliente..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="professional-filter-label">Profissional</InputLabel>
              <Select
                labelId="professional-filter-label"
                id="professional-filter"
                value={professionalFilter}
                label="Profissional"
                onChange={handleProfessionalFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">Todos os profissionais</MenuItem>
                {mockProfessionals
                  .filter(p => p.status === 'active')
                  .map((professional) => (
                    <MenuItem key={professional.id} value={professional.id}>
                      {professional.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight="medium" mb={2}>
          {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', minWidth: filteredProfessionals.length * 250 }}>
            {/* Time column */}
            <Box sx={{ width: 80, flexShrink: 0 }}>
              <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.divider}` }}>
                Horário
              </Box>
              {timeSlots.map((slot) => (
                <Box
                  key={slot.time}
                  sx={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {slot.time}
                </Box>
              ))}
            </Box>

            {/* Professional columns */}
            {filteredProfessionals.map((professional) => (
              <Box key={professional.id} sx={{ flex: 1, minWidth: 250 }}>
                <Box
                  sx={{
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    px: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={professional.avatar}
                      sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}
                    >
                      {professional.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="medium" noWrap>
                      {professional.name}
                    </Typography>
                  </Box>
                </Box>
                {timeSlots.map((slot) => {
                  const appointment = getAppointmentForTimeSlot(slot, professional.id);
                  const isOccupied = isTimeSlotOccupied(slot, professional.id);
                  
                  return (
                    <Box
                      key={`${professional.id}-${slot.time}`}
                      sx={{
                        height: 80,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        borderLeft: `1px solid ${theme.palette.divider}`,
                        position: 'relative',
                        backgroundColor: isOccupied ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                      }}
                    >
                      {appointment ? (
                        <Paper
                          elevation={0}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            right: 4,
                            bottom: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1,
                            borderLeft: `4px solid ${getStatusColor(appointment.status)}`,
                            backgroundColor: `${getStatusColor(appointment.status)}15`,
                            '&:hover': {
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="body2" fontWeight="medium" noWrap>
                              {appointment.clientName}
                            </Typography>
                            <Box>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(appointment)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(appointment)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {appointment.serviceName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                            <AccessTimeIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" color="text.secondary">
                              {format(parseISO(appointment.date), 'HH:mm')}
                            </Typography>
                          </Box>
                        </Paper>
                      ) : (
                        !isOccupied && (
                          <Tooltip title="Adicionar agendamento">
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.3,
                                '&:hover': {
                                  opacity: 1,
                                },
                              }}
                              onClick={() => handleOpenDialog(undefined, slot.time, professional.id)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        )
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="client-label">Cliente</InputLabel>
              <Select
                labelId="client-label"
                id="clientId"
                name="clientId"
                value={formData.clientId}
                label="Cliente"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                {mockClients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="professional-label">Profissional</InputLabel>
              <Select
                labelId="professional-label"
                id="professionalId"
                name="professionalId"
                value={formData.professionalId}
                label="Profissional"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                {mockProfessionals
                  .filter((p) => p.status === 'active')
                  .map((professional) => (
                    <MenuItem key={professional.id} value={professional.id}>
                      {professional.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="service-label">Serviço</InputLabel>
              <Select
                labelId="service-label"
                id="serviceId"
                name="serviceId"
                value={formData.serviceId}
                label="Serviço"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SpaIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                {mockServices.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} ({service.duration} min)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data"
                  value={formData.date}
                  onChange={(newDate) => {
                    if (newDate) {
                      setFormData({ ...formData, date: newDate });
                    }
                  }}
                  slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="time-label">Horário</InputLabel>
                  <Select
                    labelId="time-label"
                    id="time"
                    name="time"
                    value={formData.time}
                    label="Horário"
                    onChange={handleSelectChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot.time} value={slot.time}>
                        {slot.time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <EventIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="confirmed">Confirmado</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              label="Observações"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveAppointment}
            variant="contained"
            disabled={
              !formData.clientId ||
              !formData.professionalId ||
              !formData.serviceId ||
              !formData.time
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
            Tem certeza que deseja excluir o agendamento de{' '}
            <strong>{currentAppointment?.clientName}</strong> com{' '}
            <strong>{currentAppointment?.professionalName}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteAppointment} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedule;