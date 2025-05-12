export interface BorrowedElement {
  element: number;
  amount: number;
  element_details: {
    id: number;
    name: string;
  };
}

export interface Reservation {
  id: number;
  location: string;
  state: string;
  reserved_day: string;
  reserved_hour_block: string;
  user: number;
  room : number;
  borrowed_elements: BorrowedElement[];
}