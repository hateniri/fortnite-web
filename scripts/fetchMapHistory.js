/**
 * script: fetchMapHistory.js
 * 目的  : 過去のマップ履歴を管理（サンプル実装）
 * 出力  : public/map_history.json
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../public/map_history.json');

// 過去マップのサンプルデータ
function generateMapHistory() {
  return {
    lastUpdate: new Date().toISOString(),
    maps: [
      {
        id: 'chapter6-season3',
        name: 'チャプター6 シーズン3: SUPER',
        date: '2025-06-01',
        image: '/images/map.png',
        description: '現在のマップ。スーパーヒーローテーマで新しいPOIが追加された。',
        featured: ['プレザント・パーク', 'ティルテッド・タワーズ', 'ミスティ・メドウズ'],
        isCurrent: true
      },
      {
        id: 'chapter6-season2',
        name: 'チャプター6 シーズン2',
        date: '2025-03-01',
        image: '/images/maps/chapter6-season2.png',
        description: '前シーズンのマップ。冬のテーマで雪に覆われた地域があった。',
        featured: ['アイシー・アイル', 'フローズン・フィールド', 'スノー・サンクチュアリ'],
        isCurrent: false
      },
      {
        id: 'chapter6-season1',
        name: 'チャプター6 シーズン1',
        date: '2024-12-01',
        image: '/images/maps/chapter6-season1.png',
        description: '新チャプターの始まり。全く新しい島で冒険が始まった。',
        featured: ['ニュー・タウン', 'フレッシュ・フィールド', 'ビギナーズ・ベイ'],
        isCurrent: false
      }
    ],
    stats: {
      totalMaps: 3,
      currentChapter: 6,
      currentSeason: 3
    }
  };
}

// メイン処理
function generateMapHistoryData() {
  console.log('🗺️ マップ履歴データを生成中...');
  
  try {
    const historyData = generateMapHistory();
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(historyData, null, 2));
    
    console.log('✅ マップ履歴データを保存しました');
    console.log(`📊 統計:`);
    console.log(`- 総マップ数: ${historyData.stats.totalMaps}`);
    console.log(`- 現在: チャプター${historyData.stats.currentChapter} シーズン${historyData.stats.currentSeason}`);
    
  } catch (error) {
    console.error('❌ マップ履歴データ生成エラー:', error.message);
  }
}

// 実行
if (require.main === module) {
  generateMapHistoryData();
}

module.exports = { generateMapHistoryData };