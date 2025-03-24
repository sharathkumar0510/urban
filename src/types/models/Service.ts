export interface Service {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  image?: string;
  category?: string;
  features?: string[];
  duration?: number;
  rating?: number;
  reviewCount?: number;
  locations?: string[];
}
