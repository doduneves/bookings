export interface BookingItem {
  bookingId: string;
  hotelId: number;
  eventId: number;
  guestName: string;
  guestPhoneNumber: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomingListItem {
  roomingListId: string;
  eventId: number;
  hotelId: number;
  rfpName: string;
  cutOffDate: string;
  status: string;
  agreement_type: string;
  createdAt: string;
  updatedAt: string;
  bookings: BookingItem[];
}

export interface EventData {
  id: number;
  name: string;
  roomingLists: RoomingListItem[];
}
