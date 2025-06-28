/**
 * script: fetchShop.js
 * 目的  : Fortnite Shop API から最新データを取得
 * 入力  : https://fortnite-api.com/v2/shop
 * 出力  : public/shop.json, public/shop_processed.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_ENDPOINT = 'https://fortnite-api.com/v2/shop';
const OUTPUT_DIR = path.join(__dirname, '../public');
const SHOP_RAW_PATH = path.join(OUTPUT_DIR, 'shop.json');
const SHOP_PROCESSED_PATH = path.join(OUTPUT_DIR, 'shop_processed.json');
const SHOP_HISTORY_PATH = path.join(OUTPUT_DIR, 'shop_history.json');

// 出力ディレクトリの作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ショップ履歴の読み込み
function loadShopHistory() {
  if (fs.existsSync(SHOP_HISTORY_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(SHOP_HISTORY_PATH, 'utf-8'));
    } catch (error) {
      console.error('Error loading shop history:', error);
      return {};
    }
  }
  return {};
}

// ショップ履歴の保存
function saveShopHistory(history) {
  fs.writeFileSync(SHOP_HISTORY_PATH, JSON.stringify(history, null, 2));
}

// レアリティの正規化
function normalizeRarity(rarity) {
  if (!rarity) return 'common';
  
  const value = rarity.value?.toLowerCase() || rarity.toLowerCase();
  const mapping = {
    'legendary': 'legendary',
    'epic': 'epic',
    'rare': 'rare',
    'uncommon': 'uncommon',
    'common': 'common',
    'icon': 'legendary',
    'gaming': 'gaminglegends',
    'gaminglegends': 'gaminglegends',
    'marvel': 'marvel',
    'dc': 'dc',
    'starwars': 'starwars',
    'frozen': 'frozen',
    'lava': 'lava',
    'shadow': 'shadow',
    'slurp': 'slurp',
    'dark': 'dark'
  };
  
  return mapping[value] || 'epic';
}

// 日数計算
function daysSince(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// アイテムの処理
function processItem(entry, history) {
  const processedItems = [];
  
  // 新API構造: brItems を使用、古いAPI構造との互換性も保持
  const items = entry.brItems || entry.items;
  
  // アイテムが存在しない場合はスキップ
  if (!items || items.length === 0) {
    // newDisplayAssetPathがある場合は単体アイテムとして処理
    if (entry.newDisplayAssetPath && entry.layoutId && !entry.layoutId.includes('JT')) {
      // 単体アイテムの処理（将来的な実装用）
    }
    return processedItems;
  }
  
  for (const item of items) {
    // スキン（Outfit）のみを対象とする
    if (item.type?.backendValue !== 'AthenaCharacter') continue;
    
    const id = item.id;
    const lastSeen = history[id]?.lastSeen;
    const daysGone = daysSince(lastSeen);
    const isReturned = daysGone && daysGone > 30; // 30日以上経過で復刻扱い
    
    // 履歴更新
    if (!history[id]) {
      history[id] = {
        firstSeen: new Date().toISOString(),
        shopHistory: []
      };
    }
    history[id].lastSeen = new Date().toISOString();
    history[id].shopHistory.push(new Date().toISOString().split('T')[0]);
    
    const processedItem = {
      id: id,
      name: item.name || 'Unknown',
      description: item.description || '',
      rarity: normalizeRarity(item.rarity),
      price: entry.finalPrice || 0,
      imageUrl: item.images?.featured || item.images?.icon || '',
      lastSeen: lastSeen,
      isReturned: isReturned,
      daysGone: daysGone,
      shopHistory: history[id].shopHistory.slice(-10), // 最新10回分
      type: item.type?.displayValue || 'Outfit',
      set: item.set?.text,
      series: item.series?.value
    };
    
    processedItems.push(processedItem);
  }
  
  return processedItems;
}

// ショップデータの処理
function processShopData(rawData) {
  const history = loadShopHistory();
  const allItems = [];
  
  // すべてのエントリを処理
  for (const entry of rawData.entries || []) {
    const items = processItem(entry, history);
    allItems.push(...items);
  }
  
  // カテゴリ分け
  const featured = allItems.filter(item => item.price >= 1500);
  const daily = allItems.filter(item => item.price < 1500 && item.price > 0);
  const special = allItems.filter(item => item.series);
  const returned = allItems.filter(item => item.isReturned);
  
  // 履歴保存
  saveShopHistory(history);
  
  return {
    date: rawData.date,
    lastUpdate: new Date().toISOString(),
    featured: featured.slice(0, 8), // 最大8個
    daily: daily.slice(0, 12), // 最大12個
    special: special.slice(0, 6), // 最大6個
    returned: returned.sort((a, b) => (b.daysGone || 0) - (a.daysGone || 0)).slice(0, 6), // 最も古い復刻6個
    stats: {
      totalItems: allItems.length,
      returnedCount: returned.length,
      averagePrice: Math.round(allItems.reduce((sum, item) => sum + item.price, 0) / allItems.length)
    }
  };
}

// メイン処理
function fetchShop() {
  console.log('🚀 Fetching Fortnite shop data...');
  
  https.get(API_ENDPOINT, { 
    headers: {
      'User-Agent': 'FortniteShopTracker/1.0'
    }
  }, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const shopData = JSON.parse(data);
        
        if (shopData.status === 200 && shopData.data) {
          // 生データを保存
          fs.writeFileSync(SHOP_RAW_PATH, JSON.stringify(shopData.data, null, 2));
          console.log('✅ Raw shop data saved to public/shop.json');
          
          // 処理済みデータを生成・保存
          const processedData = processShopData(shopData.data);
          fs.writeFileSync(SHOP_PROCESSED_PATH, JSON.stringify(processedData, null, 2));
          console.log('✅ Processed shop data saved to public/shop_processed.json');
          
          // 統計情報を表示
          console.log('\n📊 Shop Statistics:');
          console.log(`- Total items: ${processedData.stats.totalItems}`);
          console.log(`- Returned items: ${processedData.stats.returnedCount}`);
          console.log(`- Average price: ${processedData.stats.averagePrice} V-Bucks`);
          
          if (processedData.returned.length > 0) {
            console.log('\n🔥 Notable returns:');
            processedData.returned.slice(0, 3).forEach(item => {
              console.log(`  - ${item.name}: ${item.daysGone} days since last seen`);
            });
          }
        } else {
          console.error('❌ API returned error:', shopData.status, shopData.error);
        }
      } catch (error) {
        console.error('❌ Error processing shop data:', error);
      }
    });
  }).on('error', (err) => {
    console.error('❌ Error fetching shop data:', err);
  });
}

// 実行
if (require.main === module) {
  fetchShop();
}

module.exports = { fetchShop, processShopData };