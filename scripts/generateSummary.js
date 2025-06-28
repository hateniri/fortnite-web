/**
 * script: generateSummary.js
 * 目的  : スキンの日本語解説をローカルで生成（Shadow Official戦略）
 * 入力  : public/shop_complete.json
 * 出力  : public/skins_summary.json
 */

const fs = require('fs');
const path = require('path');

const SHOP_DATA_PATH = path.join(__dirname, '../public/shop_complete.json');
const SUMMARY_PATH = path.join(__dirname, '../public/skins_summary.json');

// レアリティに基づいた解説テンプレート
const rarityDescriptions = {
  legendary: [
    "超レアなレジェンダリースキン！特別感MAXでバトロワでも目立つこと間違いなし 🌟",
    "みんなが欲しがる最高ランクのスキン！持ってるだけで自慢できちゃう ⭐",
    "レジェンド級のかっこよさ！これを着れば気分も最高潮に 🎯"
  ],
  epic: [
    "エピックスキンは見た目も性能も（気分的に）バッチリ！買って損なし 🎨",
    "人気の高いエピックランク！デザインが凝っててお気に入りになること間違いなし 💜",
    "エピックの名に恥じない完成度！これは即買い推奨です 🔥"
  ],
  rare: [
    "レアスキンはコスパ最高！見た目もGOODで初心者にもおすすめ 💙",
    "お手頃価格でクオリティも高い！最初の一着にピッタリ 👍",
    "レア度ちょうどいい！カジュアルに楽しみたい人向け ✨"
  ],
  uncommon: [
    "シンプルイズベスト！派手すぎないのが逆にクール 💚",
    "お財布に優しいアンコモン！でも見た目は全然悪くない 🍀",
    "初心者さんにおすすめ！安くてもしっかりかっこいい 🌿"
  ],
  common: [
    "ベーシックだけど使いやすい！シンプル好きにはたまらない 🤍",
    "入門用にピッタリ！まずはここから始めよう 🌱",
    "コモンでも十分カッコイイ！センス次第で輝きます ⚡"
  ]
};

// セット別の追加説明
const setDescriptions = {
  "Street Fighter": "格ゲーファン必見！ストリートファイターコラボの激レアスキン 🥊",
  "Gaming Legends": "ゲーム界のレジェンドとコラボ！ゲーマーなら絶対欲しい一品 🎮",
  "Marvel": "マーベルヒーロー登場！映画ファンも大満足のクオリティ 🦸",
  "DC": "DCコミックスから参戦！ヒーローorヴィランになりきろう 🦇",
  "Star Wars": "フォースと共にあらんことを！スターウォーズファン必携 ⚔️"
};

// 購入推奨度の判定
function getRecommendation(item) {
  let score = 3; // 基本スコア
  
  // 価格による調整
  if (item.price <= 800) score += 2;
  else if (item.price <= 1200) score += 1;
  else if (item.price >= 2000) score -= 1;
  
  // レアリティによる調整
  const rarity = item.rarity.toLowerCase();
  if (rarity === 'legendary' || rarity === 'gaminglegends') score += 1;
  else if (rarity === 'epic') score += 0.5;
  
  // セットものは人気が高い
  if (item.set) score += 0.5;
  
  return Math.min(5, Math.max(1, Math.round(score)));
}

// 子供向けの楽しい説明を生成
function generateKidFriendlyDescription(item) {
  const rarity = item.rarity.toLowerCase().replace('gaminglegends', 'epic');
  const templates = rarityDescriptions[rarity] || rarityDescriptions.common;
  const baseDesc = templates[Math.floor(Math.random() * templates.length)];
  
  // セット特有の説明を追加
  let additionalDesc = "";
  if (item.set) {
    for (const [key, desc] of Object.entries(setDescriptions)) {
      if (item.set.includes(key)) {
        additionalDesc = " " + desc;
        break;
      }
    }
  }
  
  return baseDesc + additionalDesc;
}

// メイン処理
async function generateSummary() {
  console.log('🎌 日本語解説の生成を開始...');
  
  // shop_complete.jsonの読み込み
  if (!fs.existsSync(SHOP_DATA_PATH)) {
    console.error('❌ shop_complete.json not found.');
    return;
  }
  
  const shopData = JSON.parse(fs.readFileSync(SHOP_DATA_PATH, 'utf-8'));
  const summaries = {};
  
  // すべてのアイテムを処理
  const allItems = [
    ...(shopData.featured || []),
    ...(shopData.daily || []),
    ...(shopData.returned || [])
  ];
  
  for (const item of allItems) {
    const recommendation = getRecommendation(item);
    const shouldBuy = recommendation >= 4;
    
    summaries[item.id] = {
      name: item.name,
      kidFriendlyDesc: generateKidFriendlyDescription(item),
      recommendation: recommendation,
      shouldBuy: shouldBuy,
      buyReason: shouldBuy 
        ? `${item.name}は今が買い時！デザインも価格もバッチリでおすすめです。`
        : `V-Bucksに余裕があるなら検討してみて。他のスキンと比べてから決めよう。`,
      targetAudience: [
        recommendation >= 4 ? "コレクター向け" : null,
        item.price <= 1200 ? "初心者向け" : null,
        item.set ? "ファン向け" : null,
        item.rarity.includes('legend') ? "ベテラン向け" : null
      ].filter(Boolean)
    };
  }
  
  // 結果を保存
  const output = {
    generated: new Date().toISOString(),
    totalItems: allItems.length,
    summaries: summaries
  };
  
  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(output, null, 2));
  console.log(`✅ 日本語解説を生成しました: ${allItems.length} アイテム`);
  console.log(`📝 保存先: ${SUMMARY_PATH}`);
}

// 実行
if (require.main === module) {
  generateSummary().catch(console.error);
}

module.exports = generateSummary;