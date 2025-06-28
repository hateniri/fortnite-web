// サーバーサイドでショップデータを読み込むユーティリティ
import fs from 'fs';
import path from 'path';
import { ProcessedShopData, ProcessedItem } from './types/shop';

export async function getShopData(): Promise<ProcessedShopData | null> {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'shop_processed.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error('Shop data not found. Please run npm run fetch-shop first.');
      return null;
    }
    
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data) as ProcessedShopData;
  } catch (error) {
    console.error('Error loading shop data:', error);
    return null;
  }
}

export async function getItemById(id: string): Promise<ProcessedItem | null> {
  const shopData = await getShopData();
  if (!shopData) return null;
  
  const allItems = [
    ...shopData.featured,
    ...shopData.daily,
    ...shopData.special,
    ...shopData.returned
  ];
  
  return allItems.find(item => item.id === id) || null;
}

// モックデータ（開発用）
export function getMockShopData(): ProcessedShopData {
  return {
    date: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    featured: [
      {
        id: 'CID_028_Athena_Commando_F',
        name: 'レネゲードレイダー',
        description: 'Fortniteの歴史に名を刻む伝説のOGスキン。',
        rarity: 'rare',
        price: 1200,
        imageUrl: '/api/placeholder/512/512',
        isReturned: true,
        daysGone: 2555,
        shopHistory: ['2017-10-29'],
        type: 'Outfit',
      },
      {
        id: 'CID_029_Athena_Commando_F_Halloween',
        name: 'スカルトルーパー',
        description: 'ハロウィン限定のホラースキン。',
        rarity: 'epic',
        price: 1500,
        imageUrl: '/api/placeholder/512/512',
        isReturned: false,
        shopHistory: ['2023-10-31'],
        type: 'Outfit',
      }
    ],
    daily: [
      {
        id: 'CID_096_Athena_Commando_F_Founder',
        name: 'ブライトボンバー',
        description: 'カラフルでポップなデザインが特徴の人気スキン。',
        rarity: 'uncommon',
        price: 800,
        imageUrl: '/api/placeholder/512/512',
        isReturned: false,
        shopHistory: ['2024-06-25'],
        type: 'Outfit',
      }
    ],
    special: [],
    returned: []
  };
}