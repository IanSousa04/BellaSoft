// Mock data for the application

import { Professional } from "../pages/Professionals";
import { Appointment } from "../pages/Schedule";

// Cities
export const mockCities = [
  {
    id: '1',
    name: 'São Paulo',
    state: 'SP',
    active: true,
  },
  {
    id: '2',
    name: 'Rio de Janeiro',
    state: 'RJ',
    active: true,
  },
  {
    id: '3',
    name: 'Belo Horizonte',
    state: 'MG',
    active: true,
  },
  {
    id: '4',
    name: 'Curitiba',
    state: 'PR',
    active: true,
  },
  {
    id: '5',
    name: 'Porto Alegre',
    state: 'RS',
    active: true,
  },
  {
    id: '6',
    name: 'Brasília',
    state: 'DF',
    active: false,
  },
  {
    id: '7',
    name: 'Salvador',
    state: 'BA',
    active: false,
  },
  {
    id: '8',
    name: 'Recife',
    state: 'PE',
    active: false,
  },
];

// Professional Cities (which cities each professional serves)
export const mockProfessionalCities = [
  { professionalId: '1', cityId: '1' }, // Dra. Sofia Cardoso - São Paulo
  { professionalId: '1', cityId: '2' }, // Dra. Sofia Cardoso - Rio de Janeiro
  { professionalId: '2', cityId: '1' }, // Dr. Miguel Ribeiro - São Paulo
  { professionalId: '2', cityId: '3' }, // Dr. Miguel Ribeiro - Belo Horizonte
  { professionalId: '3', cityId: '1' }, // Dra. Isabela Alves - São Paulo
  { professionalId: '3', cityId: '4' }, // Dra. Isabela Alves - Curitiba
  { professionalId: '5', cityId: '1' }, // Dra. Luiza Ferreira - São Paulo
  { professionalId: '5', cityId: '5' }, // Dra. Luiza Ferreira - Porto Alegre
  { professionalId: '6', cityId: '2' }, // Dr. Rafael Costa - Rio de Janeiro
  { professionalId: '6', cityId: '3' }, // Dr. Rafael Costa - Belo Horizonte
  { professionalId: '7', cityId: '1' }, // Dra. Carolina Lima - São Paulo
  { professionalId: '7', cityId: '5' }, // Dra. Carolina Lima - Porto Alegre
];

// Clients
export const mockClients = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    lastVisit: '15/05/2025',
    totalVisits: 8,
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 91234-5678',
    lastVisit: '02/05/2025',
    totalVisits: 3,
  },
  {
    id: '3',
    name: 'Mariana Santos',
    email: 'mariana.santos@email.com',
    phone: '(11) 99876-5432',
    lastVisit: '28/04/2025',
    totalVisits: 12,
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    phone: '(11) 98888-7777',
    lastVisit: 'Nunca',
    totalVisits: 0,
  },
  {
    id: '5',
    name: 'Juliana Mendes',
    email: 'juliana.mendes@email.com',
    phone: '(11) 97777-6666',
    lastVisit: '10/05/2025',
    totalVisits: 5,
  },
  {
    id: '6',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    phone: '(11) 96666-5555',
    lastVisit: '05/05/2025',
    totalVisits: 2,
  },
  {
    id: '7',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    phone: '(11) 95555-4444',
    lastVisit: '20/04/2025',
    totalVisits: 7,
  },
  {
    id: '8',
    name: 'Gabriel Souza',
    email: 'gabriel.souza@email.com',
    phone: '(11) 94444-3333',
    lastVisit: 'Nunca',
    totalVisits: 0,
  },
  {
    id: '9',
    name: 'Camila Rodrigues',
    email: 'camila.rodrigues@email.com',
    phone: '(11) 93333-2222',
    lastVisit: '12/05/2025',
    totalVisits: 4,
  },
  {
    id: '10',
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@email.com',
    phone: '(11) 92222-1111',
    lastVisit: '08/05/2025',
    totalVisits: 6,
  },
  {
    id: '11',
    name: 'Beatriz Gomes',
    email: 'beatriz.gomes@email.com',
    phone: '(11) 91111-0000',
    lastVisit: '01/05/2025',
    totalVisits: 9,
  },
  {
    id: '12',
    name: 'Rafaela Martins',
    email: 'rafaela.martins@email.com',
    phone: '(11) 90000-9999',
    lastVisit: 'Nunca',
    totalVisits: 0,
  },
];

