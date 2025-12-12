FROM oven/bun:1.1.38-alpine

# git インストール（lint-staged 用）
RUN apk add --no-cache git

# 日本語ロケール設定
ENV LANG=ja_JP.UTF-8
ENV LC_ALL=ja_JP.UTF-8

# 作業ディレクトリ
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json bun.lockb* ./

# 依存関係インストール
RUN bun install --frozen-lockfile || bun install

# ソースコードをコピー
COPY . .

# 開発サーバーポート
EXPOSE 3000

# 開発サーバー起動
CMD ["bun", "run", "dev"]
