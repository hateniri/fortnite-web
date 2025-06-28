/**
 * script: fetchSkinImages.js
 * 目的  : Fortniteスキン画像の取得・WebP変換・保存
 * 入力  : public/shop_processed.json
 * 出力  : public/images/skins/内の.webp画像ファイル
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SHOP_DATA_PATH = path.join(__dirname, '../public/shop_complete.json');
const IMAGES_DIR = path.join(__dirname, '../public/images/skins');
const TEMP_DIR = path.join(__dirname, '../temp');

// ディレクトリの作成
[IMAGES_DIR, TEMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 画像ダウンロード
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// WebP変換
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .resize(512, 512, { 
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(outputPath);
    
    // 元ファイルを削除
    fs.unlinkSync(inputPath);
    return true;
  } catch (error) {
    console.error(`Error converting to WebP: ${error.message}`);
    return false;
  }
}

// ファイルサイズの取得（KB）
function getFileSizeInKB(filepath) {
  const stats = fs.statSync(filepath);
  return (stats.size / 1024).toFixed(2);
}

// メイン処理
async function fetchSkinImages() {
  console.log('🖼️ Starting skin image fetching and conversion...');
  
  // shop_complete.jsonの読み込み
  if (!fs.existsSync(SHOP_DATA_PATH)) {
    console.error('❌ shop_complete.json not found. Please run fetchShopWithCosmetics.js first.');
    return;
  }
  
  const shopData = JSON.parse(fs.readFileSync(SHOP_DATA_PATH, 'utf-8'));
  let downloadCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let totalSizeKB = 0;
  
  // すべてのアイテムを収集
  const allItems = [
    ...(shopData.featured || []),
    ...(shopData.daily || []),
    ...(shopData.returned || [])
  ];
  
  // 重複を除去
  const uniqueItems = Array.from(
    new Map(allItems.map(item => [item.id, item])).values()
  );
  
  console.log(`📊 Processing ${uniqueItems.length} unique items...`);
  
  for (const item of uniqueItems) {
    if (!item.imageUrl) continue;
    
    const webpFilename = `${item.id}.webp`;
    const webpPath = path.join(IMAGES_DIR, webpFilename);
    
    // すでに存在する場合はスキップ
    if (fs.existsSync(webpPath)) {
      skipCount++;
      totalSizeKB += parseFloat(getFileSizeInKB(webpPath));
      continue;
    }
    
    try {
      // 一時ファイルにダウンロード
      const tempFilename = `${item.id}_temp.png`;
      const tempPath = path.join(TEMP_DIR, tempFilename);
      
      console.log(`⬇️ Downloading: ${item.name} (${item.id})`);
      await downloadImage(item.imageUrl, tempPath);
      
      // WebPに変換（Shadow Official戦略: 品質80%で高速表示優先）
      console.log(`🔄 Converting to WebP: ${item.name}`);
      const converted = await convertToWebP(tempPath, webpPath, 80);
      
      if (converted) {
        downloadCount++;
        const sizeKB = getFileSizeInKB(webpPath);
        totalSizeKB += parseFloat(sizeKB);
        console.log(`✅ Saved: ${webpFilename} (${sizeKB} KB)`);
      } else {
        errorCount++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${item.name}:`, error.message);
      errorCount++;
    }
  }
  
  // 一時ディレクトリをクリーンアップ
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch (error) {
    // エラーは無視
  }
  
  console.log('\n=== Image Fetch Complete ===');
  console.log(`✅ Downloaded & Converted: ${downloadCount} images`);
  console.log(`⏭️ Skipped (already exists): ${skipCount} images`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`💾 Total size: ${(totalSizeKB / 1024).toFixed(2)} MB`);
  console.log(`📊 Average size: ${(totalSizeKB / (downloadCount + skipCount)).toFixed(2)} KB per image`);
  
  // 画像最適化の推奨事項
  if (totalSizeKB / (downloadCount + skipCount) > 100) {
    console.log('\n💡 Optimization tip: Consider reducing quality to 65-70% for faster mobile loading');
  }
}

// スタンドアロン実行
if (require.main === module) {
  fetchSkinImages().catch(console.error);
}

module.exports = fetchSkinImages;