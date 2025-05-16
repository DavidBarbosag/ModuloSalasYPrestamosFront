import { useState } from 'react';
import type { Room } from '../types/Room';
import styled from 'styled-components';
import RoomList from './RoomList';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  getUserByIdentification,
  createReservation
} from '../services/api';

// Styled components
const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 1rem;
  gap: 2rem;
`;

const ScheduleSection = styled.div`
  width: 100%;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  @media (min-width: 768px) {
    flex: 2;
    padding: 2rem;
  }
`;

const UserSection = styled.div`
  width: 100%;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    flex: 1;
    padding: 2rem;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const TableHeader = styled.th`
  padding: 0.3rem;
  text-align: center;
  border: 1px solid #dee2e6;
  background-color: #e9ecef;
  font-weight: bold;
  white-space: nowrap;
  min-width: 50px;
`;

const TimeSlotCell = styled.td<{ selected: boolean; available: boolean }>`
  padding: 0.2rem;
  border: 1px solid #dee2e6;
  text-align: center;
  background-color: ${({ selected, available }) => 
    selected ? '#28a745' : available ? '#ffffff' : '#f8d7da'};
  color: ${({ selected, available }) => 
    selected ? 'white' : available ? '#495057' : '#721c24'};
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  transition: all 0.2s;
  font-size: 0.7rem;
  min-width: 50px;
  height: 30px;

  &:hover {
    background-color: ${({ selected, available }) => 
      selected ? '#28a745' : available ? '#e9ecef' : '#f8d7da'};
  }

  @media (max-width: 768px) {
    padding: 0.1rem;
    font-size: 0.6rem;
  }
`;

const TimeLabel = styled.td`
  padding: 0.3rem;
  border: 1px solid #dee2e6;
  background-color: #e9ecef;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  font-size: 0.8rem;
  min-width: 80px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    min-width: 70px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #b91c1c;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
  margin-top: 1rem;

  &:hover {
    border-color: #b91c1c;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    border-color: transparent;
  }
`;

interface TimeSlot {
  day: string;
  hour: string;
}

const ReserveRoom = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [identification, setIdentification] = useState('');
  const [userId, setUserId] = useState<number  | null>(null);
  const [roomSelected, setRoomSelected] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const HOURS = [
    '7:00-8:30',
    '8:30-10:00',
    '10:00-11:30',
    '11:30-13:00',
    '13:00-14:30',
    '14:30-16:00',
    '16:00-17:30',
    '17:30-19:00'
  ];

  const handleSlotSelect = (day: string, hour: string) => {
    setSelectedSlot({ day, hour });
  };

  const handleSearchUser = async () => {
    setError('');
    if (!identification) {
      setError('Por favor ingresa una identificación.');
      return;
    }
    try {
      setLoading(true);
      const userResponse = await getUserByIdentification(identification);
      if (userResponse?.id) {
        setUserId(userResponse.id);
        alert('Usuario encontrado y guardado');
      } else {
        setError('Usuario no encontrado');
        setUserId(null);
      }
    } catch {
      setError('Error buscando usuario');
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSlot || !roomSelected) {
      setError('Debes seleccionar un horario y una sala.');
      return;
    }
    if (!userId) {
      setError('Debes buscar y seleccionar un usuario válido.');
      return;
    }

    try {
      setLoading(true);

      const reservationResponse = await createReservation({
        room: roomSelected.id,
        reserved_day: selectedSlot.day,
        reserved_hour_block: selectedSlot.hour,
        user: userId,
        location: roomSelected.location,
        borrowed_elements: []
      });

      if (reservationResponse.id) {
        alert('Reserva realizada con éxito!');
        navigate('/reservations');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError('Error al realizar la reserva. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <ScheduleSection>
        <RoomList onRoomSelect={setRoomSelected} />
        <Title>Selecciona tu horario</Title>

        <ScheduleTable>
          <thead>
            <tr>
              <TableHeader>Hora</TableHeader>
              {DAYS.map(day => (
                <TableHeader key={day}>{day}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(hour => (
              <tr key={hour}>
                <TimeLabel>{hour}</TimeLabel>
                {DAYS.map(day => (
                  <TimeSlotCell
                    key={`${day}-${hour}`}
                    selected={selectedSlot?.day === day && selectedSlot?.hour === hour}
                    available={true}
                    onClick={() => handleSlotSelect(day, hour)}
                  >
                    {selectedSlot?.day === day && selectedSlot?.hour === hour ? '✓' : ''}
                  </TimeSlotCell>
                ))}
              </tr>
            ))}
          </tbody>
        </ScheduleTable>
      </ScheduleSection>

      <UserSection>
        <Title>Búsqueda de usuario</Title>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Identificación</Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                name="identification"
                value={identification}
                onChange={(e) => {
                  setIdentification(e.target.value);
                  setUserId(null);
                  setError('');
                }}
                required
              />
              <SubmitButton
                type="button"
                onClick={handleSearchUser}
                disabled={loading || !identification}
                style={{ width: 'auto', padding: '0 1rem' }}
              >
                Buscar
              </SubmitButton>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>Sala seleccionada</Label>
            <Input
              type="text"
              value={roomSelected ? `${roomSelected.location} - ${roomSelected.location}` : 'Ninguna'}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>Horario seleccionado</Label>
            <Input
              type="text"
              value={selectedSlot ? `${selectedSlot.day} ${selectedSlot.hour}` : 'Ninguno'}
              readOnly
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={!selectedSlot || !roomSelected || loading}>
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
          </SubmitButton>
        </form>
      </UserSection>
    </ResponsiveContainer>
  );
};

export default ReserveRoom;
