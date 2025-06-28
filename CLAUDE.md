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

### ディレクトリ構成
```
/fortnite/
├── scripts/        # API連携スクリプト
│   ├── fetchShop.js
│   └── fetchSkinImages.js
├── src/           # フロントエンド
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── public/        # 静的ファイル・APIデータ
│   └── images/
│       └── skins/  # スキン画像保存
├── package.json   # npm設定
├── .gitignore     # Git除外設定
└── CLAUDE.md      # 本ファイル
```

### npm scripts
- `npm run fetch-shop`: Shop情報をAPIから取得
- `npm run fetch-images`: スキン画像をダウンロード
- `npm run fetch-all`: Shop情報取得＋画像ダウンロード
- `npm run serve`: ローカルサーバー起動 (http://localhost:8080)
- `npm test`: テスト実行（未実装）

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