// Professionals
export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dra. Sofia Cardoso',
    email: 'sofia.cardoso@bellasoft.com',
    phone: '(11) 98765-1234',
    specialization: 'Esteticista Facial',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '2',
    name: 'Dr. Miguel Ribeiro',
    email: 'miguel.ribeiro@bellasoft.com',
    phone: '(11) 97654-3210',
    specialization: 'Dermatologista',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '3',
    name: 'Dra. Isabela Alves',
    email: 'isabela.alves@bellasoft.com',
    phone: '(11) 96543-2109',
    specialization: 'Massoterapia',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '4',
    name: 'Dr. André Santos',
    email: 'andre.santos@bellasoft.com',
    phone: '(11) 95432-1098',
    specialization: 'Fisioterapeuta',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '5',
    name: 'Dra. Luiza Ferreira',
    email: 'luiza.ferreira@bellasoft.com',
    phone: '(11) 94321-0987',
    specialization: 'Nutricionista',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '6',
    name: 'Dr. Rafael Costa',
    email: 'rafael.costa@bellasoft.com',
    phone: '(11) 93210-9876',
    specialization: 'Acupunturista',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '7',
    name: 'Dra. Carolina Lima',
    email: 'carolina.lima@bellasoft.com',
    phone: '(11) 92109-8765',
    specialization: 'Esteticista Corporal',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '8',
    name: 'Dr. Gustavo Mendes',
    email: 'gustavo.mendes@bellasoft.com',
    phone: '(11) 91098-7654',
    specialization: 'Podólogo',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  },
];

// Services
export const mockServices = [
  {
    id: '1',
    name: 'Limpeza de Pele Profunda',
    description: 'Limpeza facial completa com extração e máscara hidratante.',
    duration: 60, // minutes
    price: 150.0,
    category: 'Facial',
  },
  {
    id: '2',
    name: 'Massagem Relaxante',
    description: 'Massagem corporal com óleos essenciais para relaxamento.',
    duration: 50, // minutes
    price: 120.0,
    category: 'Corporal',
  },
  {
    id: '3',
    name: 'Drenagem Linfática',
    description: 'Técnica de massagem para eliminar toxinas e reduzir inchaço.',
    duration: 60, // minutes
    price: 140.0,
    category: 'Corporal',
  },
  {
    id: '4',
    name: 'Peeling de Diamante',
    description: 'Esfoliação profunda para renovação celular e luminosidade.',
    duration: 45, // minutes
    price: 180.0,
    category: 'Facial',
  },
  {
    id: '5',
    name: 'Depilação a Laser',
    description: 'Remoção de pelos com tecnologia a laser.',
    duration: 30, // minutes
    price: 200.0,
    category: 'Corporal',
  },
  {
    id: '6',
    name: 'Hidratação Facial',
    description: 'Tratamento intensivo para peles desidratadas.',
    duration: 40, // minutes
    price: 110.0,
    category: 'Facial',
  },
  {
    id: '7',
    name: 'Manicure e Pedicure',
    description: 'Tratamento completo para unhas das mãos e pés.',
    duration: 60, // minutes
    price: 80.0,
    category: 'Estética',
  },
  {
    id: '8',
    name: 'Microagulhamento',
    description: 'Tratamento para estimular colágeno e melhorar textura da pele.',
    duration: 50, // minutes
    price: 250.0,
    category: 'Facial',
  },
];

