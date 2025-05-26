import { useState, useCallback, useEffect } from 'react';
import type { Room } from '../types/Room';
import type { RecreativeElement } from '../types/RecreativeElement';
import styled from 'styled-components';
import RoomList from './RoomList';
import { useNavigate } from 'react-router-dom';
import { getUserByIdentification, createReservation, fetchElements } from '../services/api';
import axios from 'axios';
import ReactSelect from 'react-select';

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
  overflow: visible;

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

// Interfaces
interface TimeSlot {
  day: string;
  hour: string;
}

interface ElementOption {
  value: number;
  label: string;
  quantity: number;
}

interface SelectedElement {
  element: number;
  amount: number;
  element_details: {
    id: number;
    name: string;
    quantity: number;
  };
}

const VALID_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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
  const [elements, setElements] = useState<ElementOption[]>([]);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar elementos disponibles
  useEffect(() => {
    const loadElements = async () => {
      try {
        const data = await fetchElements();
        console.log('Elementos cargados:', data);
        const options = data.map((item: { element: number; label: string; quantity: number }) => ({
          value: item.element,
          label: item.label,
          quantity: item.quantity,
        }));
        setElements(options);
      } catch (error) {
        console.error('Error al cargar elementos:', error);
        setError('Error al cargar los elementos recreativos');
      }
    };
    loadElements();
  }, []);

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
      setUserId(null);
      setUserName(null);
      
      const user = await getUserByIdentification(identification);
      
      if (!user) {
        setError('No se encontró un usuario con esa identificación');
        return;
      }
      
      setUserId(user.id);
      setUserName(user.name);
      
    } catch (error) {
      console.error('Error buscando usuario:', error);
      setUserId(null);
      setUserName(null);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError('No se encontró ningún usuario con esa identificación');
        } else if (error.response?.status === 400) {
          setError('Identificación inválida. Por favor verifica el formato');
        } else {
          setError(error.response?.data?.detail || 'Error al buscar usuario');
        }
      } else {
        setError('Error al buscar usuario. Por favor intenta de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de elementos desde el combobox
  const handleElementSelect = (option: ElementOption | null) => {
    if (option && !selectedElements.some(e => e.element === option.value)) {
      setSelectedElements([
        ...selectedElements,
        {
          element: option.value,
          amount: 1,
          element_details: {
            id: option.value,
            name: option.label,
            quantity: option.quantity,
          },
        },
      ]);
    }
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (elementId: number, quantity: number) => {
    setSelectedElements(prev =>
      prev.map(element =>
        element.element === elementId
          ? { ...element, amount: Math.max(1, quantity) }
          : element
      )
    );
  };

  // Eliminar elemento seleccionado
  const handleRemoveElement = (elementId: number) => {
    setSelectedElements(prev => prev.filter(e => e.element !== elementId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar campos requeridos
    if (!selectedSlot || !roomSelected || !userId) {
      setError('Todos los campos son requeridos: sala, horario y usuario');
      return;
    }

    // Validar formato de día y hora
    if (!VALID_DAYS.includes(selectedSlot.day)) {
      setError(`Día inválido. Valores permitidos: ${VALID_DAYS.join(', ')}`);
      return;
    }

    if (!VALID_HOURS.includes(selectedSlot.hour)) {
      setError(`Bloque horario inválido. Valores permitidos: ${VALID_HOURS.join(', ')}`);
      return;
    }

    try {
      setLoading(true);

      // Preparar elementos seleccionados
      const elementsData = selectedElements.map(e => ({
        element_id: e.element,
        amount: e.amount
      }));

      const reservationData = {
        room: roomSelected.id,
        reserved_day: selectedSlot.day,
        reserved_hour_block: selectedSlot.hour,
        user: String(userId),
        state: 'activa',
        location: roomSelected.location || 'Ubicación no especificada',
        borrowed_elements: elementsData.length > 0 ? elementsData : undefined
      };

      console.log('Enviando reserva:', reservationData);

      const response = await createReservation(reservationData);
      
      if (response.id) {
        alert('¡Reserva creada con éxito!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error en reserva:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
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
        <Title>Seleccionar Elementos Recreativos</Title>
        
        {/* Combobox para seleccionar elementos */}
        <FormGroup>
          <Label>Agregar Elementos</Label>
          <ReactSelect<ElementOption>
            options={elements}
            onChange={handleElementSelect}
            isSearchable
            placeholder="Buscar y seleccionar elementos..."
            noOptionsMessage={() => "No se encontraron elementos"}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, zIndex: 9999 })
            }}
          />
        </FormGroup>

        {/* Lista de elementos seleccionados */}
        {selectedElements.length > 0 && (
          <div>
            <Title style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Elementos Seleccionados</Title>
            {selectedElements.map(element => (
              <FormGroup key={element.element}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '0.5rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.25rem',
                  backgroundColor: 'white'
                }}>
                  <Label style={{ flex: 1, marginBottom: 0 }}>
                    {element.element_details.name}
                  </Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Label style={{ marginBottom: 0, fontSize: '0.9rem' }}>Cantidad:</Label>
                    <Input
                      type="number"
                      min="1"
                      max={element.element_details.quantity}
                      value={element.amount}
                      onChange={e => handleQuantityChange(element.element, parseInt(e.target.value) || 1)}
                      style={{ width: '80px', padding: '0.25rem' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveElement(element.element)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      background: '#dc2626', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </FormGroup>
            ))}
          </div>
        )}
      </ElementsSection>

      <UserSection>
        <Title>Datos de la reserva</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Buscar usuario por ID</Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                value={identification}
                onChange={e => {
                  setIdentification(e.target.value);
                  setUserId(null);
                  setUserName(null);
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

          {userId && userName && (
            <FormGroup>
              <Label>Usuario encontrado</Label>
              <Input
                type="text"
                value={`${userName} (ID: ${userId})`}
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
              style={{ backgroundColor: '#f8f9fa', color: 'black' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Horario seleccionado</Label>
            <Input
              type="text"
              value={selectedSlot ? `${selectedSlot.day} ${selectedSlot.hour}` : 'Ninguno'}
              readOnly
              style={{ backgroundColor: '#f8f9fa', color: 'black' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Elementos seleccionados</Label>
            <Input
              type="text"
              value={selectedElements.length > 0
                ? selectedElements.map(e => `${e.element_details.name} (${e.amount})`).join(', ')
                : 'Ninguno'}
              readOnly
              style={{ backgroundColor: '#f8f9fa', color: 'black' }}
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