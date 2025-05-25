import { useState, useEffect } from 'react';
import { getAllReservations, getReservationById } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  Button, Typography, CircularProgress, Box,
  Alert, Tabs, Tab
} from '@mui/material';

import type { Reservation } from '../types/Reservation';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const fetchAllReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar todas las reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationById = async () => {
    if (!searchId.trim()) {
      setError('Ingresa un ID de reserva');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const reservation = await getReservationById(Number(searchId));
      setReservations(reservation ? [reservation] : []);
    } catch (err) {
      setError('Error al buscar la reserva');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchId('');
    setError('');
    setReservations([]);
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchAllReservations();
    }
  }, [activeTab]);

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Reservas
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Todas las reservas" />
          <Tab label="Buscar por ID" />
        </Tabs>
      </Box>

      {activeTab === 1 && (
        <Box sx={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          <TextField
            label="ID de Reserva"
            variant="outlined"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
            type="number"
            inputProps={{ min: 1 }}
          />

          <Button
            variant="contained"
            onClick={fetchReservationById}
            disabled={loading || !searchId.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ height: '56px' }}
          >
            Buscar
          </Button>
        </Box>
      )}

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
                <TableCell><strong>ID</strong></TableCell>
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
            {activeTab === 0 ? 'No hay reservas registradas' : 
             searchId ? 'No se encontró la reserva' : 'Ingresa un ID de reserva'}
          </Typography>
        )
      )}
    </div>
  );
};

export default ReservationsPage;