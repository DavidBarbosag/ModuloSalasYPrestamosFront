import React from 'react';
import styled from 'styled-components';

// Styled components
const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const TableHeader = styled.th`
  padding: 0.3rem;
  text-align: center;
  border: 1px solid #dee2e6;
  background-color: #e9ecef;
  font-weight: bold;
  white-space: nowrap;
  min-width: 50px;
`;

const TimeSlotCell = styled.td<{ selected: boolean; available: boolean }>`
  padding: 0.2rem;
  border: 1px solid #dee2e6;
  text-align: center;
  background-color: ${({ selected, available }) =>
    selected ? '#28a745' : available ? '#ffffff' : '#f8d7da'};
  color: ${({ selected, available }) =>
    selected ? 'white' : available ? '#495057' : '#721c24'};
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  transition: all 0.2s;
  font-size: 0.7rem;
  min-width: 50px;
  height: 30px;

  &:hover {
    background-color: ${({ selected, available }) =>
    selected ? '#28a745' : available ? '#e9ecef' : '#f8d7da'};
  }

  @media (max-width: 768px) {
    padding: 0.1rem;
    font-size: 0.6rem;
  }
`;

const TimeLabel = styled.td`
  padding: 0.3rem;
  border: 1px solid #dee2e6;
  background-color: #e9ecef;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  font-size: 0.8rem;
  min-width: 80px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    min-width: 70px;
  }
`;

interface ScheduleTableProps {
    selectedSlot: { day: string; hour: string } | null;
    onSlotSelect: (day: string, hour: string) => void;
}

const ScheduleSelection: React.FC<ScheduleTableProps> = ({
                                                             selectedSlot,
                                                             onSlotSelect,
                                                         }) => {
    const VALID_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const VALID_HOURS = [
        '7:00-8:30',
        '8:30-10:00',
        '10:00-11:30',
        '11:30-13:00',
        '13:00-14:30',
        '14:30-16:00',
        '16:00-17:30',
        '17:30-19:00',
    ];

    return (
        <ScheduleTable>
            <thead>
            <tr>
                <TableHeader>Hora</TableHeader>
                {VALID_DAYS.map(day => (
                    <TableHeader key={day}>{day}</TableHeader>
                ))}
            </tr>
            </thead>
            <tbody>
            {VALID_HOURS.map((hour, hourIndex) => (
                <tr key={`hour-${hourIndex}`}>
                    <TimeLabel>{hour}</TimeLabel>
                    {VALID_DAYS.map((day, dayIndex) => (
                        <TimeSlotCell
                            key={`${day}-${hour}-${dayIndex}`}
                            selected={selectedSlot?.day === day && selectedSlot?.hour === hour}
                            available={true}
                            onClick={() => onSlotSelect(day, hour)}
                        >
                            {selectedSlot?.day === day && selectedSlot?.hour === hour ? '✓' : ''}
                        </TimeSlotCell>
                    ))}
                </tr>
            ))}
            </tbody>
        </ScheduleTable>
    );
};

export default ScheduleSelection;