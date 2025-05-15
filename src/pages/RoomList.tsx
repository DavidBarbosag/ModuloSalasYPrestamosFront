// src/pages/RoomList.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchRooms } from '../services/api';
import type { Room } from '../types/Room';
import RoomSchedule from '../components/RoomSchedule';

// Estilos
const Section = styled.section`
  padding: 4rem 2rem;
  background-color: #f3f4f6; /* gray-100 */
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.5rem;
`;

const RoomContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const RoomCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RoomTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937; /* gray-800 */
`;

const RoomInfo = styled.p`
  color: #4b5563; /* gray-600 */
  margin: 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280; /* gray-500 */
`;

// Componente principal
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

  if (loading) return <LoadingMessage>Cargando salas...</LoadingMessage>;

  return (
    <Section>
      <Title>Salas Disponibles</Title>
      <RoomContainer>
        {rooms.map((room) => (
          <RoomCard key={room.id}>
            <RoomTitle>{room.location}</RoomTitle>
            <RoomInfo><strong>Capacidad:</strong> {room.capacity}</RoomInfo>
            <RoomInfo>{room.description}</RoomInfo>
            <RoomSchedule room={room} />
          </RoomCard>
        ))}
      </RoomContainer>
    </Section>
  );
};

export default RoomList;
