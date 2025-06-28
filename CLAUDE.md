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
│   └── fetchShop.js
├── src/           # フロントエンド
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── public/        # 静的ファイル・APIデータ
├── package.json   # npm設定
├── .gitignore     # Git除外設定
└── CLAUDE.md      # 本ファイル
```

### npm scripts
- `npm run fetch-shop`: Shop情報をAPIから取得
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