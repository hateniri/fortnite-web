# 📋 Fortnite Shop AI 日本語解説サイト - 実装計画

## 🎯 プロジェクト概要
Fortniteの公式アイテムショップ情報を毎日取得し、AIで日本語解説を自動生成する静的Webサイト

## 🏗️ 技術スタック
- **フレームワーク**: Next.js (SSG)
- **スタイリング**: Tailwind CSS
- **AI**: Claude API / OpenAI API
- **ホスティング**: GitHub Pages
- **自動化**: GitHub Actions

## 🎮 GameWithスタイルを参考にしたサイト設計指針

### 1. ページ構造
- トップページに「おすすめスキン」「今日のショップ」「復刻されたスキン」などを一覧表示
- スキン個別ページ（`/skins/<slug>`）を用意し、詳細な日本語解説を掲載（Claude自動生成）
- タグ別（スターウォーズ、夏スキンなど）にも分類可能な構造にする（拡張予定）

### 2. UI設計（スマホ最適化＋GameWithスタイル）
- カード表示中心（スキン画像＋名前＋説明＋復刻バッジ）
- テキストは3行以内、必要に応じて「もっと読む」展開可
- Tailwindで `line-clamp`, `bg-gradient`, `hover` 等を活用

### 3. 見出しとSEO
- 見出し（h2, h3）は「◯月◯日 アイテムショップ一覧」「このスキンは買うべき？」など検索意図に対応
- Claudeには、各セクションタイトル・解説文を「SEOを意識した日本語にしてください」と伝えること

### 4. 広告位置と自然さ
- GameWith同様、記事本文内に自然に広告ブロックを挿入
- 例：2スキンごとに1つ広告カード（クラス名 `ad-card`）

### 5. リッチコンテンツ化（将来的に）
- 評価グラフ（星評価、使用率）、コメント欄、人気順などを導入予定

## 📝 Issue管理計画

### Issue #2: Next.js/SSGフレームワーク構築
**目的**: 静的サイト生成環境の構築（GameWithスタイル）
- Next.js 14のセットアップ（App Router）
- Tailwind CSS導入（line-clamp、gradient等の設定）
- スマホ対応レスポンシブデザイン
- 基本コンポーネント作成（SkinCard、AdCard等）
- スキン個別ページ（動的ルート）の実装

### Issue #3: Fortnite API データ取得実装
**目的**: ショップデータの自動取得
- `fetchShop.js` スクリプト作成
- API: https://fortnite-api.com/v2/shop/br/combined
- データ整形・保存処理
- 前日比較による復刻検出

### Issue #4: AI統合 - 日本語解説生成
**目的**: Claude/GPT APIで自動解説生成（SEO最適化）
- `generateSummary.js` スクリプト作成
- プロンプトエンジニアリング（子供向け＋SEO意識）
- 各スキンの「買うべき？」判定生成
- バッチ処理最適化
- エラーハンドリング

### Issue #5: GitHub Actions ワークフロー
**目的**: 毎日の自動更新
- `.github/workflows/update.yml` 作成
- 定時実行（日本時間AM9:00）
- ビルド→デプロイ自動化
- シークレット管理

### Issue #6: GitHub Pages デプロイ設定
**目的**: 静的サイトの公開
- next.config.js の設定
- GitHub Pages用ビルド最適化
- カスタムドメイン対応（オプション）

## 📁 最終的なフォルダ構成

```
fortnite-web/
├── .github/
│   └── workflows/
│       └── update.yml
├── public/
│   ├── shop.json
│   └── skins_today.json
├── scripts/
│   ├── fetchShop.js
│   ├── generateSummary.js
│   └── buildStatic.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── skins/
│   │       └── [slug]/
│   │           └── page.tsx
│   └── components/
│       ├── SkinCard.tsx
│       ├── ShopGrid.tsx
│       ├── Header.tsx
│       ├── AdCard.tsx
│       └── SEOHead.tsx
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🔄 PDCAサイクル

1. **Plan**: 各Issueで要件定義
2. **Do**: devブランチで実装
3. **Check**: ローカルテスト→PR作成
4. **Act**: mainマージ→自動デプロイ

## 🚀 実装順序

1. Issue #2: Next.js基盤構築（1-2日）
2. Issue #3: API取得実装（1日）
3. Issue #4: AI統合（2-3日）
4. Issue #5: 自動化設定（1日）
5. Issue #6: デプロイ設定（1日）

合計想定期間: 約1週間