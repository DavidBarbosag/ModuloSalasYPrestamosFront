// src/pages/ElementList.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchElements } from '../services/api';
import type { RecreativeElement } from '../types/RecreativeElement.ts';

// Props
interface ElementListProps {
  onElementSelect?: (element: RecreativeElement[]) => void;
}

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

const ElementCard = styled.div<{ selected?: boolean }>`
  background-color: ${({ selected }) => (selected ? '#e0f7fa' : 'white')};
  border: ${({ selected }) => (selected ? '2px solid #007bff' : 'none')};
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
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

const ElementList = ({ onElementSelect }: ElementListProps) => {
  const [elements, setElements] = useState<RecreativeElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElements, setSelectedElements] = useState<RecreativeElement[]>([]);

  useEffect(() => {
    const loadElements = async () => {
      try {
        const data = await fetchElements();
        console.log('Datos recibidos de la API:', data);
        interface ApiElement {
          id: number;
          item_name: string;
          item_quantity: number;
        }

        const transformedData: RecreativeElement[] = (data as ApiElement[]).map((item: ApiElement): RecreativeElement => ({
          id: item.id,
          name: item.item_name,
          quantity: item.item_quantity,
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

  const toggleElement = (element: RecreativeElement) => {
    setSelectedElements((prevSelected) => {
      const isSelected = prevSelected.some(e => e.id === element.id);
      const updated = isSelected
        ? prevSelected.filter(e => e.id !== element.id)
        : [...prevSelected, element];
      
      if (onElementSelect) onElementSelect(updated);
      return updated;
    });
  };

  if (loading) return <LoadingMessage>Cargando elementos...</LoadingMessage>;

  return (
    <Section>
      <Title>Elementos Disponibles</Title>
      <ElementContainer>
        {elements.map((element) => (
          <ElementCard
            key={element.id}
            selected={selectedElements.some(e => e.id === element.id)}
            onClick={() => toggleElement(element)}
          >
            <ElementTitle>{element.name}</ElementTitle>
            <ElementInfo>
              <strong>Cantidad Disponible:</strong> {element.quantity}
            </ElementInfo>
          </ElementCard>
        ))}
      </ElementContainer>
    </Section>
  );
};

export default ElementList;