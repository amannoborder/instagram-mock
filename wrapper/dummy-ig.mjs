#!/usr/bin/env node
// dummy-ig — post a generated image to the dummy-IG.
//
// In Codex: tune your prompt, let Codex generate the image to a file, then this
// command uploads it. No clone, no creds typed — the upload URL + token come
// from the (preconfigured Codex) environment. Image generation is done by Codex
// itself; this wrapper only handles the upload step.
//
//   dummy-ig ./out.png --caption "Triple Excellent, every time. #EIWA" --type image
//
// Env (preset in the Codex environment):
//   DUMMY_IG_UPLOAD_URL   upload endpoint, e.g. https://<worker>/upload   (required)
//   DUMMY_IG_TOKEN        bearer token for the endpoint                   (required)
//   DUMMY_IG_VIEW_URL     public dummy-IG URL to print after upload       (optional)
import { readFile } from 'node:fs/promises'

const args = process.argv.slice(2)
const flags = {}
const positional = []
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a.startsWith('--')) flags[a.slice(2)] = (args[i + 1] && !args[i + 1].startsWith('--')) ? args[++i] : true
  else positional.push(a)
}

const imagePath = (typeof flags.image === 'string' && flags.image) || positional[0]
const caption = typeof flags.caption === 'string' ? flags.caption : ''
const type = typeof flags.type === 'string' ? flags.type : 'image'
const endpoint = flags.endpoint || process.env.DUMMY_IG_UPLOAD_URL
const token = flags.token || process.env.DUMMY_IG_TOKEN
const viewUrl = process.env.DUMMY_IG_VIEW_URL

function die(msg) { console.error(`✗ ${msg}`); process.exit(1) }

if (!imagePath) die('Give the generated image file:  dummy-ig ./out.png --caption "…"')
if (!endpoint) die('Set DUMMY_IG_UPLOAD_URL (or pass --endpoint).')
if (!token) die('Set DUMMY_IG_TOKEN (or pass --token).')

const buf = await readFile(imagePath).catch(() => die(`cannot read image: ${imagePath}`))
const ext = (imagePath.split('.').pop() || 'png').toLowerCase()

console.log('⏳ uploading to the dummy-IG…')
const res = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageBase64: buf.toString('base64'), ext, caption, type }),
})
if (!res.ok) die(`upload failed (${res.status}): ${await res.text()}`)

const result = await res.json()
console.log('✓ posted to the dummy-IG')
console.log(`  id:    ${result.id}`)
console.log(`  image: ${result.imageUrl}`)
if (viewUrl) console.log(`  open:  ${viewUrl}`)
