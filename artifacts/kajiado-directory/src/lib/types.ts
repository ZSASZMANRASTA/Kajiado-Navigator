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
}

export interface SubmitShopPayload {
  town_id: string;
  name: string;
  description: string;
  category: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
}
