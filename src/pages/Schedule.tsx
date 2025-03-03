import React, { useState, useEffect } from 'react';
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
  Alert,
  Chip,
  Divider,
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
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays, isSameDay, parseISO, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  mockAppointments, 
  mockClients, 
  mockProfessionals, 
  mockServices, 
  mockCities,
  mockProfessionalCities
} from '../data/mockData';

export interface Appointment {
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
  cityId: string;
  cityName: string;
}

interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
  id: string;
}

const Schedule = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredProfessionals, setFilteredProfessionals] = useState(mockProfessionals.filter(p => p.status === 'active'));
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [professionalFilter, setProfessionalFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [availableCities, setAvailableCities] = useState<typeof mockCities>([]);
  const [dragError, setDragError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    professionalId: '',
    serviceId: '',
    date: new Date(),
    time: '',
    status: 'confirmed',
    notes: '',
    cityId: '',
  });

  // Generate time slots from 8:00 to 20:00 with 30-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push({ time: `${hour}:00`, hour, minute: 0, id: `time-${hour}-0` });
      slots.push({ time: `${hour}:30`, hour, minute: 30, id: `time-${hour}-30` });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    // Update available cities based on professional filter
    if (professionalFilter === 'all') {
      setAvailableCities(mockCities.filter(city => city.active));
    } else {
      const professionalCityIds = mockProfessionalCities
        .filter(pc => pc.professionalId === professionalFilter)
        .map(pc => pc.cityId);
      
      setAvailableCities(
        mockCities.filter(city => city.active && professionalCityIds.includes(city.id))
      );
    }

    // Reset city filter if the selected city is no longer available
    if (cityFilter !== 'all' && !availableCities.some(city => city.id === cityFilter)) {
      setCityFilter('all');
    }
  }, [professionalFilter]);

  // Filter appointments for the selected date
  const getAppointmentsForDate = (date: Date, professionalId?: string, cityId?: string) => {
    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const sameDay = isSameDay(appointmentDate, date);
      const matchesProfessional = professionalId && professionalId !== 'all' 
        ? appointment.professionalId === professionalId 
        : true;
      const matchesCity = cityId && cityId !== 'all'
        ? appointment.cityId === cityId
        : true;
      
      return sameDay && matchesProfessional && matchesCity;
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
        cityId: appointment.cityId,
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
        cityId: '',
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
    
    if (name === 'professionalId') {
      // When professional changes, update available cities
      const professionalCityIds = mockProfessionalCities
        .filter(pc => pc.professionalId === value)
        .map(pc => pc.cityId);
      
      const availableCitiesForProfessional = mockCities
        .filter(city => city.active && professionalCityIds.includes(city.id));
      
      // Set the first available city as default
      if (availableCitiesForProfessional.length > 0) {
        setFormData({
          ...formData,
          [name]: value,
          cityId: availableCitiesForProfessional[0].id,
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
          cityId: '',
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSaveAppointment = () => {
    // Combine date and time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const appointmentDate = new Date(formData.date);
    const combinedDate = setMinutes(setHours(appointmentDate, hours), minutes);
    
    // Get city name
    const cityName = mockCities.find(city => city.id === formData.cityId)?.name || '';
    
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
              cityId: formData.cityId,
              cityName: cityName,
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
        cityId: formData.cityId,
        cityName: cityName,
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

  const handleCityFilterChange = (event: SelectChangeEvent<string>) => {
    setCityFilter(event.target.value);
  };

  // Get appointment for a specific time slot and professional
  const getAppointmentForTimeSlot = (timeSlot: TimeSlot, professionalId: string) => {
    const appointmentsForDate = getAppointmentsForDate(selectedDate, professionalId, cityFilter !== 'all' ? cityFilter : undefined);
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
    const appointmentsForDate = getAppointmentsForDate(
      selectedDate, 
      professionalId, 
      cityFilter !== 'all' ? cityFilter : undefined
    );
    
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

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    setDragError(null);
    
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item is dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Get the appointment being dragged
    const appointment = appointments.find(app => app.id === draggableId);
    if (!appointment) return;
    
    // Parse the destination droppable ID to get professional and time slot
    const [destProfId, destTimeSlotId] = destination.droppableId.split('|');
    const destTimeSlot = timeSlots.find(slot => slot.id === destTimeSlotId);
    
    if (!destTimeSlot) return;
    
    // Check if the professional serves in the city of the appointment
    const professionalCities = mockProfessionalCities
      .filter(pc => pc.professionalId === destProfId)
      .map(pc => pc.cityId);
    
    if (!professionalCities.includes(appointment.cityId)) {
      setDragError(`O profissional não atende na cidade ${appointment.cityName}`);
      return;
    }
    
    // Check if the destination time slot is already occupied
    const isOccupied = getAppointmentForTimeSlot(destTimeSlot, destProfId);
    if (isOccupied) {
      setDragError('Este horário já está ocupado');
      return;
    }
    
    // Update the appointment with the new time and professional
    const appointmentDate = parseISO(appointment.date);
    const newDate = new Date(appointmentDate);
    newDate.setHours(destTimeSlot.hour);
    newDate.setMinutes(destTimeSlot.minute);
    
    const updatedAppointments = appointments.map(app => {
      if (app.id === draggableId) {
        return {
          ...app,
          date: newDate.toISOString(),
          professionalId: destProfId,
          professionalName: mockProfessionals.find(p => p.id === destProfId)?.name || app.professionalName
        };
      }
      return app;
    });
    
    setAppointments(updatedAppointments);
  };

  // Get cities where a professional works
  const getCitiesForProfessional = (professionalId: string) => {
    const cityIds = mockProfessionalCities
      .filter(pc => pc.professionalId === professionalId)
      .map(pc => pc.cityId);
    
    return mockCities
      .filter(city => cityIds.includes(city.id) && city.active)
      .map(city => ({ id: city.id, name: city.name, state: city.state }));
  };

  // Check if a professional can work in a specific city
  const canProfessionalWorkInCity = (professionalId: string, cityId: string) => {
    return mockProfessionalCities.some(
      pc => pc.professionalId === professionalId && pc.cityId === cityId
    );
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

      {dragError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDragError(null)}>
          {dragError}
        </Alert>
      )}

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
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="city-filter-label">Cidade</InputLabel>
              <Select
                labelId="city-filter-label"
                id="city-filter"
                value={cityFilter}
                label="Cidade"
                onChange={handleCityFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationCityIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">Todas as cidades</MenuItem>
                {availableCities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name} - {city.state}
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
                  key={slot.id}
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

            <DragDropContext onDragEnd={handleDragEnd}>
              {/* Professional columns */}
              {filteredProfessionals.map((professional) => {
                const professionalCitiesList = getCitiesForProfessional(professional.id);
                
                return (
                  <Box key={professional.id} sx={{ flex: 1, minWidth: 250 }}>
                    <Box
                      sx={{
                        height: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        px: 1,
                        position: 'relative',
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
                      
                      {/* Show cities where professional works */}
                      {cityFilter === 'all' && professionalCitiesList.length > 0 && (
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          justifyContent: 'center',
                          gap: 0.5,
                          mt: 0.5
                        }}>
                          {professionalCitiesList.slice(0, 2).map((city) => (
                            <Chip
                              key={city.id}
                              label={`${city.name}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                          {professionalCitiesList.length > 2 && (
                            <Chip
                              label={`+${professionalCitiesList.length - 2}`}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      )}
                      
                      {/* Show selected city */}
                      {cityFilter !== 'all' && (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={mockCities.find(c => c.id === cityFilter)?.name || ''}
                            size="small"
                            color={canProfessionalWorkInCity(professional.id, cityFilter) ? 'primary' : 'default'}
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      )}
                    </Box>
                    
                    {timeSlots.map((slot) => {
                      const appointment = getAppointmentForTimeSlot(slot, professional.id);
                      const isOccupied = isTimeSlotOccupied(slot, professional.id);
                      
                      // Check if professional can work in the filtered city
                      const canWorkInFilteredCity = cityFilter === 'all' || 
                        canProfessionalWorkInCity(professional.id, cityFilter);
                      
                      return (
                        <Droppable 
                          droppableId={`${professional.id}|${slot.id}`} 
                          key={`${professional.id}-${slot.id}`}
                          isDropDisabled={isOccupied || !canWorkInFilteredCity}
                        >
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              sx={{
                                height: 80,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                borderLeft: `1px solid ${theme.palette.divider}`,
                                position: 'relative',
                                backgroundColor: !canWorkInFilteredCity
                                  ? 'rgba(0, 0, 0, 0.04)'
                                  : snapshot.isDraggingOver 
                                    ? 'rgba(156, 39, 176, 0.08)' 
                                    : isOccupied 
                                      ? 'rgba(0, 0, 0, 0.04)' 
                                      : 'transparent',
                                opacity: !canWorkInFilteredCity ? 0.5 : 1,
                              }}
                            >
                              {appointment ? (
                                <Draggable 
                                  draggableId={appointment.id} 
                                  index={0}
                                  key={appointment.id}
                                >
                                  {(provided, snapshot) => (
                                    <Paper
                                      elevation={snapshot.isDragging ? 3 : 0}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
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
                                        backgroundColor: snapshot.isDragging 
                                          ? `${getStatusColor(appointment.status)}25` 
                                          : `${getStatusColor(appointment.status)}15`,
                                        '&:hover': {
                                          boxShadow: theme.shadows[2],
                                        },
                                        cursor: 'grab',
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
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDialog(appointment);
                                              }}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Excluir">
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDeleteDialog(appointment);
                                              }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </Box>
                                      </Box>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {appointment.serviceName}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <AccessTimeIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                          <Typography variant="caption" color="text.secondary">
                                            {format(parseISO(appointment.date), 'HH:mm')}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <LocationCityIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                          <Typography variant="caption" color="text.secondary">
                                            {appointment.cityName}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Paper>
                                  )}
                                </Draggable>
                              ) : (
                                !isOccupied && canWorkInFilteredCity && (
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
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      );
                    })}
                  </Box>
                );
              })}
            </DragDropContext>
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

            {formData.professionalId && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cidades de atendimento do profissional:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {getCitiesForProfessional(formData.professionalId).map((city) => (
                    <Chip
                      key={city.id}
                      label={`${city.name} - ${city.state}`}
                      size="small"
                      color={formData.cityId === city.id ? 'primary' : 'default'}
                      onClick={() => setFormData({ ...formData, cityId: city.id })}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Box>
                {getCitiesForProfessional(formData.professionalId).length === 0 && (
                  <Typography variant="body2" color="error">
                    Este profissional não possui cidades de atendimento cadastradas.
                  </Typography>
                )}
              </Box>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel id="city-label">Cidade do Atendimento</InputLabel>
              <Select
                labelId="city-label"
                id="cityId"
                name="cityId"
                value={formData.cityId}
                label="Cidade do Atendimento"
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationCityIcon fontSize="small" />
                  </InputAdornment>
                }
                disabled={!formData.professionalId}
              >
                {formData.professionalId && mockProfessionalCities
                  .filter(pc => pc.professionalId === formData.professionalId)
                  .map(pc => {
                    const city = mockCities.find(c => c.id === pc.cityId && c.active);
                    return city ? (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name} - {city.state}
                      </MenuItem>
                    ) : null;
                  })}
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
                      <MenuItem key={slot.id} value={slot.time}>
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
              !formData.time ||
              !formData.cityId
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