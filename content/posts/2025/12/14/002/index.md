---
title: "ブログにAI会話ログ表示機能を追加"
date: "2025-12-14"
tags:
  - AI
  - Claude Code
  - 日記
category: 技術
---

## 概要

AIと相談しながら開発する過程を公開できるよう、記事にAI会話ログを紐づける機能を実装した。

## 実装した機能

### 1. フォルダ構成の変更

記事ごとにディレクトリを分けて、画像やログを整理できるようにした。

```
# 変更前
content/posts/2025/12/14/001.md

# 変更後
content/posts/2025/12/14/001/
├── index.md       # 記事本体
├── log.md         # AI会話ログ（オプション）
└── images/        # 画像（将来用）
```

### 2. AI会話ログの表示

- 記事ページのサイドバー（目次の下）に「AI会話ログ」リンクを追加
- `log.md` がある記事のみリンクを表示
- `/posts/YYYY/MM/DD/NNN/log` でログページを表示
- モバイル表示では記事の下にリンクを配置

### 3. ログ変換コマンド

Claude Codeの会話ログ（JSONL）をMarkdownに変換するCLIコマンドを作成。

```bash
bun run convert-log <jsonl> <output_dir>
```

### 4. スラッシュコマンド

`/export` で出力した会話ログを記事用に変換するスラッシュコマンドも作成。

```
/convert-log <exported_file>
```

## 技術的なポイント

### posts.ts の修正

`getAllPosts()` と `getPostBySlug()` を新しいフォルダ構成に対応。

```typescript
// ディレクトリ内の index.md を読み込み
const indexPath = path.join(entryPath, "index.md");
if (!fs.existsSync(indexPath)) continue;
```

### レスポンシブ対応

```tsx
{
  /* PC: サイドバーに表示 */
}
<aside className="hidden lg:block">
  <AiLogLink />
</aside>;

{
  /* モバイル: 記事の下に表示 */
}
<div className="lg:hidden">
  <AiLogLink />
</div>;
```

## まとめ

AIとの会話過程を記事と一緒に公開できるようになった。開発の透明性を高め、学習記録としても活用できる。
