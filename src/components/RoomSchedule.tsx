// src/components/RoomSchedule.tsx
import React from 'react';
import type {Room} from '../types/Room.ts';

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HOURS = ["7:00-8:30", "8:30-10:00", "10:00-11:30", "11:30-13:00", "13:00-14:30", "14:30-16:00", "16:00-17:30", "17:30-19:00"];

interface RoomScheduleProps {
  room: Room;
}

const RoomSchedule: React.FC<RoomScheduleProps> = ({ room }) => {
  return (
    <div>
      <h3>Disponibilidad</h3>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            {DAYS.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour, hourIdx) => (
            <tr key={hour}>
              <td>{hour}</td>
              {DAYS.map((day, dayIdx) => (
                <td key={`${hour}-${day}`}>
                  {room.availability[hourIdx][dayIdx] === 0 ? '✅' : '❌'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomSchedule;