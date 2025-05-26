import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getReservationById, createRegister } from '../services/api';

type Register = {
    register_id?: number;
    reservation_id?: number;
    returned_elements?: Array<{
        codigo: string;
        nombre: string;
        estado: string;
        cantidad: number;
    }>;
};

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 0.5rem;
`;

const RegisterPage = () => {
    const [registers, setRegisters] = useState<Register[]>([]);
    const [identifier, setIdentifier] = useState('');
    const [reservationId, setReservationId] = useState<number | null>(null);
    const [returnedElements, setReturnedElements] = useState<Register['returned_elements']>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRegisters = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/register/');
            setRegisters(response.data);
        } catch (err) {
            setError('Error al cargar los registros');
        } finally {
            setLoading(false);
        }
    };

    const fetchReservationById = async () => {
        if (!identifier.trim()) {
            setError('Ingresa un ID de reserva');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const reservation = await getReservationById(Number(identifier));
            console.log('Reserva obtenida:', reservation);

            if (reservation) {
                setReservationId(reservation.id);

                // Mapear elementos con valores por defecto para evitar undefined
                const elements = (reservation.borrowed_elements || []).map((item: any) => ({
                    codigo: item.element_details?.code ?? 'N/A',
                    nombre: item.element_details?.item_name ?? 'Desconocido',
                    estado: 'RETURNED_GOOD',
                    cantidad: item.quantity ?? 1,
                }));

                setReturnedElements(elements);

                setRegisters(prev => [
                    ...prev,
                    {
                        register_id: -1, // ID temporal
                        reservation_id: reservation.id,
                        returned_elements: elements,
                    }
                ]);
            } else {
                setError('No se encontró la reserva con el ID proporcionado');
            }
        } catch (err) {
            setError('Error al buscar la reserva');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reservationId || !returnedElements || returnedElements.length === 0) {
            setError('Faltan datos para crear el registro');
            return;
        }

        try {
            setLoading(true);
            await createRegister({
                reservation_id: reservationId,
                returned_elements: returnedElements,
            });
            setError('');
            fetchRegisters();
        } catch (err) {
            setError('Error al crear el registro');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisters();
    }, []);

    return (
        <Container>
            <Title>Gestión de Registros</Title>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleCreate}>
                <Input
                    type="text"
                    placeholder="Buscar reserva por id de reserva o id de usuario"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />
                <Button type="button" onClick={fetchReservationById} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </Button>

                <Table>
                    <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>ID de Reserva</Th>
                        <Th>Elementos Devueltos</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {registers.map((register, idx) => (
                        <tr key={idx}>
                            <Td>{register.register_id !== -1 ? register.register_id : ''}</Td>
                            <Td>{register.reservation_id ?? 'N/A'}</Td>
                            <Td>
                                {register.returned_elements?.length
                                    ? register.returned_elements.map(el => `${el.nombre} (${el.cantidad})`).join(', ')
                                    : 'N/A'}
                            </Td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Registro'}
                </Button>
            </Form>
        </Container>
    );
};

export default RegisterPage;