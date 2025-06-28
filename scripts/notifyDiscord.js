/**
 * script: notifyDiscord.js
 * 目的  : Discord WebhookへFortniteショップ情報を通知
 * 入力  : shop_complete.json, skins_summary.json
 * 出力  : Discord Webhook通知
 */

const fs = require('fs').promises;
const path = require('path');

// Discord Webhook URLを環境変数から取得
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function loadShopData() {
  try {
    const shopPath = path.join(__dirname, '..', 'public', 'shop_complete.json');
    const summaryPath = path.join(__dirname, '..', 'public', 'skins_summary.json');
    
    const shopData = JSON.parse(await fs.readFile(shopPath, 'utf-8'));
    const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf-8'));
    
    return { shopData, summaryData };
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    return null;
  }
}

function getJapaneseName(id, defaultName) {
  // 翻訳データを読み込む（簡易版）
  const translations = {
    'CID_A_024_Athena_Commando_F_Skirmish_QW2BQ': 'チュンリー',
    'CID_A_023_Athena_Commando_M_Skirmish_W1N7H': 'リュウ',
    // 他の翻訳もここに追加
  };
  return translations[id] || defaultName;
}

function createEmbed(shopData, summaryData) {
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 新登場スキンを検出
  const newSkins = [];
  const returnedSkins = [];
  
  const allItems = [
    ...(shopData.featured || []),
    ...(shopData.daily || []),
    ...(shopData.special || [])
  ];

  allItems.forEach(item => {
    if (item.type === 'Outfit') {
      const japaneseName = getJapaneseName(item.id, item.name);
      const summary = summaryData?.summaries?.[item.id];
      
      if (!item.shopHistory || item.shopHistory.length === 1) {
        newSkins.push({
          name: japaneseName,
          price: item.price,
          rarity: item.rarity,
          desc: summary?.kidFriendlyDesc || ''
        });
      } else if (item.daysGone && item.daysGone > 30) {
        returnedSkins.push({
          name: japaneseName,
          price: item.price,
          daysGone: item.daysGone,
          desc: summary?.kidFriendlyDesc || ''
        });
      }
    }
  });

  const embed = {
    title: `🌟 ${currentDate}のアイテムショップ 🌟`,
    description: `今日は${shopData.stats.totalItems}個のアイテムが登場！`,
    color: 0x9B59B6, // 紫色
    fields: [],
    footer: {
      text: 'フォートナイト ショップ図鑑 | 毎日午前5時更新'
    },
    timestamp: new Date().toISOString()
  };

  // 新登場スキン
  if (newSkins.length > 0) {
    embed.fields.push({
      name: '🎉 新登場スキン',
      value: newSkins.slice(0, 5).map(skin => 
        `**${skin.name}** (${skin.price} V-Bucks)\n└ ${skin.desc || skin.rarity}`
      ).join('\n\n'),
      inline: false
    });
  }

  // 復刻スキン
  if (returnedSkins.length > 0) {
    embed.fields.push({
      name: '🎆 復刻スキン（レア！）',
      value: returnedSkins.slice(0, 5).map(skin => 
        `**${skin.name}** (${skin.daysGone}日ぶり！)\n└ ${skin.desc || `${skin.price} V-Bucks`}`
      ).join('\n\n'),
      inline: false
    });
  }

  // 統計情報
  embed.fields.push({
    name: '📊 本日の統計',
    value: [
      `総アイテム数: ${shopData.stats.totalItems}`,
      `平均価格: ${shopData.stats.averagePrice} V-Bucks`,
      `新登場: ${newSkins.length}個`,
      `復刻: ${returnedSkins.length}個`
    ].join('\n'),
    inline: true
  });

  // サイトへのリンク
  embed.fields.push({
    name: '🔗 詳細はこちら',
    value: '[フォートナイト ショップ図鑑を見る](https://fortnite-web-eta.vercel.app/)',
    inline: true
  });

  return embed;
}

async function sendDiscordNotification(embed) {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URLが設定されていません');
    return false;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'フォートナイト ショップ図鑑',
        avatar_url: 'https://fortnite-api.com/images/cosmetics/br/cid_028_athena_commando_f/icon.png',
        embeds: [embed]
      })
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    console.log('✅ Discord通知を送信しました！');
    return true;
  } catch (error) {
    console.error('Discord通知の送信に失敗しました:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Discord通知処理を開始します...');
  
  const data = await loadShopData();
  if (!data) {
    console.error('データの読み込みに失敗しました');
    process.exit(1);
  }

  const embed = createEmbed(data.shopData, data.summaryData);
  const success = await sendDiscordNotification(embed);
  
  if (success) {
    console.log('✅ 処理が完了しました！');
  } else {
    console.error('❌ 処理が失敗しました');
    process.exit(1);
  }
}

// 直接実行された場合のみ実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createEmbed, sendDiscordNotification };