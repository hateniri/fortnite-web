export interface ShopCompleteItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  price: number;
  imageUrl: string;
  introduction?: {
    chapter: string;
    season: string;
    text: string;
  };
  set?: string;
  added: string;
  shopHistory: string[];
}

export interface ShopCompleteData {
  date: string;
  lastUpdate: string;
  stats: {
    totalItems: number;
    featured: number;
    daily: number;
    returned: number;
  };
  featured: ShopCompleteItem[];
  daily: ShopCompleteItem[];
  returned: ShopCompleteItem[];
}

export async function getShopCompleteData(): Promise<ShopCompleteData | null> {
  try {
    const response = await fetch('/shop_complete.json');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading shop data:', error);
    return null;
  }
}

export async function getItemById(id: string): Promise<ShopCompleteItem | null> {
  const data = await getShopCompleteData();
  if (!data) return null;
  
  const allItems = [...data.featured, ...data.daily, ...data.returned];
  return allItems.find(item => item.id === id) || null;
}