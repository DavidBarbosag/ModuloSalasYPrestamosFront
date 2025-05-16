// src/components/RoomSchedule.tsx
import React from 'react';
import styled from 'styled-components';
import type { Room } from '../types/Room';

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HOURS = ["7:00-8:30", "8:30-10:00", "10:00-11:30", "11:30-13:00",
               "13:00-14:30", "14:30-16:00", "16:00-17:30", "17:30-19:00"];

// Styled components with smaller dimensions
const ScheduleContainer = styled.div`
  margin: 0.5rem 0;
`;

const ScheduleTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #343a40;
  font-size: 1rem;
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
`;

const TableHeader = styled.th`
  padding: 0.3rem;
  text-align: center;
  border: 1px solid #dee2e6;
  background-color: #e9ecef;
  font-weight: bold;
`;

const TimeLabel = styled.td`
  padding: 0.3rem;
  border: 1px solid #dee2e6;
  background-color: #e9ecef;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
`;

const AvailabilityCell = styled.td<{ available: boolean }>`
  padding: 0.3rem;
  border: 1px solid #dee2e6;
  text-align: center;
  background-color: ${({ available }) => (available ? '#d4edda' : '#f8d7da')};
  color: ${({ available }) => (available ? '#155724' : '#721c24')};
  font-size: 0.7rem;
`;

interface RoomScheduleProps {
  room: Room;
}

const RoomSchedule: React.FC<RoomScheduleProps> = ({ room }) => {
  return (
    <ScheduleContainer>
      <ScheduleTitle>Disponibilidad</ScheduleTitle>
      <ScheduleTable>
        <thead>
          <tr>
            <TableHeader>Hora</TableHeader>
            {DAYS.map((day) => (
              <TableHeader key={day}>{day}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour, hourIdx) => (
            <tr key={hour}>
              <TimeLabel>{hour}</TimeLabel>
              {DAYS.map((day, dayIdx) => {
                const isAvailable = room.availability[hourIdx][dayIdx] === 0;
                return (
                  <AvailabilityCell
                    key={`${hour}-${day}`}
                    available={isAvailable}
                  >
                    {isAvailable ? '✓' : '✗'}
                  </AvailabilityCell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};

export default RoomSchedule;