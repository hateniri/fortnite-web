# 🧠 CLAUDE Code 運用ルール（CLAUDE.md）

## 目的
このファイルは、Claude Codeが**自律的かつ効率的に開発を進めるための運用・PDCAルール**を定義します。

---

## 1. ブランチ・PRルール
- 🟦 **main** ブランチは保護済み。本番のみ。
- 🟩 開発は **dev** ブランチで行う。
- 各タスクは **Issue 管理**し、作業は `dev → main` の **Pull Request（PR）** 経由でマージ。
- PRには以下テンプレを使用：
  - **Title**: `[#Issue番号] 短い要約`
  - **Description**:
    1. 目的
    2. 実装内容（変更差分）
    3. 動作確認方法（必要に応じて記述）

---

## 2. Issue構成とPDCAステップ

1. **Plan**: 新規タスク毎にIssueを作成し、goal・要件・Done条件を明記。
2. **Do**: `dev` ブランチで実装し、都度コミット。
3. **Check**: PR提出後、コードと動作確認コメントを添えて自己レビュー。
4. **Act**: レビュー通過→mainへマージ／修正要求→再開／次Issueへ移行。

---

## 3. プロジェクト管理（Kanbanなど）
- GitHub Projects（Test・In Progress・Doneなど）を平行運用推奨。
- 新タスク登録時にBoardにチケット追加。

---

## 4. GitHub Actions／CIルール
- 毎日定時（cron）で `dev` に対してビルド＋テスト＋プレビュー生成するWorkflowが必須。
- mainブランチへのPRマージ後、自動で Pages 配信される構成に。

---

## 5. スクリプト／コード構成ルール
- スクリプトは `/scripts/*.js` に整理。
- HTMLテンプレート・UIは `/src/` にまとめ、分かりやすい命名とコメントを付記。
- ファイル頭に次のテンプレを入れるのが望ましい：

```js
/**
 * script: fetchShop.js
 * 目的  : Fortnite JSON取得
 * 入力  : APIエンドポイント
 * 出力  : public/shop.json
 */
```

---

## 6. プロジェクト固有情報

