# Blog Project Guidelines

## ブラウザ確認（Chrome DevTools MCP）

UI変更やページ表示の確認時は、**chrome-mcp を積極的に使用**すること。

### 使用タイミング

- 開発サーバー起動後の動作確認
- UIコンポーネントの変更後
- スタイル修正後
- ページ遷移の確認

### 主なコマンド

- `mcp__chrome-devtools__new_page` - ブラウザでページを開く
- `mcp__chrome-devtools__take_snapshot` - ページ状態をキャプチャ
- `mcp__chrome-devtools__click` - 要素をクリック
- `mcp__chrome-devtools__fill` - フォームに入力

### 確認フロー例

```
1. docker compose up -d でサーバー起動
2. chrome-mcp で http://localhost:3000/blog を開く
3. スナップショットで表示確認
4. 必要に応じてインタラクション確認
```

## 開発環境

- パッケージ管理: bun（Docker内）
- 開発サーバー: `docker compose up -d`
- Lint: `bun run lint` / `bun run lint:fix`
- Format: `bun run format`

## コーディング規約

- TypeScript strict mode
- ESLint + Prettier でフォーマット
- import順序は eslint-plugin-import で自動整理
- 未使用importは eslint-plugin-unused-imports で検出

## ファイル構成

- `src/app/` - Next.js App Router ページ
- `src/components/` - 共通コンポーネント
- `src/lib/` - ユーティリティ関数
- `content/posts/` - Markdown記事
- `public/posts/` - 記事用画像
- `public/site/` - サイト用画像

## 既知の問題（無視して良い）

### Bun + Turbopack の SourceMap 警告

```
module.SourceMap is not yet implemented in Bun
```

**原因:** Bun は `module.SourceMap` API を未実装。Next.js (Turbopack) が開発時にこの API を使用しようとして警告が出る。

**影響:** なし。ブログの動作・ビルドには影響しない。開発時のエラースタックトレース表示が一部不正確になるのみ。

**対応:** 無視して OK。Bun が将来このAPIを実装すれば自動的に解消される。

**参考:** https://github.com/oven-sh/bun/issues （Bun の SourceMap 実装は進行中）
