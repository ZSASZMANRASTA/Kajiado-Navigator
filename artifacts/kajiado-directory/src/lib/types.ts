export interface Town {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  shop_count: number;
}

export interface Shop {
  id: string;
  town_id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  is_premium: boolean;
  phone?: string | null;
  whatsapp?: string | null;
  hours?: string | null;
  tagline?: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image_url: string | null;
  in_stock: boolean;
  badge?: string | null;
  whatsapp_order?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  town: string;
  type: "Full-time" | "Part-time" | "Contract" | "Casual";
  salary?: string;
  description: string;
  requirements: string[];
  posted_days_ago: number;
  whatsapp: string;
  category: string;
}
