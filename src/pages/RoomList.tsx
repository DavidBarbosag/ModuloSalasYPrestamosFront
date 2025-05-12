// src/pages/RoomList.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRooms } from '../services/api';
import type {Room} from '../types/Room.ts';
import RoomSchedule from '../components/RoomSchedule';

import Button from '@mui/material/Button';
import ListAltIcon from '@mui/icons-material/ListAlt';


const RoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  if (loading) return <div>Cargando salas...</div>;

  return (
    <div>
      <h1>Salas Disponibles</h1>

      <div style={{ marginBottom: '20px' }}>
        <Link to="/reservations">
          <Button
            variant="contained"
            startIcon={<ListAltIcon />}
            component={Link}
            to="/reservations"
            style={{ marginRight: '10px' }}
          >
            Ver Reservas
          </Button>
        </Link>
      </div>


      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <h2>{room.location}</h2>
            <p>Capacidad: {room.capacity}</p>
            <p>{room.description}</p>
            {
              <RoomSchedule room={room} />
            }

          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;