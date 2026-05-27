import { Town, Shop, Product } from "./types";

export const TOWNS: Town[] = [
  { id: "kitengela", name: "Kitengela", latitude: -1.4753, longitude: 36.961, shop_count: 5 },
  { id: "kajiado-town", name: "Kajiado Town", latitude: -1.8522, longitude: 36.796, shop_count: 0 },
  { id: "rongai", name: "Rongai", latitude: -1.3964, longitude: 36.4535, shop_count: 3 },
  { id: "ngong", name: "Ngong", latitude: -1.3659, longitude: 36.6589, shop_count: 0 },
  { id: "namanga", name: "Namanga", latitude: -2.5536, longitude: 36.7962, shop_count: 0 },
];

export const SHOPS: Shop[] = [
  {
    id: "kit-1", town_id: "kitengela", name: "Savanna Supermarket",
    description: "Your one-stop shop for fresh groceries, household goods, and local produce in the heart of Kitengela.",
    category: "Grocery", image_url: null, is_premium: true,
    phone: "+254 712 345 678", whatsapp: "+254712345678", hours: "Mon–Sat 7am–9pm, Sun 8am–7pm",
  },
  {
    id: "kit-2", town_id: "kitengela", name: "Maasai Craft Gallery",
    description: "Authentic handcrafted beadwork, leather goods, and traditional Maasai jewellery sourced directly from local artisans.",
    category: "Crafts & Art", image_url: null, is_premium: true,
    phone: "+254 723 456 789", whatsapp: "+254723456789", hours: "Daily 9am–6pm",
  },
  {
    id: "kit-3", town_id: "kitengela", name: "Plains Hardware & Steel",
    description: "Construction materials, roofing sheets, plumbing supplies, and power tools for builders across Kajiado County.",
    category: "Hardware", image_url: null, is_premium: false,
    phone: "+254 734 567 890", hours: "Mon–Sat 7:30am–6pm",
  },
  {
    id: "kit-4", town_id: "kitengela", name: "Acacia Mobile Hub",
    description: "Mobile phones, accessories, repairs, and mobile money services. Authorised dealer for major Kenyan networks.",
    category: "Electronics", image_url: null, is_premium: false,
    phone: "+254 745 678 901", whatsapp: "+254745678901", hours: "Mon–Sat 8am–8pm, Sun 10am–6pm",
  },
  {
    id: "kit-5", town_id: "kitengela", name: "The Ochre Kitchen",
    description: "A warm family restaurant serving Nyama Choma, ugali, and seasonal local dishes. Known for the best pilau in town.",
    category: "Restaurant", image_url: null, is_premium: true,
    phone: "+254 756 789 012", whatsapp: "+254756789012", hours: "Daily 11am–10pm",
  },
  {
    id: "ron-1", town_id: "rongai", name: "Rongai Fresh Market",
    description: "Daily fresh vegetables, fruits, and farm produce delivered straight from smallholder farms in the surrounding area.",
    category: "Grocery", image_url: null, is_premium: false,
    phone: "+254 767 890 123", hours: "Daily 6am–7pm",
  },
  {
    id: "ron-2", town_id: "rongai", name: "Oloolua Pharmacy",
    description: "Licensed pharmaceutical store offering prescription medicines, wellness products, and free blood pressure checks.",
    category: "Health & Pharmacy", image_url: null, is_premium: true,
    phone: "+254 778 901 234", whatsapp: "+254778901234", hours: "Mon–Sat 8am–8pm, Sun 9am–5pm",
  },
  {
    id: "ron-3", town_id: "rongai", name: "Shepherd's Inn & Lounge",
    description: "Comfortable accommodation, conference facilities, and a full-service bar overlooking the Ngong Hills.",
    category: "Hospitality", image_url: null, is_premium: true,
    phone: "+254 789 012 345", whatsapp: "+254789012345", hours: "Open 24 hours",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p-1", name: "Unga (Maize Flour) 2kg",
    description: "Premium white maize flour. Stone-ground, bulk sourced from certified millers. Perfect for ugali and baking.",
    price: 190, unit: "2 kg bag", category: "Dry Goods", in_stock: true, badge: "Best Seller",
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-2", name: "Cooking Oil 5L",
    description: "Pure sunflower cooking oil. Sourced directly from processors — light, healthy, and ideal for deep frying.",
    price: 1050, unit: "5 litre jerrican", category: "Oils & Fats", in_stock: true, badge: "Wholesale Price",
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-3", name: "Sugar 2kg",
    description: "White refined sugar. Directly sourced from a leading Kenyan manufacturer. Ideal for tea, cooking, and resale.",
    price: 280, unit: "2 kg bag", category: "Dry Goods", in_stock: true,
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-4", name: "Bar Soap (Packed 6s)",
    description: "Multi-purpose laundry and bath soap bars. Bulk-packed directly from manufacturer. Great for household and resale.",
    price: 360, unit: "pack of 6 bars", category: "Household", in_stock: true, badge: "Bulk Deal",
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-5", name: "Maasai Beaded Bracelet",
    description: "Handwoven traditional beaded bracelet. Sourced from Maasai artisans in Kajiado. Each piece is unique.",
    price: 450, unit: "per piece", category: "Crafts", in_stock: true, badge: "Authentic",
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-6", name: "Tomatoes (Crate)",
    description: "Fresh grade-A tomatoes sourced weekly from Loitoktok smallholder farms. Best prices in Kitengela.",
    price: 1800, unit: "full crate (~30 kg)", category: "Fresh Produce", in_stock: true,
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-7", name: "Black Pepper 100g",
    description: "Whole black pepper corns. Sourced from coastal spice traders. Aromatic, fresh, and full-flavoured.",
    price: 120, unit: "100 g packet", category: "Spices", in_stock: true,
    whatsapp_order: "+254712345678",
  },
  {
    id: "p-8", name: "Plastic Buckets (10L)",
    description: "Heavy-duty coloured plastic buckets. Sourced in bulk from Nairobi manufacturers. Ideal for home and business.",
    price: 250, unit: "per bucket", category: "Household", in_stock: false, badge: "Out of Stock",
    whatsapp_order: "+254712345678",
  },
];

export const PRODUCT_CATEGORIES = [
  "All",
  "Dry Goods",
  "Oils & Fats",
  "Fresh Produce",
  "Household",
  "Crafts",
  "Spices",
];

export const ALL_CATEGORIES = [
  "Grocery", "Crafts & Art", "Hardware", "Electronics",
  "Restaurant", "Health & Pharmacy", "Hospitality",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Grocery: "bg-acacia/10 text-acacia border-acacia/30",
  "Crafts & Art": "bg-ochre/10 text-ochre border-ochre/30",
  Hardware: "bg-gray-100 text-gray-600 border-gray-200",
  Electronics: "bg-blue-50 text-blue-600 border-blue-200",
  Restaurant: "bg-orange-50 text-orange-600 border-orange-200",
  "Health & Pharmacy": "bg-green-50 text-green-700 border-green-200",
  Hospitality: "bg-purple-50 text-purple-600 border-purple-200",
};

export const CATEGORY_ACCENT: Record<string, string> = {
  Grocery: "#4F7942",
  "Crafts & Art": "#C36F48",
  Hardware: "#6b7280",
  Electronics: "#3b82f6",
  Restaurant: "#f97316",
  "Health & Pharmacy": "#16a34a",
  Hospitality: "#9333ea",
};
