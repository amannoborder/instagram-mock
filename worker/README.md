# Upload Worker (dummy-IG)

Token-gated endpoint that stores generated images and appends them to the live
manifest the dummy-IG renders from.

## Routes
| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/manifest.json` | public | the live manifest (app polls this) |
| POST | `/upload` | `Bearer <UPLOAD_TOKEN>` | store image (R2) + append post (atomic) |
| GET | `/img/<key>` | public | serve a stored image |

`POST /upload` body (JSON): `{ imageBase64, ext, caption, type }` → `{ id, imageUrl, postCount }`.

Storage: images in **R2** (`BUCKET`); the manifest in a **Durable Object**
(`ManifestStore`) so concurrent uploads serialize and never clobber each other.

## Deploy (IAN)
```bash
cd worker
npm i -g wrangler            # or npx wrangler ...
wrangler r2 bucket create eiwa-dummy-ig
wrangler secret put UPLOAD_TOKEN          # paste the team token
# optional: set PUBLIC_BASE in wrangler.toml to your custom domain
wrangler deploy
```
Then point the app at it: `VITE_MANIFEST_URL=https://<worker-host>/manifest.json`,
and give the wrapper `DUMMY_IG_UPLOAD_URL=https://<worker-host>/upload`.

## Local (no Cloudflare)
`node dev-server.mjs` mirrors the same contract but writes to `../public`
(`manifest.json` + `uploads/`) so the running Vite app shows uploads immediately.
Either run `wrangler dev` (real Worker, local R2/DO emulation) or this dev server.
