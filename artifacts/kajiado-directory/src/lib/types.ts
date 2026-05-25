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
}
