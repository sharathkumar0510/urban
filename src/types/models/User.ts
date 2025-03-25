export interface User {
  id: string;
  email: string;
  fullName?: string;
  full_name?: string;
  avatarUrl?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  zip_code?: string;
  role?: "customer" | "vendor" | "admin";
  created_at: string;
  updated_at?: string;
  user_id?: string;
  token_identifier?: string;
}

export interface VendorProfile {
  id: string;
  businessName?: string;
  business_name?: string;
  businessDescription?: string;
  business_description?: string;
  businessLogo?: string;
  business_logo?: string;
  businessWebsite?: string;
  business_website?: string;
  businessEmail?: string;
  business_email?: string;
  businessPhone?: string;
  business_phone?: string;
  businessAddress?: string;
  business_address?: string;
  businessCity?: string;
  business_city?: string;
  businessState?: string;
  business_state?: string;
  businessZipCode?: string;
  business_zip_code?: string;
  taxId?: string;
  tax_id?: string;
  isVerified?: boolean;
  is_verified?: boolean;
  avgRating?: number;
  avg_rating?: number;
  totalReviews?: number;
  total_reviews?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}
