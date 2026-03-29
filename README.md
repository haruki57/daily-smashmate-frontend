# Daily Smashmate

[Daily Smashmate (デイリースマメイト)](https://daily-smashmate.harukisb.net/) is a web application that allows you to search for players on [Smashmate(スマメイト)](https://smashmate.net/) and view their records.

Please note that this repository does not include any web crawlers.

---

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **ホスティング**: Cloudflare Pages
- **データベース**: Supabase (PostgreSQL)
- **静的ファイル**: AWS CloudFront

---

## ローカル開発

### 必要なもの

- Node.js 18+
- [wrangler](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)

### セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local を編集して環境変数を設定
```

`.env.local` に設定する変数:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_HOST=http://localhost:3000
NEXT_PUBLIC_STATIC_FILE_DOMAIN=https://d1d1e1qa6dh1n.cloudfront.net
```

### 開発サーバー起動

```bash
npm run dev
```

---

## デプロイ

### ビルド

```bash
# Next.js → Cloudflare Pages 用にビルド
npm run pages:build
# 内部で npx @cloudflare/next-on-pages を実行
# 出力先: .vercel/output/static
```

> **注意**: `NEXT_PUBLIC_*` 変数はビルド時にバンドルへ埋め込まれます。
> `.env.local` を用意してからビルドしてください。

### Cloudflare Pages へデプロイ

```bash
# Preview 環境（migrate-to-cloudflare ブランチ等）
wrangler pages deploy .vercel/output/static \
  --project-name daily-smashmate-frontend \
  --no-bundle

# Production 環境（main ブランチ扱い）
wrangler pages deploy .vercel/output/static \
  --project-name daily-smashmate-frontend \
  --no-bundle \
  --branch main
```

> **`--no-bundle` は必須**です。`next-on-pages` が生成した `_worker.js` を Wrangler が再バンドルしようとするとエラーになります。

### Cloudflare Pages の環境変数

以下を Cloudflare ダッシュボードまたは `wrangler pages secret put` で設定します。

| 変数名 | 環境 | 説明 |
|---|---|---|
| `SUPABASE_URL` | production / preview | Supabase プロジェクト URL |
| `SUPABASE_SERVICE_ROLE_KEY` | production / preview | Supabase サービスロールキー |
| `API_HOST` | production / preview | 自サービスの URL |

---

## 移行履歴

Vercel から Cloudflare Pages への移行詳細は [docs/cloudflare-migration.md](docs/cloudflare-migration.md) を参照。
