import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Room } from '../types/Room';
import { createRoom, createRecreativeElement, deleteRoom, fetchElements, deleteRecreativeElement } from '../services/api';
import { fetchRooms } from '../services/api';
import RoomSchedule from '../components/RoomSchedule';

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  max-width: 700px;
  min-width: 700px;
`;

const ScheduleSection = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ElementsSection = styled(ScheduleSection)``;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  box-sizing: border-box;
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;

const RoomContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
`;

const RoomCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RoomTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  justify-content: space-between;
`;

const RoomId = styled.span`
  font-weight: normal;
  color: #6b7280;
  font-size: 1rem;
`;

const RoomInfo = styled.p`
  color: #4b5563;
  margin: 0;
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-end;
  
  &:hover {
    background: #b91c1c;
  }
`;

const ElementItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;

  div:first-child {
    flex: 1;
    word-break: break-word;
  }
`;

const Card = styled.div`
  background-color: white;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const CardButton = styled.button`
  background-color: #b91c1c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7f1d1d;
  }
`;



interface NewRoom extends Omit<Room, 'id'> {
  description: string;
  availability: number[][];
  state: string;
}

interface RecreationalElement {
  name: string;
  quantity: number;
}

interface ElementOption {
  value: number;
  label: string;
  quantity: number;
}

export const AdminPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [elements, setElements] = useState<RecreationalElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [recreativeElements, setRecreativeElements] = useState<ElementOption[]>([]);

  const [roomData, setRoomData] = useState({
    location: '',
    capacity: '',
    description: '',
  });

  const [elementData, setElementData] = useState({
    name: '',
    quantity: '',
  });

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
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

  const handleAddRoom = async () => {
    const newRoom: NewRoom = {
      location: roomData.location,
      capacity: parseInt(roomData.capacity),
      description: roomData.description,
      state: 'Disponible',
      availability: Array(8).fill(0).map(() => Array(6).fill(0)),
    };

    try {
      const createdRoom = await createRoom(newRoom);
      setRooms([...rooms, createdRoom]); 
      setRoomData({ location: '', capacity: '', description: '' });
      alert(`Sala creada exitosamente`);
    } catch (error) {
      console.error('Error al crear la sala en el backend:', error);
    }
  };

  const handleAddElement = async () => {
    const newElement: RecreationalElement = {
      name: elementData.name,
      quantity: parseInt(elementData.quantity),
    };
    try {
      const createdElement = await createRecreativeElement({
        item_name: newElement.name,
        item_quantity: newElement.quantity,
      });
      setElements([...elements, createdElement]);
      setElementData({ name: '', quantity: '' });
      alert(`Elemento recreativo creado exitosamente`);
    } catch (error) {
      console.error('Error al crear el elemento recreativo en el backend:', error);
    }  
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta sala?')) return;

    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((room) => room.id !== roomId));
      alert('Sala eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando sala:', error);
      alert('No se pudo eliminar la sala');
    }
  };

  useEffect(() => {
    const loadElements = async () => {
      try {
        const data = await fetchElements();
        const options = data.map((item: { element: number; label: string; quantity: number }) => ({
          value: item.element,
          label: item.label,
          quantity: item.quantity,
        }));
        setRecreativeElements(options);
      } catch (error) {
        console.error('Error loading elements:', error);
      }
    };
    loadElements();
  }, []);

  const handleDeleteElement = async (elementId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
    
    try {
      await deleteRecreativeElement(elementId);
      setRecreativeElements(prev => prev.filter(el => el.value !== elementId));
      alert('Elemento eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando elemento:', error);
      alert('No se pudo eliminar el elemento');
    }
  };

  return (
    <ResponsiveContainer>
        <Card>
            <CardTitle>Gestionar Reservas</CardTitle>
            <CardDescription>
              Gestionar las reservas de salas y elementos recreativos del campus.
            </CardDescription>
            <Link to="/reservations">
              <CardButton>reservas</CardButton>
            </Link>
          </Card>
      <ScheduleSection>
        <Title>Crear Sala</Title>
        <FormGroup>
          <Label>Ubicación</Label>
          <Input 
            value={roomData.location} 
            onChange={(e) => setRoomData({ ...roomData, location: e.target.value })} 
          />
        </FormGroup>
        <FormGroup>
          <Label>Capacidad</Label>
          <Input 
            type="number" 
            value={roomData.capacity} 
            onChange={(e) => setRoomData({ ...roomData, capacity: e.target.value })} 
          />
        </FormGroup>
        <FormGroup>
          <Label>Descripción</Label>
          <Input 
            value={roomData.description} 
            onChange={(e) => setRoomData({ ...roomData, description: e.target.value })} 
          />
        </FormGroup>
        <SubmitButton onClick={handleAddRoom}>Crear Sala</SubmitButton>
      </ScheduleSection>

      <ElementsSection>
        <Title>Crear Elemento Recreativo</Title>
        <FormGroup>
          <Label>Nombre</Label>
          <Input 
            value={elementData.name} 
            onChange={(e) => setElementData({ ...elementData, name: e.target.value })} 
          />
        </FormGroup>
        <FormGroup>
          <Label>Cantidad</Label>
          <Input 
            type="number" 
            value={elementData.quantity} 
            onChange={(e) => setElementData({ ...elementData, quantity: e.target.value })} 
          />
        </FormGroup>
        <SubmitButton onClick={handleAddElement}>Agregar Elemento</SubmitButton>
      </ElementsSection>

      <ScheduleSection>
        <Title>Salas Existentes</Title>
        {loading ? (
          <LoadingMessage>Cargando salas...</LoadingMessage>
        ) : (
          <RoomContainer>
            {rooms.map((room) => (
              <RoomCard key={room.id}>
                <RoomTitle>
                  {room.location}
                  <RoomId>ID: {room.id}</RoomId>
                </RoomTitle>
                <RoomInfo><strong>Capacidad:</strong> {room.capacity}</RoomInfo>
                <RoomInfo><strong>Descripción:</strong> {room.description}</RoomInfo>
                <RoomSchedule room={room} />
                <DeleteButton onClick={() => handleDeleteRoom(room.id)}>
                  Eliminar Sala
                </DeleteButton>
              </RoomCard>
            ))}
          </RoomContainer>
        )}
      </ScheduleSection>

      <ScheduleSection>
        <Title>Elementos Recreativos</Title>
        
        <div>
          {recreativeElements.map(element => (
            <ElementItem key={element.value}>
              <div>
                <strong>{element.label}</strong>
              </div>
              <DeleteButton onClick={() => handleDeleteElement(element.value)}>
                Eliminar
              </DeleteButton>
            </ElementItem>
          ))}
        </div>
      </ScheduleSection>
    </ResponsiveContainer>
  );
};

export default AdminPage;