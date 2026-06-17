# Dummy-IG pipeline — sketch

Step 1 (the manifest-driven app) is **built**. Steps 2–3 below are sketches to
build next; the actual public host + bucket are IAN's.

## Flow
```
Member (Codex) → one command(prompt)
   → generate image (Codex image gen) → POST image + metadata (token) → Upload Worker
        → store image in bucket  +  append entry to manifest.json (atomic)
Public dummy-IG (hosted)  → polls manifest.json (15s)  → new post appears in the grid
```

Decisions locked: **full-account manifest**, posts appear **immediately (no status
gate)**, image gen happens **client-side in Codex**, members run it from a
**preconfigured Codex env (no clone, no creds typed)**.

---

## 1. Manifest (done)
Served at `VITE_MANIFEST_URL` (default `/manifest.json`). Shape:
```jsonc
{
  "version": 1,
  "updatedAt": "<ISO>",
  "account": { "username", "displayName", "verified", "category", "note",
               "bio", "links": [...], "avatar", "stats": {followers, following},
               "reachLast30Days", "highlights": [{title, cover}] },
  "posts": [ { "id", "image", "type": "image|carousel|reel",
               "status", "likes", "views?", "caption", "comments": [...], "time" } ]
}
```
The app fetches this at runtime and polls every 15s, so appended posts appear
with no rebuild. Upload only needs to **append to `posts[]`**.

---

## 2. Upload endpoint (Cloudflare Worker — ✅ built → `worker/`)

`POST /upload`  ·  auth: `Authorization: Bearer <UPLOAD_TOKEN>`

Request (multipart or JSON+base64):
- `image` — the generated image bytes
- `caption`, `type` (default `image`) — metadata

Behavior:
```
1. verify Bearer token            → 401 if missing/wrong
2. validate content-type & size   → 413 if too big
3. key = `posts/${ulid}.jpg`
   put image → R2 bucket          → public URL = `${PUBLIC_BASE}/${key}`
4. atomically update the manifest:
     read manifest  → posts.unshift({ id: ulid, image: url, type, status:'approved',
                                       caption, likes:0, comments:[], time:'JUST NOW',
                                       createdAt: now })
     write manifest back
5. return 200 { id, imageUrl, postCount }
```

Notes:
- **Atomic append** is the one real gotcha (concurrent members). Use a
  **Durable Object** (or KV with a single-writer lock) to own `manifest.json`;
  store images in **R2**. Manifest served from the same origin/CDN with `CORS`
  allowing the public site to fetch it.
- Keep `status` in the schema for the later approve step, but the public grid
  shows everything now (per the locked decision).

Env/secrets (Worker): `UPLOAD_TOKEN`, `R2` binding, `PUBLIC_BASE`.

---

## 3. One-command member wrapper (✅ built → `wrapper/`)

Runs in a **preconfigured Codex environment** — `DUMMY_IG_UPLOAD_URL` + `DUMMY_IG_TOKEN`
are preset as env secrets, so the member types nothing sensitive and clones nothing.

**Generation is Codex's own** (no OpenAI key). The wrapper only uploads. Per
`wrapper/AGENTS.md`, when the member asks Codex to post a prompt:
```
1. Codex generates the image from the prompt → saves a file (e.g. ./out.png)
2. dummy-ig ./out.png --caption "…" --type image    # POST to $DUMMY_IG_UPLOAD_URL
3. Codex reports the post URL → member opens it; the image is there
```

Zero local setup: no repo clone, no keys on the member's machine — the Codex env
supplies the token + endpoint; image generation runs inside Codex itself.

---

## Hand-off to IAN
- Public **subdomain** for the dummy-IG + deploy of this app.
- **R2 bucket** (public-read) for images + **Durable Object/KV** for the manifest.
- Where `manifest.json` is served (CDN URL) → set `VITE_MANIFEST_URL` to it.
- **CORS** allowing the public site origin to fetch manifest + images.
- Provision `UPLOAD_TOKEN` and inject it (+ endpoint URL) into the Codex env.

## Later (out of scope now)
Approve + schedule step that hands an approved post to **SNS Orchestrator** for
the real posting. The `status` field is already in the schema for this.
