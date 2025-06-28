# 🎮 GameWithスタイルガイド - Fortnite Shop AI

## 📱 UI/UXデザイン原則

### 1. カードデザイン仕様
```tsx
// SkinCard コンポーネントの基本構造
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
  {/* レアリティグラデーション */}
  <div className="h-2 bg-gradient-to-r from-purple-500 to-orange-500"></div>
  
  {/* 画像エリア */}
  <div className="relative aspect-square">
    <img src={skinImage} alt={skinName} />
    {/* 復刻バッジ */}
    {isReturned && (
      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
        復刻！
      </span>
    )}
  </div>
  
  {/* テキストエリア */}
  <div className="p-4">
    <h3 className="font-bold text-lg mb-2">{skinName}</h3>
    <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
    <div className="mt-2 flex justify-between items-center">
      <span className="text-blue-600 font-bold">{price} V-Bucks</span>
      <button className="text-sm text-gray-500">もっと読む</button>
    </div>
  </div>
</div>
```

### 2. グリッドレイアウト
- スマホ: 1カラム
- タブレット: 2カラム
- PC: 3〜4カラム
- 広告カードは2アイテムごとに挿入

### 3. セクション構成
```tsx
// トップページのセクション
<main>
  {/* ヒーローセクション */}
  <section className="bg-gradient-to-b from-blue-900 to-purple-900 text-white py-8">
    <h1 className="text-3xl font-bold text-center">
      {currentDate}のアイテムショップ
    </h1>
  </section>
  
  {/* おすすめスキン */}
  <section className="py-8">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-yellow-500 mr-2">⭐</span>
      今日のおすすめスキン
    </h2>
    <ShopGrid items={recommendedSkins} />
  </section>
  
  {/* 復刻スキン */}
  <section className="py-8 bg-gray-50">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-red-500 mr-2">🔥</span>
      久しぶりの復刻！
    </h2>
    <ShopGrid items={returnedSkins} />
  </section>
  
  {/* 通常ショップ */}
  <section className="py-8">
    <h2 className="text-2xl font-bold mb-4">
      本日のショップ一覧
    </h2>
    <ShopGrid items={allItems} showAds={true} />
  </section>
</main>
```

## 📝 SEO最適化テキスト例

### 1. スキン個別ページのタイトル
```
【{skinName}】は買うべき？評価と入手方法 | Fortnite攻略
```

### 2. メタディスクリプション
```
Fortniteの{skinName}スキンの詳細情報。レアリティ、価格、復刻履歴、プレイヤー評価をチェック。今買うべきかAIが徹底解説！
```

### 3. AI生成プロンプト例
```javascript
const prompt = `
以下のFortniteスキンについて、日本の子供向けに分かりやすい解説文を生成してください：

スキン名: ${skinName}
レアリティ: ${rarity}
価格: ${price} V-Bucks
最終登場: ${lastSeen}

以下の形式で回答してください：
1. スキンの特徴（50文字以内）
2. おすすめ度（★1〜5で評価＋理由）
3. 「買うべき？」の結論（Yes/No＋簡潔な理由）
4. SEO用キーワード（3つ）

注意：
- 小学生でも理解できる言葉を使う
- ゲーム用語は最小限にする
- 親しみやすい口調で
`;
```

## 🎨 カラーパレット
```css
:root {
  /* Fortnite ブランドカラー */
  --fortnite-purple: #7c3aed;
  --fortnite-blue: #2563eb;
  
  /* レアリティカラー */
  --legendary: #fbbf24;  /* 金色 */
  --epic: #a855f7;       /* 紫 */
  --rare: #3b82f6;       /* 青 */
  --uncommon: #10b981;   /* 緑 */
  --common: #6b7280;     /* グレー */
  
  /* UI カラー */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
}
```

## 📊 広告配置ルール

### 1. 広告カードコンポーネント
```tsx
const AdCard = () => (
  <div className="bg-gray-100 rounded-lg p-4 text-center">
    <span className="text-xs text-gray-500">広告</span>
    {/* Google AdSense or 他の広告 */}
    <div className="ad-container mt-2">
      {/* 広告コード */}
    </div>
  </div>
);
```

### 2. 配置ロジック
```tsx
const ShopGrid = ({ items, showAds = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <SkinCard {...item} />
          {/* 2アイテムごとに広告 */}
          {showAds && (index + 1) % 2 === 0 && (
            <AdCard />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
```