import { useState, useEffect } from 'react';
import { getReservationBysUserId } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  Button, Typography, CircularProgress, Box,
  Alert
} from '@mui/material';
import type { Reservation } from '../types/Reservation';

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReservationsByUserId = async () => {
    if (!userId.trim()) {
      setError('Ingresa un ID de usuario');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userReservations = await getReservationBysUserId(Number(userId));
      setReservations(Array.isArray(userReservations) ? userReservations : []);
    } catch (err) {
      setError('Error al buscar las reservas del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Reservas por Usuario
      </Typography>

      <Box sx={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <TextField
          label="ID de Usuario"
          variant="outlined"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
        />

        <Button
          variant="contained"
          onClick={fetchReservationsByUserId}
          disabled={loading || !userId.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ height: '56px' }}
        >
          Buscar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : reservations.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID Reserva</strong></TableCell>
                <TableCell><strong>Usuario</strong></TableCell>
                <TableCell><strong>Sala</strong></TableCell>
                <TableCell><strong>Ubicación</strong></TableCell>
                <TableCell><strong>Día</strong></TableCell>
                <TableCell><strong>Horario</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Elementos</strong></TableCell>
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
                  <TableCell>
                    <span style={{
                      color: reservation.state === 'activa' ? 'green' : 
                            reservation.state === 'cancelada' ? 'red' : 'gray',
                      fontWeight: 'bold'
                    }}>
                      {reservation.state}
                    </span>
                  </TableCell>
                  <TableCell>
                    {reservation.borrowed_elements?.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {reservation.borrowed_elements.map((element, index) => (
                          <li key={index}>
                            {element.element_details?.name} (x{element.amount})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Ninguno
                      </Typography>
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
            {userId ? 'No se encontraron reservas para este usuario' : 'Ingresa un ID de usuario para buscar'}
          </Typography>
        )
      )}
    </div>
  );
};

export default UserReservationsPage;