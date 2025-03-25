export interface Booking {
  id: string;
  userId: string;
  user_id?: string;
  serviceId: string;
  service_id?: string;
  vendorId: string;
  vendor_id?: string;
  service?: string;
  date: string;
  time?: string;
  scheduledDate?: string;
  scheduled_date?: string;
  scheduledTime?: string;
  scheduled_time?: string;
  duration?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  zip_code?: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "upcoming"
    | "in_progress";
  price?: number;
  specialInstructions?: string;
  special_instructions?: string;
  createdAt: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  vendor?: {
    businessName?: string;
    business_name?: string;
    businessLogo?: string;
    business_logo?: string;
  };
}
