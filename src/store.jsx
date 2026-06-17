import { createContext, useContext, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { ACCOUNT, POSTS, STORIES, SEEDED_STORIES } from './lib/data.js'
import { LIMITS, clamp } from './lib/limits.js'

// Shared, editable state for the whole mock.
//
// SOURCE OF TRUTH = a live manifest (full account + posts) fetched at runtime
// from VITE_MANIFEST_URL (default /manifest.json). The upload endpoint appends
// posts to that manifest, and polling makes them appear automatically — no
// rebuild, no hardcoded data. The bundled data.js is only an offline fallback.
//
// The controls page can still tune things locally; hitting Save snapshots to
// localStorage ("local mode"), which then takes precedence over the manifest
// and pauses polling until Reset.
const StoreCtx = createContext(null)

const MANIFEST_URL = import.meta.env.VITE_MANIFEST_URL || '/manifest.json'
const POLL_MS = 15000
const STORAGE_KEY = 'eiwa-mock-state'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !data.account || !Array.isArray(data.posts)) return null
    return data
  } catch {
    return null
  }
}

// mode "live"  → public dummy-IG: read from the manifest + poll (its own page).
// mode "local" → design mock + controls: bundled data / saved snapshot, no fetch.
export function StoreProvider({ children, mode = 'local' }) {
  const isLive = mode === 'live'
  const saved = isLive ? null : loadSaved()
  const [account, setAccount] = useState(saved?.account ?? ACCOUNT)
  const [posts, setPosts] = useState(saved?.posts ?? POSTS)
  const [loading, setLoading] = useState(isLive)
  const [error, setError] = useState(null)

  // live = read from the manifest + poll. Only true on the live page.
  const liveRef = useRef(isLive)
  // paused = controls page is open; skip polling so edits aren't clobbered.
  const pausedRef = useRef(false)

  // Pull the manifest and replace account + posts. Falls back silently to
  // whatever is already in state (defaults) on network/parse failure.
  const loadManifest = useCallback(async () => {
    try {
      const res = await fetch(MANIFEST_URL, { cache: 'no-store' })
      if (!res.ok) throw new Error(`manifest ${res.status}`)
      const data = await res.json()
      if (data.account) setAccount(data.account)
      if (Array.isArray(data.posts)) setPosts(data.posts)
      setError(null)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + polling (only in live mode).
  useEffect(() => {
    if (!liveRef.current) { setLoading(false); return } // local mode: keep saved snapshot
    loadManifest()
    const id = setInterval(() => {
      if (liveRef.current && !pausedRef.current) loadManifest()
    }, POLL_MS)
    return () => clearInterval(id)
  }, [loadManifest])

  const api = useMemo(() => ({
    // account field setters
    setField: (key, value) => setAccount(a => ({ ...a, [key]: value })),
    setStat: (key, value) => setAccount(a => ({ ...a, stats: { ...a.stats, [key]: value } })),
    setHighlightTitle: (i, value) =>
      setAccount(a => ({ ...a, highlights: a.highlights.map((h, idx) => idx === i ? { ...h, title: value } : h) })),
    // post field setters
    setPostCaption: (id, value) => setPosts(ps => ps.map(p => p.id === id ? { ...p, caption: value } : p)),
    setPostImage: (id, value) => setPosts(ps => ps.map(p => p.id === id ? { ...p, image: value } : p)),
    // polling control (controls page pauses it while editing)
    pausePolling: () => { pausedRef.current = true },
    resumePolling: () => { pausedRef.current = false },
  }), [])

  // Save a local snapshot (→ local mode, stops polling). Returns false on quota error.
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ account, posts }))
      liveRef.current = false
      return true
    } catch {
      return false
    }
  }

  // Drop the local snapshot. Live page re-pulls the manifest; local page reverts
  // to the bundled defaults.
  const reset = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    if (isLive) { setLoading(true); loadManifest() }
    else { setAccount(ACCOUNT); setPosts(POSTS) }
  }

  // derived values, kept in sync with the editable state
  const handle = clamp(account.username, LIMITS.USERNAME)
  const reels = useMemo(() => posts.filter(p => p.type === 'reel'), [posts])
  const stories = useMemo(() => ([
    { user: account.username, avatar: account.avatar, verified: account.verified, segments: STORIES[0].segments },
    ...SEEDED_STORIES,
  ]), [account.username, account.avatar, account.verified])

  const value = { account, posts, handle, reels, stories, loading, error, refresh: loadManifest, ...api, save, reset }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>')
  return ctx
}
