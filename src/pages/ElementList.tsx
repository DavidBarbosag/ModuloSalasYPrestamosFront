// src/pages/RoomList.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchElements } from '../services/api';
import type { Element } from '../types/Element';


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

const ElementContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const ElementCard = styled.div`
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

const ElementTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937 !important;
`;

const ElementInfo = styled.p`
  color: #4b5563 !important; 
  margin: 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280; /* gray-500 */
`;

// Componente principal
const ElementList = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadElements = async () => {
    try {
      const data = await fetchElements();
      const transformedData = data.map((item: any) => ({
        id: item.id || item.element_id,
        name: item.name || item.item_name,
        quantity: item.quantity || item.item_quantity || 0,
      }));
      setElements(transformedData);
    } catch (error) {
      console.error('Error fetching elements:', error);
    } finally {
      setLoading(false);
    }
  };
  loadElements();
}, []);

  if (loading) return <LoadingMessage>Cargando elementos...</LoadingMessage>;

  return (
    <Section>
      <Title>Elementos Disponibles</Title>
      <ElementContainer>
        {elements.map((element) => {
  console.log('Elemento:', element);
  return (
    <ElementCard key={element.id}>
      <ElementTitle>{element.name}</ElementTitle>
      <ElementInfo>
<strong>Cantidad Disponible:</strong> {element.quantity != null ? element.quantity : 'No disponible'}      </ElementInfo>
    </ElementCard>
  );
})}
      </ElementContainer>
    </Section>
  );
};

export default ElementList;
