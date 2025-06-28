/**
 * script: fetchShop.js
 * 目的  : Fortnite JSON取得
 * 入力  : APIエンドポイント
 * 出力  : public/shop.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_ENDPOINT = 'https://fortnite-api.com/v2/shop';
const OUTPUT_PATH = path.join(__dirname, '../public/shop.json');

function fetchShop() {
  console.log('Fetching Fortnite shop data...');
  
  https.get(API_ENDPOINT, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const shopData = JSON.parse(data);
        
        if (shopData.status === 200) {
          fs.writeFileSync(OUTPUT_PATH, JSON.stringify(shopData.data, null, 2));
          console.log('Shop data saved successfully to public/shop.json');
        } else {
          console.error('API returned error status:', shopData.status);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching shop data:', err);
  });
}

if (require.main === module) {
  fetchShop();
}

module.exports = fetchShop;