/**
 * script: fetchSkinImages.js
 * 目的  : Fortniteスキン画像の取得・保存
 * 入力  : shop.json
 * 出力  : public/images/skins/内の画像ファイル
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOP_JSON_PATH = path.join(__dirname, '../public/shop.json');
const IMAGES_DIR = path.join(__dirname, '../public/images/skins');

// 画像保存ディレクトリの作成
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

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
      fs.unlink(filepath, () => {}); // 失敗時はファイル削除
      reject(err);
    });
  });
}

async function fetchSkinImages() {
  console.log('Starting skin image fetching...');
  
  // shop.jsonの読み込み
  if (!fs.existsSync(SHOP_JSON_PATH)) {
    console.error('shop.json not found. Please run fetchShop.js first.');
    return;
  }
  
  const shopData = JSON.parse(fs.readFileSync(SHOP_JSON_PATH, 'utf-8'));
  let downloadCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  // shop.jsonの構造に合わせて処理
  const allEntries = shopData.entries || [];
  
  for (const entry of allEntries) {
    for (const item of entry.items || []) {
      const cosmetic = item;
      const id = cosmetic.id;
      
      if (!id || !cosmetic.images) continue;
      
      // icon画像の処理
      if (cosmetic.images.icon) {
        const iconFilename = `${id}_icon.png`;
        const iconPath = path.join(IMAGES_DIR, iconFilename);
        
        if (!fs.existsSync(iconPath)) {
          try {
            console.log(`Downloading icon: ${iconFilename}`);
            await downloadImage(cosmetic.images.icon, iconPath);
            downloadCount++;
          } catch (error) {
            console.error(`Error downloading ${iconFilename}:`, error.message);
            errorCount++;
          }
        } else {
          skipCount++;
        }
      }
      
      // featured画像の処理（存在する場合）
      if (cosmetic.images.featured) {
        const featuredFilename = `${id}_featured.png`;
        const featuredPath = path.join(IMAGES_DIR, featuredFilename);
        
        if (!fs.existsSync(featuredPath)) {
          try {
            console.log(`Downloading featured: ${featuredFilename}`);
            await downloadImage(cosmetic.images.featured, featuredPath);
            downloadCount++;
          } catch (error) {
            console.error(`Error downloading ${featuredFilename}:`, error.message);
            errorCount++;
          }
        } else {
          skipCount++;
        }
      }
    }
  }
  
  console.log('\n=== Fetch Complete ===');
  console.log(`Downloaded: ${downloadCount} images`);
  console.log(`Skipped (already exists): ${skipCount} images`);
  console.log(`Errors: ${errorCount}`);
}

if (require.main === module) {
  fetchSkinImages().catch(console.error);
}

module.exports = fetchSkinImages;