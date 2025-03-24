export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  service?: string;
  date: string;
  time?: string;
  address?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "upcoming";
  price?: number;
  createdAt: string;
}
