export interface User {
  id: number;
  name: string;
  email: string;
  identification: string;
}

export interface BorrowedElement {
  id: number;
  amount: number;
  element_details: {
    element: number;
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