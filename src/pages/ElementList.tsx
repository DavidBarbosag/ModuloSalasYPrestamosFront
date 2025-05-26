// src/pages/ElementList.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchElements } from '../services/api';
import type { RecreativeElement } from '../types/RecreativeElement';

// Estilos (se mantienen igual)
const Section = styled.section`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #343a40;
`;

const ElementsTable = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  background-color: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ElementName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const ElementQuantity = styled.div`
  text-align: right;
  color: #4b5563;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  margin-top: 1rem;
`;

const ElementList = () => {
  const [elements, setElements] = useState<RecreativeElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadElements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchElements();
        
        // Transformación de datos según la estructura esperada
        const transformedElements = data.map((item: any) => ({
          id: item.id || item.element,
          name: item.item_name || item.label,
          quantity: item.item_quantity || item.quantity
        }));
        
        setElements(transformedElements);
      } catch (err) {
        console.error('Error fetching elements:', err);
        setError('Error al cargar los elementos. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadElements();
  }, []);

  if (loading) return <LoadingMessage>Cargando elementos...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Section>
      <Title>Elementos Recreativos</Title>
      <ElementsTable>
        <TableHeader>
          <ElementName>Nombre</ElementName>
          <ElementQuantity>Cantidad</ElementQuantity>
        </TableHeader>
        {elements.length > 0 ? (
          elements.map((element) => (
            <TableRow key={element.id}>
              <ElementName>{element.name}</ElementName>
              <ElementQuantity>{element.quantity}</ElementQuantity>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <ElementName style={{ gridColumn: '1 / span 2', textAlign: 'center', width: '100%' }}>
              No hay elementos disponibles
            </ElementName>
          </TableRow>
        )}
      </ElementsTable>
    </Section>
  );
};

export default ElementList;