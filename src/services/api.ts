import axios from 'axios';
import type { Reservation, User} from '../types/Reservation';

const isLocalhost = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const baseURL = isLocalhost
    ? 'https://desplieguebackproyecto-caewexbzb2hbhje2.eastus-01.azurewebsites.net'
    : 'http://localhost:8000';
    

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRooms = async () => {
  const response = await api.get('/room/');
  return response.data;
};

export const fetchElements = async () => {
  const response = await api.get('/recreative-elements/');
  return response.data.map((item: { id: number; item_name: string; item_quantity: number }) => ({
    element: item.id,
    label: item.item_name,
    quantity: item.item_quantity,
    element_details: {
      id: item.id,
      name: item.item_name,
      quantity: item.item_quantity,
    },
  }));
};

export const searchReservations = async (id: number): Promise<Reservation[]> => {
  try {
    const response = await api.get(`/reservation/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error searching reservations:', error);
    throw error;
  }
};

export const getUserByIdentification = async (identification: string): Promise<User | null> => {
  try {
    const response = await api.get(`/user/${identification}/`);
    
    console.debug('Respuesta completa del servidor:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    // Validación adaptada a la estructura real de la API
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Formato de respuesta no válido');
    }

    const userData = response.data;

    // Convertir la estructura de la API a nuestro modelo User
    return {
      id: Number(userData.user_id) || 0, // Mapear user_id a id
      name: userData.full_name || 'Nombre no proporcionado', // Mapear full_name a name
      email: userData.email_address || '', // Mapear email_address a email
      identification: userData.identification_number || identification // Mapear identification_number
    };
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null; // Usuario no encontrado
      }
      console.error('Error en la respuesta de la API:', error.response?.data);
      throw new Error(error.response?.data?.detail || 
                     error.response?.data?.message || 
                     'Error al buscar usuario');
    }
    console.error('Error inesperado:', error);
    throw new Error('Error al procesar la respuesta del servidor');
  }
};

export const createReservation = async (data: {
  room?: number;
  reserved_day: string;
  reserved_hour_block: string;
  user: string;
  location: string;
  state?: string;
    borrowed_elements?: Array<{
      element_id: number;
      amount: number;
      element_details?: {
        id: number;
        item_name: string;
        item_quantity: number;
      };
    }>;
  }): Promise<Reservation> => {
    try {
      const response = await api.post('/reservation/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
};




// Ejemplo: Reservar una sala
export const reserveRoom = async (roomId: number, day: string, hour: string) => {
  const response = await api.post(`/reservation/`, {
    room: roomId,
    reserved_day: day,
    reserved_hour_block: hour,
  });
  return response.data;


};

export const getAllReservations = async (): Promise<Reservation[]> => {
  const response = await api.get('/reservation/');
  return response.data;
};

export const getReservationById = async (id: number): Promise<Reservation | null> => {
  try {
    const response = await api.get(`/reservation/${id}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const getReservationBysUserId = async (id: number): Promise<Reservation | null> => {
  try {
    const response = await api.get(`/reservation/user/${id}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createRoom = async (data: {
  location: string;
  capacity: number;
  description: string;
  availability: number[][];
  state: string;
}) => {
  try {
    const response = await api.post('/room/', data);
    return response.data;
  } catch (error) {
    console.error('Error creando sala:', error);
    throw error;
  }
};

export const createRecreativeElement = async (data: {
  item_name: string;
  item_quantity: number;
}) => {
  try {
    const response = await api.post('/recreative-elements/', data);
    return response.data;
  } catch (error) {
    console.error('Error creando elemento recreativo:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId: number): Promise<void> => {
  try {
    const response = await api.delete(`/room/${roomId}/`);
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    throw new Error('No se pudo eliminar la sala. Por favor intente nuevamente.');
  }
};


export const deleteRecreativeElement = async (elementId: number): Promise<void> => {
  try {
    const response = await api.delete(`/recreative-elements/${elementId}/`);
    if (response.status !== 204) {
      throw new Error('Error eliminando elemento');
    }
  } catch (error) {
    console.error('Error deleting element:', error);
    throw error;
  }
};