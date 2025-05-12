export interface Room {
  id: number;
  location: string;
  capacity: number;
  description: string;
  availability: number[][];
}

export interface RoomAvailability {
  day: string;
  hours: {
    block: string;
    isAvailable: boolean;
  }[];
}