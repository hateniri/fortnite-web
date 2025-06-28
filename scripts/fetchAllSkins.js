/**
 * script: fetchAllSkins.js
 * 目的  : 全てのFortniteスキンデータを取得してデータベース化
 * 入力  : Fortnite Cosmetics API
 * 出力  : public/skins_database.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const COSMETICS_API = 'https://fortnite-api.com/v2/cosmetics/br';
const OUTPUT_PATH = path.join(__dirname, '../public/skins_database.json');
const TRANSLATIONS_PATH = path.join(__dirname, '../data/skinTranslations.json');

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

// 日本語翻訳の読み込み
function loadTranslations() {
  try {
    return JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf-8'));
  } catch (error) {
    return {};
  }
}

// スキンデータの処理
function processSkin(skin, translations) {
  const japaneseName = translations[skin.id]?.name || skin.name;
  
  return {
    id: skin.id,
    name: skin.name,
    japaneseName: japaneseName,
    description: skin.description || '',
    type: skin.type?.displayValue || 'アウトフィット',
    rarity: skin.rarity?.value || 'common',
    series: skin.series?.value,
    set: skin.set?.text,
    introduction: skin.introduction ? {
      chapter: skin.introduction.chapter,
      season: skin.introduction.season,
      text: skin.introduction.text
    } : null,
    releaseDate: skin.added,
    images: {
      icon: skin.images?.icon || '',
      featured: skin.images?.featured || skin.images?.icon || '',
      background: skin.images?.background
    },
    shopHistory: skin.shopHistory || [],
    gameplayTags: skin.gameplayTags || [],
    searchTags: [
      japaneseName.toLowerCase(),
      skin.name.toLowerCase(),
      skin.set?.text?.toLowerCase() || '',
      skin.rarity?.value?.toLowerCase() || ''
    ].filter(Boolean)
  };
}

// カテゴリー分け
function categorizeSkinsz(skins) {
  const categories = {
    all: skins,
    byRarity: {},
    bySeries: {},
    bySet: {},
    byChapter: {},
    popular: [],
    recent: [],
    og: []
  };
  
  // レアリティ別
  skins.forEach(skin => {
    const rarity = skin.rarity || 'common';
    if (!categories.byRarity[rarity]) {
      categories.byRarity[rarity] = [];
    }
    categories.byRarity[rarity].push(skin);
  });
  
  // シリーズ別
  skins.forEach(skin => {
    if (skin.series) {
      if (!categories.bySeries[skin.series]) {
        categories.bySeries[skin.series] = [];
      }
      categories.bySeries[skin.series].push(skin);
    }
  });
  
  // セット別
  skins.forEach(skin => {
    if (skin.set) {
      if (!categories.bySet[skin.set]) {
        categories.bySet[skin.set] = [];
      }
      categories.bySet[skin.set].push(skin);
    }
  });
  
  // チャプター別
  skins.forEach(skin => {
    if (skin.introduction?.chapter) {
      const chapter = `Chapter ${skin.introduction.chapter}`;
      if (!categories.byChapter[chapter]) {
        categories.byChapter[chapter] = [];
      }
      categories.byChapter[chapter].push(skin);
    }
  });
  
  // 人気スキン（ショップ履歴が多い順）
  categories.popular = skins
    .filter(skin => skin.shopHistory.length > 10)
    .sort((a, b) => b.shopHistory.length - a.shopHistory.length)
    .slice(0, 50);
  
  // 最近追加されたスキン
  categories.recent = skins
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, 50);
  
  // OGスキン（Chapter 1のスキン）
  categories.og = skins
    .filter(skin => skin.introduction?.chapter === '1')
    .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  
  return categories;
}

// メイン処理
async function fetchAllSkins() {
  console.log('🚀 全スキンデータを取得中...');
  
  try {
    // 1. 化粧品データを取得
    console.log('📦 Cosmetics APIから取得中...');
    const response = await httpsGet(COSMETICS_API);
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch cosmetics data');
    }
    
    // 2. アウトフィット（スキン）のみフィルター
    const allSkins = response.data.filter(item => 
      item.type?.value === 'outfit'
    );
    
    console.log(`📊 ${allSkins.length} 個のスキンを発見`);
    
    // 3. 翻訳データを読み込み
    const translations = loadTranslations();
    
    // 4. 各スキンを処理
    const processedSkins = allSkins.map(skin => 
      processSkin(skin, translations)
    );
    
    // 5. カテゴリー分け
    const categorizedData = categorizeSkinsz(processedSkins);
    
    // 6. 統計情報を追加
    const result = {
      lastUpdate: new Date().toISOString(),
      stats: {
        total: processedSkins.length,
        byRarity: Object.keys(categorizedData.byRarity).map(rarity => ({
          rarity,
          count: categorizedData.byRarity[rarity].length
        })),
        bySeries: Object.keys(categorizedData.bySeries).length,
        bySet: Object.keys(categorizedData.bySet).length,
        popular: categorizedData.popular.length,
        og: categorizedData.og.length
      },
      skins: processedSkins,
      categories: {
        popular: categorizedData.popular.map(s => s.id),
        recent: categorizedData.recent.map(s => s.id),
        og: categorizedData.og.map(s => s.id)
      }
    };
    
    // 7. 保存
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
    console.log('✅ スキンデータベースを保存しました！');
    console.log(`📊 統計:
- 総スキン数: ${result.stats.total}
- レジェンダリー: ${categorizedData.byRarity.legendary?.length || 0}
- エピック: ${categorizedData.byRarity.epic?.length || 0}
- レア: ${categorizedData.byRarity.rare?.length || 0}
- 人気スキン: ${result.stats.popular}
- OGスキン: ${result.stats.og}`);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

if (require.main === module) {
  fetchAllSkins();
}

module.exports = fetchAllSkins;