### Fortnite Shop Tracker Project
- **目的**: Fortnite Item Shop情報を取得・表示するWebアプリケーション
- **API**: Fortnite-API.com (https://fortnite-api.com/v2/shop/br)
- **主要機能**:
  - Shop情報の定期取得 (`npm run fetch-shop`)
  - Featured/Daily Itemsの表示
  - レスポンシブダークテーマUI

### ディレクトリ構成（Next.js版）
```
/fortnite/
├── app/              # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── skins/
│       └── [slug]/
│           └── page.tsx
├── components/       # Reactコンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SkinCard.tsx
│   ├── ShopGrid.tsx
│   └── AdCard.tsx
├── scripts/          # API連携スクリプト
│   ├── fetchShop.js
│   ├── fetchSkinImages.js
│   ├── generateSummary.js
│   └── notifyDiscord.js
├── public/           # 静的ファイル
│   ├── images/
│   │   └── skins/   # スキン画像（.webp推奨）
│   ├── shop.json
│   └── skins_today.json
├── lib/             # ユーティリティ
├── .github/
│   └── workflows/
│       └── update.yml
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md
```

### npm scripts
- `npm run dev`: Next.js開発サーバー起動 (http://localhost:3000)
- `npm run build`: 本番用ビルド
- `npm run start`: 本番サーバー起動
- `npm run fetch-shop`: Shop情報をAPIから取得
- `npm run fetch-images`: スキン画像をダウンロード（.webp変換付き）
- `npm run generate-summary`: AI日本語解説生成
- `npm run fetch-all`: 全データ更新（shop → images → summary）
- `npm run notify`: Discord/LINE通知送信

---

## 7. コミットメッセージ規約
- feat: 新機能追加
- fix: バグ修正
- docs: ドキュメント更新
- style: コードスタイル修正
- refactor: リファクタリング
- test: テスト追加・修正
- chore: ビルド・ツール関連

例: `feat: Add shop data fetching script`

---

## 🖼️ スキン画像の自動取得・保存ルール

Claudeは、Fortniteスキンに関する画像を以下のルールに従って毎日自動取得・保存し、HTMLページで表示できるようにする。

---

### ✅ 取得対象

1. **スキンのメイン画像**（全身表示）
2. **スキンのサムネイル画像**（カード用）
3. **スキンの背景イメージ（あれば）**

---

### ✅ 取得元（優先順）

- 公式API: `https://fortnite-api.com/v2/cosmetics/br`
  - 各スキンごとに `images.icon` や `images.featured` フィールドあり
- 画像URLの構成例：
  - `https://fortnite-api.com/images/cosmetics/br/<cosmetic-id>/icon.png`
- Fallbackとして Fandom Wiki も検討（ただし要クローリング制御）

---

### ✅ 保存先と命名規則

- ディレクトリ：`/public/images/skins/`
- ファイル名：`<id>_<type>.png`
  - 例：`/public/images/skins/CID_028_Athena_Commando_F_icon.png`
  - 例：`/public/images/skins/CID_028_Athena_Commando_F_featured.png`

---

### ✅ 取得スクリプト仕様

- スクリプト名：`fetchSkinImages.js`
- 入力：shop.json または cosmetics一覧JSON
- 処理：
  1. 画像URLを抽出
  2. ファイルが存在しない場合のみDL
  3. `/public/images/skins/` に保存
  4. 取得ログを標準出力に表示（ダウンロード数、エラーなど）

---

### ✅ 使用方法（HTML）

- スキンカードの中で：
```html
<img src="/images/skins/CID_028_Athena_Commando_F_icon.png" alt="Renegade Raider スキン画像" loading="lazy" />
```

---

## 🔁 Claudeがやるべきスクリプト概要

```js
// scripts/fetchSkinImages.js
// 1. shop.json を読む
// 2. 各スキンの id と images を取得
// 3. 画像URL確認
// 4. /public/images/skins に保存
// 5. 既にある画像はスキップ
```

---

## 🧩 公式との補完方針（Shadow Official戦略）

このプロジェクトは、Epic Games公式の制約や方針では実現が難しいが、ユーザーにとって便利で嬉しい要素を補完するために設計されています。Claude Codeは以下の方針に基づいて開発・実装を進めてください。

---

### ✅ 1. 軽量・高速優先（画像最適化）

- 画像は極力 `.webp` 形式で保存し、`/public/images/skins/` に格納してください。
- Claudeは自動圧縮（品質85%〜65%程度）を許容し、スマートフォンで高速表示できる状態を最優先とします。
- 同一スキンで複数画像（アイコン／全体像など）がある場合は、カード表示用に1枚を選定。

---

### ✅ 2. 主観的・子供向けの説明表現

- Claudeはスキンやイベントの解説時、GPTを使って「子供にもわかりやすく、楽しく、ちょっと砕けた」表現で日本語解説を作成してください。
- 例：「このスキンはバトルが得意な人にピッタリ！」「ちょっと目立ちたい人におすすめ 🎯」
- 絵文字は最大2つまで使用可能。句点で文を締めてください。

---

### ✅ 3. 即時性・毎日更新の徹底

- ClaudeはFortniteの公式APIを元に、毎日定時で以下を更新してください：
  - `/public/shop.json` の取得・保存
  - GPTによる `/public/skins_today.json` の要約生成
  - `/public/index.html` に新データを反映
- GitHub Actionsで午前5時（JST）に自動実行。`Actions` タブで成功ログを確認可能にしてください。

---

### ✅ 4. 自由で遊び心のあるUIデザイン

- Tailwind CSSで、見やすく、楽しく、スマホ最適化されたUIを構築してください。
- 色使い・フォントサイズ・カード構造はClaudeの裁量で調整して構いません。
- 過度に「公式っぽい」トーンは避け、むしろ非公式らしい"フレンドリー感"を重視してください。

---

### ✅ 5. 通知・外部連携の自由化

- LINEやDiscordなど、通知チャネルの制約を気にせず自由に活用して構いません。
- Claudeは `/scripts/notifyDiscord.js` 等を通じて、復刻スキン情報をDiscord Webhookへembed通知可能にしてください。
- LINE対応（QR表示、通知誘導ボタン）もサポート対象とします。

---

### 🧠 開発原則まとめ

Claude Codeはこのプロジェクトを：

> 公式ができないことを、ユーザー目線で軽く・早く・親しみやすく届ける "影の公式" サイトとして構築してください。

- ユーザーが**毎日開きたくなる便利さ**と
- スマホでも**爆速で見られる軽さ**
- 子供でも使える**優しい日本語**

を優先し、全体設計を組んでください。