import { useState } from 'react';
import styled from 'styled-components';
import RoomList from './RoomList';
import ElementList from './ElementList';

const Section3 = styled.section`
  padding: 4rem 2rem;
  background-color: #f9fafb;
  text-align: center;
`;

const Title3 = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Description3 = styled.p`
  color: #4b5563;
  margin-bottom: 2rem;
`;

const ToggleButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

interface ToggleButtonProps {
  $active: boolean;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: ${({ $active }) => ($active ? '#b91c1c' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#1f2937')};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#991b1b' : '#f3f4f6')};
  }
`;

export const AvailabilitySection  = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'elements'>('rooms');

  return (
    <Section3>
      <Title3>Disponibilidad en Tiempo Real</Title3>
      <Description3>
        Consulta la disponibilidad de salas y elementos recreativos
      </Description3>
      <ToggleButtons>
        <ToggleButton
          $active={activeTab === 'rooms'}
          onClick={() => setActiveTab('rooms')}
        >
          Salas
        </ToggleButton>
        <ToggleButton
          $active={activeTab === 'elements'}
          onClick={() => setActiveTab('elements')}
        >
          Elementos
        </ToggleButton>
      </ToggleButtons>
      {activeTab === 'rooms' ? <RoomList /> : <ElementList />}
    </Section3>
  );
};

const AvailabilityPage = () => {
  return (
    <div>
      <AvailabilitySection />
      {/* You can add additional page-specific content here */}
    </div>
  );
};

export default AvailabilityPage;
