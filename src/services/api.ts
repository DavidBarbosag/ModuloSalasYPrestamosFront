import axios from 'axios';
import type { Reservation, User} from '../types/Reservation';

const api = axios.create({
  baseURL: 'https://desplieguebackproyecto-caewexbzb2hbhje2.eastus-01.azurewebsites.net',
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

export const getUserByIdentification = async (identification: string): Promise<User> => {
  try {
    const response = await api.get(`/user/${identification}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
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


