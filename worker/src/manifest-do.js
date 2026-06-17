// ManifestStore — a Durable Object that owns the single manifest, so concurrent
// uploads append atomically (one serialized writer). Images live in R2; this
// only holds the JSON. Seeded with the account on first use.

const SEED = {
  version: 1,
  updatedAt: null,
  account: {
    username: 'eiwa.material',
    displayName: 'EIWA-MATERIAL',
    verified: true,
    category: 'Master Diamond Polishing',
    note: 'Triple Excellent ✨',
    bio: 'Triple Excellent, every time.\nThe value of a diamond is in its polish.\nWork with us: 03-6381-7541 / info@eiwa-material.com',
    links: [{ label: 'info@eiwa-material.com', url: 'mailto:info@eiwa-material.com' }],
    avatar: 'https://ik.imagekit.io/xanalia/xana/diamond/Image1.png',
    stats: { followers: 184200, following: 12 },
    reachLast30Days: 612400,
    highlights: [
      { title: 'Polishing', cover: 'https://ik.imagekit.io/xanalia/xana/diamond/image%206.png' },
      { title: 'Recutting', cover: 'https://ik.imagekit.io/xanalia/xana/diamond/Image4.png' },
    ],
  },
  posts: [],
}

export class ManifestStore {
  constructor(state) {
    this.state = state
  }

  async manifest() {
    return (await this.state.storage.get('manifest')) || SEED
  }

  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/get') {
      return Response.json(await this.manifest())
    }

    if (url.pathname === '/append' && request.method === 'POST') {
      const post = await request.json()
      const m = await this.manifest()
      m.posts = [post, ...m.posts]              // newest first
      m.updatedAt = new Date().toISOString()
      await this.state.storage.put('manifest', m)
      return Response.json({ ok: true, postCount: m.posts.length })
    }

    return new Response('not found', { status: 404 })
  }
}
