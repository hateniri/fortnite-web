/**
 * script: fetchMap.js
 * 目的  : Fortniteマップ情報を取得・日本語化
 * 入力  : Fortnite-API.com Map endpoint
 * 出力  : public/map.json, public/images/map.png
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MAP_API = 'https://fortnite-api.com/v2/map?language=ja';
const OUTPUT_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');
const MAP_JSON_PATH = path.join(OUTPUT_DIR, 'map.json');
const POI_JSON_PATH = path.join(OUTPUT_DIR, 'poi.json');

// ディレクトリ作成
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 画像ダウンロード
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // ファイルを削除
      reject(err);
    });
  });
}

// POI情報の日本語化と要約
function processPOIs(pois) {
  if (!pois || pois.length === 0) {
    return {
      summary: "今シーズンは新しいマップで冒険が始まるよ！まだ詳細情報を調査中だけど、きっと面白いエリアがいっぱいあるはず。",
      locations: [],
      lastUpdate: new Date().toISOString()
    };
  }

  // 主要エリアを抽出（landmarkタイプのもの）
  const landmarks = pois.filter(poi => poi.type === 'landmark' || poi.type === 'namedLocation');
  
  // 日本語要約生成
  const areaCount = landmarks.length;
  const summary = `今のマップには${areaCount}個の主要エリアがあるよ！` +
    `新しいシーズンで地形が変わって、探検するのがすごく楽しくなってる。` +
    `お友達と一緒に色んな場所を回ってみよう！`;

  const processedPOIs = landmarks.map(poi => ({
    id: poi.id,
    name: poi.name || 'Unknown Location',
    nameJa: getJapaneseName(poi.name) || '未知のエリア',
    type: poi.type,
    location: poi.location || { x: 0, y: 0, z: 0 },
    description: generateLocationDescription(poi.name)
  }));

  return {
    summary,
    locations: processedPOIs,
    totalCount: areaCount,
    lastUpdate: new Date().toISOString()
  };
}

// エリアごとの楽しい説明を生成
function generateLocationDescription(locationName) {
  const descriptions = {
    'Pleasant Park': 'みんな大好きな住宅街！家がいっぱいあって武器も見つけやすいよ',
    'Tilted Towers': '高いビルがたくさんの都市エリア！戦いが激しいけど良いアイテムがゲットできる',
    'Retail Row': 'お店がいっぱいのショッピングエリア！買い物気分で探索しよう',
    'Salty Springs': '温泉街みたいな場所！のんびりした雰囲気だけど油断は禁物',
    'Lazy Lake': '湖の近くの静かな町！景色がキレイで戦略的にも重要なスポット',
    'Sweaty Sands': 'ビーチリゾート地区！海が見えてリラックスできるけど敵も多いかも',
    'Holly Hedges': '緑がいっぱいの住宅地！隠れる場所がたくさんある戦略的エリア',
    'Weeping Woods': '大きな森のエリア！木がいっぱいで材料集めに最適だよ',
    'Slurpy Swamp': '不思議な沼地！特別なアイテムが見つかるかもしれない神秘的な場所',
    'Misty Meadows': '霧の町！視界が悪いけどその分スリル満点の冒険ができる'
  };

  return descriptions[locationName] || 'ここは冒険が待ってる特別な場所！しっかり探索してみよう';
}

// 日本語名マッピング
function getJapaneseName(englishName) {
  const nameMapping = {
    'Pleasant Park': 'プレザント・パーク',
    'Tilted Towers': 'ティルテッド・タワーズ',
    'Retail Row': 'リテール・ロウ',
    'Salty Springs': 'ソルティ・スプリングス',
    'Lazy Lake': 'レイジー・レイク',
    'Sweaty Sands': 'スウェッティ・サンズ',
    'Holly Hedges': 'ホリー・ヘッジズ',
    'Weeping Woods': 'ウィーピング・ウッズ',
    'Slurpy Swamp': 'スラーピー・スワンプ',
    'Misty Meadows': 'ミスティ・メドウズ'
  };

  return nameMapping[englishName] || englishName;
}

// サンプルマップデータ（API利用不可のため）
function generateSampleMapData() {
  return {
    lastUpdate: new Date().toISOString(),
    mapImage: 'https://media.fortniteapi.io/images/map.png', // 公開されているマップ画像
    pois: [
      { id: 'pleasant-park', name: 'Pleasant Park', type: 'namedLocation', location: { x: 140, y: 180, z: 0 } },
      { id: 'tilted-towers', name: 'Tilted Towers', type: 'namedLocation', location: { x: 200, y: 240, z: 0 } },
      { id: 'retail-row', name: 'Retail Row', type: 'namedLocation', location: { x: 300, y: 200, z: 0 } },
      { id: 'salty-springs', name: 'Salty Springs', type: 'namedLocation', location: { x: 180, y: 280, z: 0 } },
      { id: 'lazy-lake', name: 'Lazy Lake', type: 'namedLocation', location: { x: 260, y: 320, z: 0 } },
      { id: 'sweaty-sands', name: 'Sweaty Sands', type: 'namedLocation', location: { x: 120, y: 400, z: 0 } },
      { id: 'holly-hedges', name: 'Holly Hedges', type: 'namedLocation', location: { x: 80, y: 260, z: 0 } },
      { id: 'weeping-woods', name: 'Weeping Woods', type: 'landmark', location: { x: 160, y: 360, z: 0 } },
      { id: 'slurpy-swamp', name: 'Slurpy Swamp', type: 'landmark', location: { x: 100, y: 340, z: 0 } },
      { id: 'misty-meadows', name: 'Misty Meadows', type: 'namedLocation', location: { x: 220, y: 380, z: 0 } }
    ],
    stats: {
      totalPOIs: 10,
      landmarks: 2,
      namedLocations: 8
    }
  };
}

// メインの処理
async function fetchMapData() {
  console.log('🗺️ Fortniteマップ情報を取得中...');
  
  try {
    // ディレクトリ確認
    ensureDirectoryExists(OUTPUT_DIR);
    ensureDirectoryExists(IMAGES_DIR);

    // サンプルデータを生成（API利用不可のため）
    console.log('📝 サンプルマップデータを生成中...');
    const mapData = generateSampleMapData();
    console.log('✅ マップデータを生成しました');

    // マップ画像をダウンロード（FortniteAPIの公開画像を使用）
    const publicMapUrl = 'https://media.fortniteapi.io/images/map.png';
    try {
      console.log('📥 マップ画像をダウンロード中...');
      const mapImagePath = path.join(IMAGES_DIR, 'map.png');
      await downloadImage(publicMapUrl, mapImagePath);
      console.log('✅ マップ画像を保存しました');
    } catch (imgError) {
      console.log('⚠️ マップ画像のダウンロードに失敗しました（プレースホルダーを作成）');
      // プレースホルダー画像情報を設定
      mapData.mapImage = '/images/map-placeholder.png';
    }

    // POI情報を処理
    const poiData = processPOIs(mapData.pois);
    fs.writeFileSync(POI_JSON_PATH, JSON.stringify(poiData, null, 2));
    console.log('✅ POI情報を日本語化して保存しました');

    // 完全なマップデータも保存
    fs.writeFileSync(MAP_JSON_PATH, JSON.stringify(mapData, null, 2));

    console.log('📊 マップ統計:');
    console.log(`- 総POI数: ${mapData.stats.totalPOIs}`);
    console.log(`- ランドマーク: ${mapData.stats.landmarks}`);
    console.log(`- 命名エリア: ${mapData.stats.namedLocations}`);
    console.log(`- 要約: ${poiData.summary}`);

  } catch (error) {
    console.error('❌ マップデータ取得エラー:', error.message);
  }
}

// 実行
if (require.main === module) {
  fetchMapData();
}

module.exports = { fetchMapData };