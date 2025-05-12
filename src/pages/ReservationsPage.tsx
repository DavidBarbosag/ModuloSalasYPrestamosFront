import { useState } from 'react';
import { searchReservations } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  Button, Typography, CircularProgress
} from '@mui/material';

interface BorrowedElement {
  element: number;
  amount: number;
  element_details: {
    id: number;
    name: string;
  };
}

interface Reservation {
  id: number;
  location: string;
  state: string;
  reserved_day: string;
  reserved_hour_block: string;
  user: number;
  room : number;
  borrowed_elements: BorrowedElement[];
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Ingresa un nombre o código de reserva');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await searchReservations(searchQuery);
      setReservations(data);
    } catch (err) {
      setError('Error al buscar reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Buscar Reservas
      </Typography>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>        <TextField
          label="Nombre o Código de Reserva"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Buscar
        </Button>
      </div>

      {reservations.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Código</strong></TableCell>
                <TableCell><strong>Usuario</strong></TableCell>
                <TableCell><strong>Id Sala</strong></TableCell>
                <TableCell><strong>Ubicación de la sala</strong></TableCell>
                <TableCell><strong>Día</strong></TableCell>
                <TableCell><strong>Horario</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Elementos prestados</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.id}</TableCell>
                  <TableCell>{reservation.user}</TableCell>
                  <TableCell>{reservation.room}</TableCell>
                  <TableCell>{reservation.location}</TableCell>
                  <TableCell>{reservation.reserved_day}</TableCell>
                  <TableCell>{reservation.reserved_hour_block}</TableCell>
                  <TableCell>{reservation.state}</TableCell>
                  <TableCell>
                    {reservation.borrowed_elements.length > 0 ? (
                      <ul>
                        {reservation.borrowed_elements.map((element, index) => (
                          <li key={index}>
                            {element.element_details.name} (Cantidad: {element.amount})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2">No hay elementos prestados</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && (
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: '24px' }}>
            {searchQuery ? "No se encontraron reservas" : "Ingresa un criterio de búsqueda"}
          </Typography>
        )
      )}
    </div>
  );
};

export default ReservationsPage;