// Products
export const mockProducts = [
  {
    id: '1',
    name: 'Sérum Facial Hidratante',
    description: 'Sérum com ácido hialurônico para hidratação profunda.',
    price: 89.9,
    stock: 15,
    category: 'Facial',
    brand: 'BellaSkin',
  },
  {
    id: '2',
    name: 'Creme Antissinais',
    description: 'Creme facial com retinol para combate aos sinais de envelhecimento.',
    price: 120.5,
    stock: 8,
    category: 'Facial',
    brand: 'Derma Age',
  },
  {
    id: '3',
    name: 'Óleo Corporal Relaxante',
    description: 'Óleo de massagem com lavanda e camomila.',
    price: 65.0,
    stock: 20,
    category: 'Corporal',
    brand: 'NaturRelax',
  },
  {
    id: '4',
    name: 'Protetor Solar FPS 50',
    description: 'Proteção solar de amplo espectro com vitamina E.',
    price: 75.9,
    stock: 12,
    category: 'Proteção Solar',
    brand: 'SunCare',
  },
  {
    id: '5',
    name: 'Máscara Facial de Argila',
    description: 'Máscara purificante para peles oleosas.',
    price: 45.0,
    stock: 18,
    category: 'Facial',
    brand: 'BellaSkin',
  },
  {
    id: '6',
    name: 'Gel Redutor de Medidas',
    description: 'Gel com cafeína para redução de medidas e celulite.',
    price: 110.0,
    stock: 7,
    category: 'Corporal',
    brand: 'BodyFit',
  },
  {
    id: '7',
    name: 'Sabonete Facial Esfoliante',
    description: 'Limpeza profunda com microesferas naturais.',
    price: 35.5,
    stock: 25,
    category: 'Facial',
    brand: 'CleanSkin',
  },
  {
    id: '8',
    name: 'Creme para Mãos e Unhas',
    description: 'Hidratação intensiva para mãos e fortalecimento de unhas.',
    price: 28.9,
    stock: 30,
    category: 'Mãos e Pés',
    brand: 'HandCare',
  },
];

// Appointments
export const mockAppointments: Appointment[] = [
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
    cityId: '1',
    cityName: 'São Paulo',
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Mariana Santos',
    professionalId: '3',
    professionalName: 'Dra. Isabela Alves',
    serviceId: '2',
    serviceName: 'Massagem Relaxante',
    date: '2025-05-15T11:00:00',
    status: 'confirmed',
    notes: '',
    cityId: '1',
    cityName: 'São Paulo',
  },
  {
    id: '3',
    clientId: '5',
    clientName: 'Juliana Mendes',
    professionalId: '2',
    professionalName: 'Dr. Miguel Ribeiro',
    serviceId: '4',
    serviceName: 'Peeling de Diamante',
    date: '2025-05-15T14:30:00',
    status: 'pending',
    notes: 'Primeira sessão',
    cityId: '3',
    cityName: 'Belo Horizonte',
  },
  {
    id: '4',
    clientId: '7',
    clientName: 'Fernanda Lima',
    professionalId: '5',
    professionalName: 'Dra. Luiza Ferreira',
    serviceId: '6',
    serviceName: 'Hidratação Facial',
    date: '2025-05-15T16:00:00',
    status: 'confirmed',
    notes: '',
    cityId: '5',
    cityName: 'Porto Alegre',
  },
  {
    id: '5',
    clientId: '2',
    clientName: 'Carlos Oliveira',
    professionalId: '6',
    professionalName: 'Dr. Rafael Costa',
    serviceId: '3',
    serviceName: 'Drenagem Linfática',
    date: '2025-05-16T09:00:00',
    status: 'confirmed',
    notes: 'Paciente com retenção de líquidos',
    cityId: '2',
    cityName: 'Rio de Janeiro',
  },
  {
    id: '6',
    clientId: '9',
    clientName: 'Camila Rodrigues',
    professionalId: '7',
    professionalName: 'Dra. Carolina Lima',
    serviceId: '5',
    serviceName: 'Depilação a Laser',
    date: '2025-05-16T10:30:00',
    status: 'confirmed',
    notes: 'Terceira sessão',
    cityId: '1',
    cityName: 'São Paulo',
  },
  {
    id: '7',
    clientId: '11',
    clientName: 'Beatriz Gomes',
    professionalId: '1',
    professionalName: 'Dra. Sofia Cardoso',
    serviceId: '8',
    serviceName: 'Microagulhamento',
    date: '2025-05-16T13:00:00',
    status: 'pending',
    notes: '',
    cityId: '2',
    cityName: 'Rio de Janeiro',
  },
  {
    id: '8',
    clientId: '6',
    clientName: 'Roberto Almeida',
    professionalId: '4',
    professionalName: 'Dr. André Santos',
    serviceId: '2',
    serviceName: 'Massagem Relaxante',
    date: '2025-05-16T15:00:00',
    status: 'confirmed',
    notes: 'Foco em região lombar',
    cityId: '1',
    cityName: 'São Paulo',
  },
  {
    id: '9',
    clientId: '6',
    clientName: 'Roberto Almeida',
    professionalId: '4',
    professionalName: 'Dr. André Santos',
    serviceId: '2',
    serviceName: 'Massagem Relaxante',
    date: '2025-02-03T15:00:00',
    status: 'confirmed',
    notes: 'Foco em região lombar',
    cityId: '1',
    cityName: 'São Paulo',
  },
];