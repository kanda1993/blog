# Blog

Next.js + TypeScript + Tailwind CSS で構築した個人ブログ。

## 技術スタック

| 項目             | 技術                    |
| ---------------- | ----------------------- |
| フレームワーク   | Next.js 16 (App Router) |
| 言語             | TypeScript              |
| スタイリング     | Tailwind CSS v4         |
| 記事フォーマット | Markdown                |
| ランタイム       | Bun                     |
| ローカル環境     | Docker Compose          |
| ホスティング     | GitHub Pages            |

## セットアップ

### 必要なもの

- Docker Desktop

### 開発サーバー起動

```bash
# コンテナ起動
docker compose up -d

# 開発サーバー起動
docker compose exec app bun run dev

# 停止: Ctrl+C で開発サーバー停止後
docker compose down
```

http://localhost:3000/blog でアクセス

### パッケージ追加時

```bash
docker compose exec app bun add <package-name>
```

## 記事の追加

### ディレクトリ構成

```
content/posts/
└── YYYY/
    └── MM/
        └── DD/
            └── NNN.md  (例: 001.md)
```

### Frontmatter

```yaml
---
title: "記事タイトル"
date: "2025-12-12"
tags:
  - "タグ1"
  - "タグ2"
category: "カテゴリ名"
coverImage: "/posts/2025/12/12/image.jpg" # 任意
---
本文...
```

### 画像の配置

- 記事用画像: `public/posts/YYYY/MM/DD/`
- サイト共通画像: `public/site/`

## Git Hooks

コミット時に自動で lint-staged が実行されます。

> **Note:** コミット前に `docker compose up -d` でコンテナを起動しておく必要があります。

## コマンド

```bash
# Lint
docker compose exec app bun run lint
docker compose exec app bun run lint:fix

# Format
docker compose exec app bun run format
docker compose exec app bun run format:check

# ビルド (Static Export)
docker compose exec app bun run build
```

## ディレクトリ構成

```
blog/
├── content/posts/       # Markdown 記事
├── public/
│   ├── posts/          # 記事用画像
│   └── site/           # サイト共通画像
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # 共通コンポーネント
│   └── lib/            # ユーティリティ
├── docker/
│   └── Dockerfile
└── docker-compose.yml
```

## ESLint 構成

| パッケージ                   | 役割                             | 状態 |
| ---------------------------- | -------------------------------- | ---- |
| eslint-config-next           | Next.js 標準（React/Hooks/a11y） | ✓    |
| eslint-config-love           | 厳格な TypeScript ルール         | ✓    |
| eslint-config-prettier       | ESLint と Prettier の競合防止    | ✓    |
| eslint-plugin-import         | import 文の整理・検証            | ✓    |
| eslint-plugin-unused-imports | 未使用 import を自動削除         | ✓    |
| eslint-plugin-tailwindcss    | Tailwind クラス順序整理          | ❌   |

> **Note:** `eslint-plugin-tailwindcss` は Tailwind CSS v4 に未対応のため、現在スキップしています。対応後に追加予定。

## 既知の問題

### Bun + Turbopack の SourceMap 警告

開発時に以下の警告が表示されますが、**無視して問題ありません**。

```
module.SourceMap is not yet implemented in Bun
```

- **原因:** Bun が `module.SourceMap` API を未実装
- **影響:** なし（動作・ビルドに影響なし）
- **対応:** Bun の将来バージョンで解消予定

## ライセンス

- **コード:** MIT License
- **記事コンテンツ:** All Rights Reserved（無断転載禁止）
