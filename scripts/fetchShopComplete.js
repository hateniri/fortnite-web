/**
 * script: fetchShopComplete.js
 * 目的  : Fortnite Shop API から最新データを取得（新API構造対応）
 * 入力  : https://fortnite-api.com/v2/shop
 * 出力  : public/shop_complete.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_ENDPOINT = 'https://fortnite-api.com/v2/shop';
const OUTPUT_DIR = path.join(__dirname, '../public');
const SHOP_COMPLETE_PATH = path.join(OUTPUT_DIR, 'shop_complete.json');

// 出力ディレクトリの作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

// アイテムの処理
function processItem(entry) {
  const processedItems = [];
  
  // brItemsが存在しない場合はスキップ
  if (!entry.brItems || entry.brItems.length === 0) {
    return processedItems;
  }
  
  for (const item of entry.brItems) {
    // 除外するアイテムタイプ（バンドルやカレンシーなど）
    const excludeTypes = ['AthenaBundle', 'Currency'];
    if (excludeTypes.includes(item.type?.backendValue)) continue;
    
    // アイテムタイプの日本語名
    const getItemTypeName = (backendValue) => {
      const typeMapping = {
        'AthenaCharacter': 'スキン',
        'AthenaPickaxe': 'つるはし',
        'AthenaGlider': 'グライダー',
        'AthenaBackpack': 'バックアクセサリー',
        'AthenaDance': 'エモート',
        'AthenaLoadingScreen': 'ロード画面',
        'AthenaSkyDiveContrail': 'スカイダイビングトレイル',
        'AthenaSpray': 'スプレー',
        'AthenaToy': 'おもちゃ',
        'AthenaWrap': 'ラップ',
        'AthenaMusicPack': 'ミュージック',
        'AthenaPet': 'ペット',
        'AthenaConsumableEmote': 'エモート',
        'AthenaBattleBus': 'バトルバス'
      };
      return typeMapping[backendValue] || 'アイテム';
    };

    const processedItem = {
      id: item.id,
      name: item.name || 'Unknown',
      description: item.description || '',
      rarity: normalizeRarity(item.rarity),
      price: entry.finalPrice || 0,
      imageUrl: item.images?.featured || item.images?.icon || '',
      introduction: item.introduction || null,
      set: item.set?.text || null,
      added: item.added || null,
      shopHistory: item.shopHistory || [],
      type: getItemTypeName(item.type?.backendValue),
      backendType: item.type?.backendValue
    };
    
    processedItems.push(processedItem);
  }
  
  return processedItems;
}

// ショップデータの処理
function processShopData(rawData) {
  const allItems = [];
  
  // すべてのエントリを処理
  for (const entry of rawData.entries || []) {
    const items = processItem(entry);
    allItems.push(...items);
  }
  
  // 重複を除去（同じIDのアイテムが複数エントリにある場合）
  const uniqueItems = [];
  const seenIds = new Set();
  
  for (const item of allItems) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueItems.push(item);
    }
  }
  
  // カテゴリ分け
  const featured = uniqueItems.filter(item => item.price >= 1500);
  const daily = uniqueItems.filter(item => item.price < 1500 && item.price > 0);
  const returned = uniqueItems.filter(item => {
    if (!item.shopHistory || item.shopHistory.length < 2) return false;
    const lastDate = new Date(item.shopHistory[item.shopHistory.length - 2]);
    const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
    return daysSince > 30;
  });
  
  return {
    date: rawData.date,
    lastUpdate: new Date().toISOString(),
    stats: {
      totalItems: uniqueItems.length,
      featured: featured.length,
      daily: daily.length,
      returned: returned.length
    },
    featured: featured,
    daily: daily,
    returned: returned
  };
}

// メイン処理
function fetchShop() {
  console.log('🚀 Fetching complete Fortnite shop data...');
  
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
          // 処理済みデータを生成・保存
          const processedData = processShopData(shopData.data);
          fs.writeFileSync(SHOP_COMPLETE_PATH, JSON.stringify(processedData, null, 2));
          console.log('✅ Complete shop data saved to public/shop_complete.json');
          
          // 統計情報を表示
          console.log('\n📊 Shop Statistics:');
          console.log(`- Total items: ${processedData.stats.totalItems}`);
          console.log(`- Featured items: ${processedData.stats.featured}`);
          console.log(`- Daily items: ${processedData.stats.daily}`);
          console.log(`- Returned items: ${processedData.stats.returned}`);
          
          // サンプル表示
          console.log('\n🎮 Sample items:');
          processedData.featured.slice(0, 3).forEach(item => {
            console.log(`  - ${item.name} (${item.rarity}): ${item.price} V-Bucks`);
          });
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