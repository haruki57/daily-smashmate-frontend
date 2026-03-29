# Vercel → Cloudflare Pages 移行記録

## 背景

Vercel 無料プランの上限を超えたため、Cloudflare Pages へ移行した。

---

## 主な変更点

### 1. データベースクライアントの置き換え（Prisma + pg → Supabase JS）

Cloudflare Workers は Node.js の `net` / `tls` モジュールに依存する TCP 接続が使えないため、
`pg`（node-postgres）および `@prisma/client` は動作しない。

**削除したパッケージ**
- `@prisma/client`
- `prisma`
- `pg`
- `@prisma/adapter-pg`
- `@vercel/postgres`
- `@types/pg`

**追加したパッケージ**
- `@supabase/supabase-js` — HTTP/fetch ベースのクライアントで Edge Runtime と互換

**接続設定** (`app/_lib/supabase.ts`)

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 2. Prisma クエリを Supabase クエリに書き換え

全 API ルート（`app/api/` 以下）を Supabase JS で書き直した。

**複雑なクエリの対処**

| 元の Prisma クエリ | Supabase での対処 |
|---|---|
| 4テーブル JOIN | 複数クエリ + アプリ側でオブジェクトマップ結合 |
| UNION（wins/losses） | 2クエリ並列実行 → 配列結合 |
| GROUP BY + COUNT | 全行取得 → アプリ側で `countMap` 集計 |
| リレーション結合 (`include`) | 別クエリで取得 → `accountInfo` フィールドに詰め替え |

Supabase の埋め込みクエリ構文（`smashmateAccountInfo(playerName)` 等）は外部キー未設定のため動作しなかった。`top200` など関連テーブルを参照するルートは別クエリ + アプリ結合に変更した。

### 3. Edge Runtime の設定

`@cloudflare/next-on-pages` は全ページ・API ルートで Edge Runtime が必要。

全 `app/api/**/route.ts` と `app/**/page.tsx` に追加:

```ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

`force-dynamic` は SSG 時のフェッチエラーを防ぐために必要（ビルド時に API が存在しないため）。

### 4. fetch オプションの削除

Cloudflare Workers は `RequestInitializerDict` の `cache` フィールド未実装。
`app/_lib/services/` 以下の全サービス関数から以下を削除した。

```ts
// 削除: Cloudflare Workers 非対応
{ cache: "force-cache" }
{ cache: "no-store" }
{ next: { revalidate: 3600 } }
```

### 5. ビルド設定

**`package.json` スクリプト**

```json
"build": "next build",
"pages:build": "npx @cloudflare/next-on-pages"
```

`pages:build` と `build` を分離しないと循環呼び出しになる。

**`wrangler.toml`**

```toml
name = "daily-smashmate-frontend"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

### 6. デプロイ時の注意

`wrangler pages deploy` には **`--no-bundle`** フラグが必須。

`@cloudflare/next-on-pages` が生成する `_worker.js` にはワイルドカード動的 import（`.bin` ファイル参照）が含まれており、Wrangler 4.x が再バンドル時にこれを解決できずエラーになるため。

---

## 環境変数

### ランタイム変数（Cloudflare Pages のシークレットとして設定）

| 変数名 | 説明 |
|---|---|
| `SUPABASE_URL` | Supabase プロジェクト URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー |
| `API_HOST` | 自サービスのベース URL（例: `https://daily-smashmate.harukisb.net`） |

### ビルド時変数（`NEXT_PUBLIC_*` はバンドルへ埋め込まれるため、ビルド前に設定が必要）

| 変数名 | 値 |
|---|---|
| `NEXT_PUBLIC_STATIC_FILE_DOMAIN` | `https://d1d1e1qa6dh1n.cloudfront.net` |

ローカルビルド時は `.env.local` に記載する（`.gitignore` 対象）。

---

## はまったポイント

### `pg` が Edge Runtime で動かない
`pg` は `net` / `tls` / `path` / `stream` モジュールに依存する。`nodejs_compat` フラグを有効にしても Cloudflare Workers では TCP 接続は使えない。

### `@prisma/client` のバイナリが残るとデプロイ失敗
`@prisma/client` をアンインストールしても `.next` / `.vercel/output` にキャッシュが残ることがある。必ず `rm -rf .next .vercel/output` でクリーンビルドすること。

### Supabase 埋め込みクエリは外部キー設定が必要
`.select('relatedTable(field)')` 構文は Supabase のスキーマに外部キーリレーションが定義されていないと機能しない（`null` または空配列が返る）。

### `NEXT_PUBLIC_*` はビルド時埋め込み
Cloudflare Pages のシークレットに設定しても効果なし。ビルド実行前に環境変数として渡す必要がある（ローカルなら `.env.local`）。
