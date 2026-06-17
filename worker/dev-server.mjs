#!/usr/bin/env node
// Local stand-in for the Cloudflare Worker — same HTTP contract, but stores the
// manifest + images on disk under ../public so the running Vite app picks them
// up. Lets you demo the full flow (wrapper → upload → /live) with no Cloudflare.
//
//   node worker/dev-server.mjs           # listens on :8787, token "dev-token"
//   DUMMY_IG_TOKEN=secret PORT=9000 node worker/dev-server.mjs
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const PORT = Number(process.env.PORT) || 8787
const TOKEN = process.env.DUMMY_IG_TOKEN || 'dev-token'
const PUBLIC = fileURLToPath(new URL('../public', import.meta.url))
const MANIFEST = `${PUBLIC}/manifest.json`
const UPLOADS = `${PUBLIC}/uploads`

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
}
const send = (res, status, obj) =>
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS }).end(JSON.stringify(obj))

const readManifest = async () => JSON.parse(await readFile(MANIFEST, 'utf8'))

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return res.writeHead(204, CORS).end()

  if (req.url === '/manifest.json' && req.method === 'GET') {
    return send(res, 200, await readManifest())
  }

  if (req.url === '/upload' && req.method === 'POST') {
    if ((req.headers.authorization || '') !== `Bearer ${TOKEN}`) return send(res, 401, { error: 'unauthorized' })
    let body = ''
    for await (const chunk of req) body += chunk
    let payload
    try { payload = JSON.parse(body) } catch { return send(res, 400, { error: 'invalid JSON' }) }
    const { imageBase64, ext = 'png', caption = '', type = 'image' } = payload || {}
    if (!imageBase64) return send(res, 400, { error: 'imageBase64 required' })

    const id = randomUUID()
    await mkdir(UPLOADS, { recursive: true })
    await writeFile(`${UPLOADS}/${id}.${ext}`, Buffer.from(imageBase64, 'base64'))

    const manifest = await readManifest()
    const post = {
      id, image: `/uploads/${id}.${ext}`, type, status: 'approved', likes: 0,
      caption, comments: [], time: 'JUST NOW', createdAt: new Date().toISOString(),
    }
    manifest.posts = [post, ...manifest.posts]
    manifest.updatedAt = new Date().toISOString()
    await writeFile(MANIFEST, JSON.stringify(manifest, null, 2))

    return send(res, 200, { id, imageUrl: `/uploads/${id}.${ext}`, postCount: manifest.posts.length })
  }

  send(res, 404, { error: 'not found' })
}).listen(PORT, () => console.log(`dummy-ig dev upload server → http://localhost:${PORT}  (token: ${TOKEN})`))
