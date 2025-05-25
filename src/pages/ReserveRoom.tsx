import { useState, useCallback } from 'react';
import type { Room } from '../types/Room';
import type { RecreativeElement } from '../types/RecreativeElement';
import styled from 'styled-components';
import RoomList from './RoomList';
import ElementList from './ElementList';
import { useNavigate } from 'react-router-dom';
import { getUserByIdentification, createReservation } from '../services/api';
import axios from 'axios';

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

const ElementsSection = styled.div`
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

const ElementQuantityInput = styled.input`
  width: 50px;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  text-align: center;
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

// Solucionado: Usar $ prefix para props transientes en styled-components
const TimeSlotCell = styled.td<{ $selected: boolean; $available: boolean }>`
  padding: 0.2rem;
  border: 1px solid #dee2e6;
  text-align: center;
  background-color: ${({ $selected, $available }) =>
    $selected ? '#28a745' : $available ? '#ffffff' : '#f8d7da'};
  color: ${({ $selected, $available }) =>
    $selected ? 'white' : $available ? '#495057' : '#721c24'};
  cursor: ${({ $available }) => ($available ? 'pointer' : 'not-allowed')};
  transition: all 0.2s;
  font-size: 0.7rem;
  min-width: 50px;
  height: 30px;

  &:hover {
    background-color: ${({ $selected, $available }) =>
      $selected ? '#28a745' : $available ? '#e9ecef' : '#f8d7da'};
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

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
`;

interface TimeSlot {
  day: string;
  hour: string;
}

const VALID_DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const VALID_HOURS = [
  '7:00-8:30',
  '8:30-10:00',
  '10:00-11:30',
  '11:30-13:00',
  '13:00-14:30',
  '14:30-16:00',
  '16:00-17:30',
  '17:30-19:00'
];

