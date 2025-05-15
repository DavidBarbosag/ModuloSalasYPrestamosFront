import axios from 'axios';
import type {Reservation} from '../types/Reservation';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Ejemplo: Obtener todas las salas
export const fetchRooms = async () => {
  const response = await api.get('/room/');
  return response.data;
};

export const fetchElements = async () => {
    const response = await api.get('/recreative-elements/');
    return response.data;
}

export const searchReservations = async (query: string): Promise<Reservation[]> => {
  try {
    const response = await api.get(`/reservation/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching reservations:', error);
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