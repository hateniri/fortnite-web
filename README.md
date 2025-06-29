# フォートナイター - Fortnite Shop Tracker

Fortniteの今日のアイテムショップを日本語で分かりやすく解説するWebサイト。

## 🚀 機能

- 毎日午前9時5分（JST）に自動更新
- アイテムショップの全商品を日本語で表示
- AI による子供向けの分かりやすい解説
- コラボ投票機能
- V-Bucksプレゼント企画（不定期）
- Discord通知対応

## 🛠️ 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS  
- GitHub Actions (自動更新)
- GitHub Pages (ホスティング)

## 📝 環境変数

以下の環境変数をGitHub Secretsに設定してください：

```env
FORTNITE_API_KEY=       # Fortnite-API.comのAPIキー（オプション）
OPENAI_API_KEY=         # OpenAI APIキー（AI要約生成用）
DISCORD_WEBHOOK_URL=    # Discord通知用WebhookURL（オプション）
CUSTOM_DOMAIN=          # カスタムドメイン（オプション）
```

## 🔧 ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# データ取得
npm run fetch-all
```

## 🤖 GitHub Actions

### 自動更新 (update-shop.yml)
- 毎日 JST 9:05 に実行
- ショップデータの取得
- 画像のダウンロード
- AI要約の生成
- GitHub Pagesへの自動デプロイ

### 手動デプロイ (manual-deploy.yml)
- Actions タブから手動実行可能
- データ取得をスキップするオプションあり

## 📂 ディレクトリ構造

```
/fortnite/
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── scripts/          # データ取得スクリプト
├── public/           # 静的ファイル
├── lib/              # ユーティリティ
└── .github/
    └── workflows/    # GitHub Actions
```

## 📄 ライセンス

このプロジェクトはファンメイドの非公式サイトです。
Fortniteは Epic Games, Inc. の商標です。