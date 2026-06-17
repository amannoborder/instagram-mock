// Upload Worker for the dummy-IG.
//   GET  /manifest.json  → the live manifest (full account + posts)   [public, CORS]
//   POST /upload         → token-gated: store image in R2 + append to manifest
//   GET  /img/<key>      → serve a stored image from R2
//
// The member wrapper calls POST /upload; the dummy-IG app fetches /manifest.json.
import { ManifestStore } from './manifest-do.js'
export { ManifestStore }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
}
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS } })

const manifestStub = (env) => env.MANIFEST.get(env.MANIFEST.idFromName('global'))

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })

    // --- public manifest (what the app polls) ---
    if (url.pathname === '/manifest.json' && request.method === 'GET') {
      const res = await manifestStub(env).fetch('https://do/get')
      const body = await res.text()
      return new Response(body, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS } })
    }

    // --- serve stored images ---
    if (url.pathname.startsWith('/img/') && request.method === 'GET') {
      const key = decodeURIComponent(url.pathname.slice('/img/'.length))
      const obj = await env.BUCKET.get(key)
      if (!obj) return new Response('not found', { status: 404, headers: CORS })
      return new Response(obj.body, {
        headers: { 'Content-Type': obj.httpMetadata?.contentType || 'image/png', 'Cache-Control': 'public, max-age=31536000', ...CORS },
      })
    }

    // --- token-gated upload ---
    if (url.pathname === '/upload' && request.method === 'POST') {
      const auth = request.headers.get('Authorization') || ''
      if (auth !== `Bearer ${env.UPLOAD_TOKEN}`) return json({ error: 'unauthorized' }, 401)

      let payload
      try { payload = await request.json() } catch { return json({ error: 'invalid JSON body' }, 400) }
      const { imageBase64, ext = 'png', caption = '', type = 'image' } = payload || {}
      if (!imageBase64) return json({ error: 'imageBase64 required' }, 400)

      const bytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0))
      if (bytes.length > 10 * 1024 * 1024) return json({ error: 'image too large (>10MB)' }, 413)

      const id = crypto.randomUUID()
      const key = `posts/${id}.${ext}`
      const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
      await env.BUCKET.put(key, bytes, { httpMetadata: { contentType } })

      const base = env.PUBLIC_BASE || url.origin
      const imageUrl = `${base}/img/${key}`
      const post = {
        id, image: imageUrl, type, status: 'approved', likes: 0,
        caption, comments: [], time: 'JUST NOW', createdAt: new Date().toISOString(),
      }
      const appendRes = await manifestStub(env).fetch('https://do/append', {
        method: 'POST', body: JSON.stringify(post),
      })
      const { postCount } = await appendRes.json()
      return json({ id, imageUrl, postCount })
    }

    return json({ error: 'not found' }, 404)
  },
}