const ReserveRoom = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [identification, setIdentification] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [roomSelected, setRoomSelected] = useState<Room | null>(null);
  const [elementsSelected, setElementsSelected] = useState<RecreativeElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSlotSelect = (day: string, hour: string) => {
    if (!VALID_DAYS.includes(day)) {
      setError(`Día inválido. Valores permitidos: ${VALID_DAYS.join(', ')}`);
      return;
    }
    if (!VALID_HOURS.includes(hour)) {
      setError(`Bloque horario inválido. Valores permitidos: ${VALID_HOURS.join(', ')}`);
      return;
    }
    setSelectedSlot({ day, hour });
    setError('');
  };

  const handleSearchUser = async () => {
    setError('');
    if (!identification.trim()) {
      setError('Por favor ingresa una identificación válida');
      return;
    }

    try {
      setLoading(true);
      const userResponse = await getUserByIdentification(identification);
      if (userResponse?.user_id) {
        setUserId(userResponse.user_id);
        setUserName(userResponse.full_name);
      } else {
        setError('Usuario no encontrado');
        setUserId(null);
      }
    } catch (error) {
      console.error('Error buscando usuario:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Error al buscar usuario';
        setError(errorMessage);
      } else {
        setError('Error al buscar usuario. Verifica la identificación');
      }
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all required fields
    if (!selectedSlot || !roomSelected || !userId) {
      setError('Todos los campos son requeridos: sala, horario y usuario');
      return;
    }

    // Validate day and hour format
    if (!VALID_DAYS.includes(selectedSlot.day)) {
      setError(`Día inválido. Valores permitidos: ${VALID_DAYS.join(', ')}`);
      return;
    }

    if (!VALID_HOURS.includes(selectedSlot.hour)) {
      setError(`Bloque horario inválido. Valores permitidos: ${VALID_HOURS.join(', ')}`);
      return;
    }

    // Validate elements
    const elementsData = elementsSelected.map(e => {
      const quantity = Number(e.quantity) || 1;
      if (quantity <= 0) {
        throw new Error(`Cantidad inválida para el elemento ${e.name || 'sin nombre'}`);
      }
      return {
        element_id: e.id,
        amount: quantity
      };
    });

    try {
      setLoading(true);

      const reservationData = {
        room: roomSelected.id,
        reserved_day: selectedSlot.day,
        reserved_hour_block: selectedSlot.hour,
        user: Number(userId),
        state: 'activa',
        location: roomSelected.location || 'Ubicación no especificada',
        borrowed_elements: elementsData.length > 0 ? elementsData : undefined
      };

      console.log('Enviando reserva:', reservationData);

      const response = await createReservation(reservationData);
      if (axios.isAxiosError(error)) {
        console.error('Detalle del error:', error.response?.data);
      }
      if (response.id) {
        alert('¡Reserva creada con éxito!');
        navigate('/Home');
      }
    } catch (error) {
      console.error('Error en reserva:', error);
      if (axios.isAxiosError(error)) {
        const errorDetail = error.response?.data?.detail ||
                           error.response?.data?.message ||
                           'Error al crear la reserva';
        setError(errorDetail);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido al crear la reserva');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setElementsSelected(prev =>
      prev.map(element =>
        element.id === id ? { ...element, quantity } : element
      )
    );
  };

  const handleElementSelect = useCallback((selectedElements: RecreativeElement[]) => {
  setElementsSelected(prevSelected =>
    selectedElements.map(el => {
      const existing = prevSelected.find(e => e.id === el.id);
      return {
        ...el,
        quantity: existing?.quantity || 1
      };
    })
  );
}, []);


  return (
    <ResponsiveContainer>
      <ScheduleSection>
        <RoomList onRoomSelect={setRoomSelected} />
        <Title>Selecciona tu horario</Title>

        <ScheduleTable>
          <thead>
            <tr>
              <TableHeader>Hora</TableHeader>
              {VALID_DAYS.map(day => (
                <TableHeader key={day}>{day}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {VALID_HOURS.map((hour, hourIndex) => (
              <tr key={`hour-${hourIndex}`}>
                <TimeLabel>{hour}</TimeLabel>
                {VALID_DAYS.map((day, dayIndex) => (
                  <TimeSlotCell
                    key={`${day}-${hour}-${dayIndex}`}
                    $selected={selectedSlot?.day === day && selectedSlot?.hour === hour}
                    $available={true}
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

      <ElementsSection>
        <ElementList onElementSelect={handleElementSelect} />

        {elementsSelected.map(element => (
          <div key={`element-${element.id}`} style={{ marginBottom: '1rem' }}>
            <span>{element.name}</span>
            <ElementQuantityInput
              type="number"
              min="1"
              value={element.quantity || 1}
              onChange={e => {
                const value = parseInt(e.target.value, 10);
                handleQuantityChange(element.id, isNaN(value) ? 1 : Math.max(1, value));
              }}
            />
          </div>
        ))}
      </ElementsSection>

      <UserSection>
        <Title>Datos de la reserva</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Buscar usuario por Id</Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                value={identification}
                onChange={e => {
                  setIdentification(e.target.value);
                  setUserId(null);
                  setError('');
                }}
                placeholder="Ingresa la identificación del usuario"
                required
              />
              <SubmitButton
                type="button"
                onClick={handleSearchUser}
                disabled={loading || !identification.trim()}
                style={{ width: 'auto', padding: '0 1rem' }}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </SubmitButton>
            </div>
          </FormGroup>

          {userId && (
            <FormGroup>
              <Label>Usuario encontrado</Label>
              <Input
                type="text"
                value={`Usuario ID: ${userId} , nombre: ${userName}`}
                readOnly
                style={{ backgroundColor: '#e9ecef', color: 'black' }}
              />
            </FormGroup>
          )}
        
          <FormGroup>
            <Label>Sala seleccionada</Label>
            <Input
              type="text"
              value={roomSelected ? `${roomSelected.location} - ${roomSelected.description}` : 'Ninguna'}
              readOnly
              style={{ backgroundColor: '#f8f9fa' , color: 'black' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Horario seleccionado</Label>
            <Input
              type="text"
              value={selectedSlot ? `${selectedSlot.day} ${selectedSlot.hour}` : 'Ninguno'}
              readOnly
              style={{ backgroundColor: '#f8f9fa' , color: 'black' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Elementos seleccionados</Label>
            <Input
              type="text"
              value={elementsSelected.length > 0
                ? elementsSelected.map(e => `${e.name} (${e.quantity})`).join(', ')
                : 'Ninguno'}
              readOnly
              style={{ backgroundColor: '#f8f9fa' , color: 'black' }}
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={!selectedSlot || !roomSelected || !userId || loading}
          >
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
          </SubmitButton>
        </form>
      </UserSection>
    </ResponsiveContainer>
  );
};

export default ReserveRoom;