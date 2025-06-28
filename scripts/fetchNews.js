/**
 * script: fetchNews.js
 * 目的  : Fortnite公式ニュースを取得
 * 入力  : Fortnite-API.com News endpoint
 * 出力  : public/news.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const NEWS_API = 'https://fortnite-api.com/v2/news';
const OUTPUT_PATH = path.join(__dirname, '../public/news.json');

// ニュースの取得
async function fetchNews() {
  console.log('📰 Fortniteニュースを取得中...');
  
  return new Promise((resolve, reject) => {
    https.get(NEWS_API, {
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
          const newsData = JSON.parse(data);
          
          if (newsData.status === 200 && newsData.data) {
            // バトルロイヤルニュースを処理
            const brNews = newsData.data.br?.motds || [];
            const stwNews = newsData.data.stw?.messages || [];
            const creativeNews = newsData.data.creative?.motds || [];
            
            const processedNews = {
              lastUpdate: new Date().toISOString(),
              br: brNews.map(news => ({
                id: news.id,
                title: news.title || '',
                titleJa: news.title, // 後で翻訳
                body: news.body || '',
                bodyJa: news.body, // 後で翻訳
                image: news.image || '',
                tileImage: news.tileImage || '',
                sortingPriority: news.sortingPriority || 0,
                hidden: news.hidden || false
              })),
              stw: stwNews.map(news => ({
                title: news.title || '',
                body: news.body || '',
                image: news.image || '',
                spotlight: news.spotlight || false
              })),
              creative: creativeNews.map(news => ({
                id: news.id,
                title: news.title || '',
                body: news.body || '',
                image: news.image || '',
                tileImage: news.tileImage || ''
              }))
            };
            
            // 優先度でソート（高い順）
            processedNews.br.sort((a, b) => b.sortingPriority - a.sortingPriority);
            
            // 非表示のニュースを除外
            processedNews.br = processedNews.br.filter(news => !news.hidden);
            
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processedNews, null, 2));
            console.log('✅ ニュースデータを保存しました');
            console.log(`📊 BR: ${processedNews.br.length}件, STW: ${processedNews.stw.length}件, Creative: ${processedNews.creative.length}件`);
            
            resolve(processedNews);
          } else {
            reject(new Error('Failed to fetch news'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// 実行
if (require.main === module) {
  fetchNews().catch(console.error);
}

module.exports = { fetchNews };