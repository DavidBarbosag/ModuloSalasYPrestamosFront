import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ScheduleSelection from '../components/ScheduleSelection';
import { fetchElements, createReservation, getUserByIdentification } from '../services/api';
import axios from 'axios';
import ReactSelect from 'react-select';


const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 1rem;
  gap: 2rem;
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #fee2e2;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #b91c1c;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #343a40;
`;

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


interface ElementOption {
  value: number;
  label: string;
  quantity: number;
}

interface TimeSlot {
  day: string;
  hour: string;
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



const ReserveRecreativeElements = () => {
  const navigate = useNavigate();
  const [elements, setElements] = useState<ElementOption[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [identification, setIdentification] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [location, setLocation] = useState(''); // Nuevo estado para la ubicación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadElements = async () => {
      try {
        const data = await fetchElements();
        console.log('Opciones procesadas:', data);
        const options = data.map((item: { element: number; label: string; quantity: number }) => ({
          value: item.element,
          label: item.label,
          quantity: item.quantity,
        }));
        setElements(options);
      } catch (_error) {
        setError('Error al cargar los elementos');
      }
    };
    loadElements();
  }, []);

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

  const handleQuantityChange = (elementId: number, quantity: number) => {
    setSelectedElements(prev =>
        prev.map(element =>
            element.element === elementId
                ? { ...element, amount: Math.max(1, quantity) }
                : element
        )
    );
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

      if (userResponse && userResponse.id) {
        setUserId(userResponse.id);
        alert(`Usuario encontrado: ${userResponse.name}`);
        setError('');
      } else {
        setError('No se encontró el usuario. Verifica la identificación');
        setUserId(null);
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
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
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que todos los campos requeridos estén completos
    if (!selectedSlot || !userId || selectedElements.length === 0 || !location.trim()) {
      setError('Todos los campos son requeridos: usuario, horario, ubicación y elementos seleccionados');
      return;
    }

    try {
      const elementsData = selectedElements.map(e => {
        return {
          element_id: e.element,
          amount: e.amount,
        };
      });

      const reservationData = {
        room: undefined,
        reserved_day: selectedSlot.day,
        reserved_hour_block: selectedSlot.hour,
        user: String(userId),
        state: 'activa',
        location: location.trim(),
        borrowed_elements: elementsData,
      };

      console.log('Datos enviados:', reservationData);

      const response = await createReservation(reservationData);

      if (response.id) {
        alert('¡Reserva creada con éxito!');
        navigate('/reservations');
      }
    } catch (error) {
      console.error('Error en reserva:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
        setError(error.response?.data?.detail || 'Error al crear la reserva');
      } else {
        setError('Error desconocido al crear la reserva');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <ResponsiveContainer>
        <h2>Reserva de Elementos Recreativos</h2>
        <form onSubmit={handleSubmit}>
          {/* Sección de identificación */}
          <FormSection>
            <FormGroup>
              <Label>Identificación del Usuario</Label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Input
                    type="text"
                    value={identification}
                    onChange={e => setIdentification(e.target.value)}
                    placeholder="Ingresa la identificación"
                />
                <SubmitButton
                    type="button"
                    onClick={handleSearchUser}
                    disabled={loading || !identification.trim()}
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </SubmitButton>
              </div>
            </FormGroup>
          </FormSection>

          {/* Sección de ubicación */}
          <FormSection>
            <FormGroup>
              <Label>Ubicación</Label>
              <Input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ingresa la ubicación"
              />
            </FormGroup>
          </FormSection>

          {/* Sección de selección de horario */}
          <Title>Selecciona tu horario</Title>
          <ScheduleSelection
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
          />

          {/* Sección de selección de elementos */}
          <FormSection>
            <FormGroup>
              <Label>Seleccionar Elementos</Label>
              <ReactSelect<ElementOption>
                  options={elements}
                  onChange={handleElementSelect}
                  isSearchable
                  placeholder="Selecciona elementos..."
              />
            </FormGroup>

            {selectedElements.map(element => (
                <FormGroup key={element.element}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Label>{element.element_details.name}</Label>
                    <Input
                        type="number"
                        min="1"
                        value={element.amount}
                        onChange={e => handleQuantityChange(element.element, parseInt(e.target.value))}
                        style={{ width: '100px' }}
                    />
                    <button
                        type="button"
                        onClick={() => setSelectedElements(prev => prev.filter(e => e.element !== element.element))}
                        style={{ padding: '0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.375rem' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </FormGroup>
            ))}
          </FormSection>
          {/* Resumen de la reserva */}
          <FormSection>
            <Title>Resumen de la Reserva</Title>
            <div>
              <p><strong>Identificación del Usuario:</strong> {identification || 'No ingresada'}</p>
              <p><strong>Ubicación:</strong> {location || 'No ingresada'}</p>
              <p><strong>Horario Seleccionado:</strong> {selectedSlot ? `${selectedSlot.day}, ${selectedSlot.hour}` : 'No seleccionado'}</p>
              <p><strong>Elementos Seleccionados:</strong></p>
              <ul>
                {selectedElements.length > 0 ? (
                    selectedElements.map(element => (
                        <li key={element.element}>
                          {element.element_details.name} - Cantidad: {element.amount}
                        </li>
                    ))
                ) : (
                    <p>No se han seleccionado elementos</p>
                )}
              </ul>
            </div>
          </FormSection>

          {/* Botón de envío */}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton
              type="submit"
              disabled={loading || !selectedSlot?.day || !selectedSlot?.hour || selectedElements.length === 0 || !userId || !location.trim()}
          >
            {loading ? 'Procesando...' : 'Crear Reserva'}
          </SubmitButton>
        </form>
      </ResponsiveContainer>
  );
};

export default ReserveRecreativeElements;