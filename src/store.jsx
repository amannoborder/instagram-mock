import { createContext, useContext, useMemo, useState } from 'react'
import { ACCOUNT, POSTS, STORIES, SEEDED_STORIES } from './lib/data.js'
import { LIMITS, clamp } from './lib/limits.js'

// Shared, editable state for the whole mock. The controls panel mutates this;
// every phone-mock screen reads from it, so edits render live.
const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [account, setAccount] = useState(ACCOUNT)
  const [posts, setPosts] = useState(POSTS)

  const api = useMemo(() => ({
    // account field setters
    setField: (key, value) => setAccount(a => ({ ...a, [key]: value })),
    setStat: (key, value) => setAccount(a => ({ ...a, stats: { ...a.stats, [key]: value } })),
    setHighlightTitle: (i, value) =>
      setAccount(a => ({ ...a, highlights: a.highlights.map((h, idx) => idx === i ? { ...h, title: value } : h) })),
    // post field setters
    setPostCaption: (id, value) => setPosts(ps => ps.map(p => p.id === id ? { ...p, caption: value } : p)),
    setPostImage: (id, value) => setPosts(ps => ps.map(p => p.id === id ? { ...p, image: value } : p)),
    reset: () => { setAccount(ACCOUNT); setPosts(POSTS) },
  }), [])

  // derived values, kept in sync with the editable state
  const handle = clamp(account.username, LIMITS.USERNAME)
  const reels = useMemo(() => posts.filter(p => p.type === 'reel'), [posts])
  const stories = useMemo(() => ([
    { user: account.username, avatar: account.avatar, verified: account.verified, segments: STORIES[0].segments },
    ...SEEDED_STORIES,
  ]), [account.username, account.avatar, account.verified])

  const value = { account, posts, handle, reels, stories, ...api }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>')
  return ctx
}
