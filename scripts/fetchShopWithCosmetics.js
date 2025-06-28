/**
 * script: fetchShopWithCosmetics.js
 * 目的  : ショップデータと化粧品データを組み合わせて完全なデータを生成
 * 入力  : Fortnite Shop API + Cosmetics API
 * 出力  : public/shop_complete.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOP_API = 'https://fortnite-api.com/v2/shop';
const COSMETICS_API = 'https://fortnite-api.com/v2/cosmetics/br';
const OUTPUT_PATH = path.join(__dirname, '../public/shop_complete.json');

// HTTPSリクエストのプロミス化
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: {
        'User-Agent': 'FortniteShopTracker/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchCompleteShopData() {
  console.log('🚀 Fetching complete shop data...');
  
  try {
    // 1. ショップデータを取得
    console.log('📦 Fetching shop data...');
    const shopResponse = await httpsGet(SHOP_API);
    
    if (shopResponse.status !== 200) {
      throw new Error('Failed to fetch shop data');
    }
    
    // 2. 化粧品データを取得
    console.log('🎨 Fetching cosmetics data...');
    const cosmeticsResponse = await httpsGet(COSMETICS_API);
    
    if (cosmeticsResponse.status !== 200) {
      throw new Error('Failed to fetch cosmetics data');
    }
    
    // 3. 化粧品データをIDでインデックス化
    const cosmeticsMap = new Map();
    cosmeticsResponse.data.forEach(item => {
      cosmeticsMap.set(item.id, item);
    });
    
    // 4. ショップデータを処理
    const processedItems = [];
    let totalCount = 0;
    
    for (const entry of shopResponse.data.entries) {
      // 各エントリーのアイテムIDを抽出
      let itemIds = [];
      
      if (entry.newDisplayAssetPath) {
        // シングルアイテム
        const match = entry.newDisplayAssetPath.match(/DAv2_(.+?)$/);
        if (match) {
          itemIds.push(match[1]);
        }
      }
      
      if (entry.items) {
        // マルチアイテム
        itemIds = itemIds.concat(entry.items.map(item => item.id));
      }
      
      // 各アイテムの詳細情報を取得
      for (const itemId of itemIds) {
        const cosmetic = cosmeticsMap.get(itemId);
        if (!cosmetic || cosmetic.type.value !== 'outfit') continue;
        
        totalCount++;
        
        processedItems.push({
          id: cosmetic.id,
          name: cosmetic.name,
          description: cosmetic.description,
          rarity: cosmetic.rarity.value,
          price: entry.finalPrice || 0,
          imageUrl: cosmetic.images.featured || cosmetic.images.icon || '',
          introduction: cosmetic.introduction ? {
            chapter: cosmetic.introduction.chapter,
            season: cosmetic.introduction.season,
            text: cosmetic.introduction.text
          } : null,
          set: cosmetic.set?.text,
          added: cosmetic.added,
          shopHistory: cosmetic.shopHistory || []
        });
      }
    }
    
    // 5. カテゴリ分け
    const featured = processedItems.filter(item => item.price >= 1500);
    const daily = processedItems.filter(item => item.price < 1500);
    const returned = processedItems.filter(item => {
      if (!item.shopHistory || item.shopHistory.length < 2) return false;
      const lastDate = new Date(item.shopHistory[item.shopHistory.length - 2]);
      const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 30;
    });
    
    const result = {
      date: shopResponse.data.date,
      lastUpdate: new Date().toISOString(),
      stats: {
        totalItems: totalCount,
        featured: featured.length,
        daily: daily.length,
        returned: returned.length
      },
      featured: featured.slice(0, 8),
      daily: daily.slice(0, 12),
      returned: returned.slice(0, 6)
    };
    
    // 6. 保存
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
    console.log('✅ Complete shop data saved!');
    console.log(`📊 Stats: ${totalCount} total, ${featured.length} featured, ${daily.length} daily, ${returned.length} returned`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  fetchCompleteShopData();
}

module.exports = fetchCompleteShopData;