import { useState } from 'react'
import { useStore } from '../store.jsx'
import { LIMITS, clampHighlight, captionParts } from '../lib/limits.js'

// Small inline char-counter; turns red if the value exceeds the limit.
function Counter({ value, max }) {
  return <span className={`cp-count ${value > max ? 'over' : ''}`}>{value}/{max}</span>
}

const readAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

// Image control: live thumbnail + file upload (→ data URL) + paste-URL fallback.
function ImagePicker({ src, onChange }) {
  const onFile = async (e) => {
    const file = e.target.files[0]
    if (file) onChange(await readAsDataURL(file))
    e.target.value = '' // allow re-picking the same file
  }
  const applyUrl = (e) => { const v = e.target.value.trim(); if (v) onChange(v) }
  return (
    <div className="cp-img">
      <img className="cp-thumb" src={src} alt="" />
      <div className="cp-img-actions">
        <label className="cp-upload">
          Upload image
          <input type="file" accept="image/*" onChange={onFile} hidden />
        </label>
        <input className="cp-url" type="url" placeholder="or paste URL, then Enter"
          onBlur={applyUrl}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyUrl(e) } }} />
      </div>
    </div>
  )
}

// The controls pane — edits the shared store, which drives the phone mock live.
// Char limits + truncation come from src/lib/limits.js (single source of truth).
export default function ControlsPane() {
  const { account, posts, setField, setStat, setHighlightTitle, setPostCaption, setPostImage, reset } = useStore()
  const [postId, setPostId] = useState(posts[0].id)
  const post = posts.find((p) => p.id === postId) || posts[0]
  const cap = captionParts(post.caption, LIMITS.CAPTION_PREVIEW)

  return (
    <aside className="controls-pane" aria-label="Post controls">
      <div className="cp-head">
        <h2>Post Controls</h2>
        <button className="cp-reset" onClick={reset}>Reset</button>
      </div>

      <div className="cp-scroll">
        <section className="cp-group">
          <h3>Profile</h3>

          <div className="cp-field">
            <span className="cp-label">Profile photo</span>
            <ImagePicker src={account.avatar} onChange={(url) => setField('avatar', url)} />
          </div>

          <label className="cp-field">
            <span className="cp-label">Username <Counter value={account.username.length} max={LIMITS.USERNAME} /></span>
            <input value={account.username} maxLength={LIMITS.USERNAME}
              onChange={(e) => setField('username', e.target.value)} />
          </label>

          <label className="cp-field">
            <span className="cp-label">Display name</span>
            <input value={account.displayName} onChange={(e) => setField('displayName', e.target.value)} />
          </label>

          <label className="cp-field">
            <span className="cp-label">Category</span>
            <input value={account.category} onChange={(e) => setField('category', e.target.value)} />
          </label>

          <label className="cp-field">
            <span className="cp-label">Bio <Counter value={account.bio.length} max={LIMITS.BIO} /></span>
            <textarea rows={3} value={account.bio} maxLength={LIMITS.BIO}
              onChange={(e) => setField('bio', e.target.value)} />
          </label>

          <label className="cp-field">
            <span className="cp-label">Note bubble</span>
            <input value={account.note || ''} placeholder="(empty = hidden)"
              onChange={(e) => setField('note', e.target.value)} />
          </label>

          <label className="cp-check">
            <input type="checkbox" checked={account.verified}
              onChange={(e) => setField('verified', e.target.checked)} />
            <span>Verified badge</span>
          </label>
        </section>

        <section className="cp-group">
          <h3>Counts</h3>
          <div className="cp-row">
            <label className="cp-field">
              <span className="cp-label">Followers</span>
              <input type="number" min="0" value={account.stats.followers}
                onChange={(e) => setStat('followers', Math.max(0, +e.target.value))} />
            </label>
            <label className="cp-field">
              <span className="cp-label">Following</span>
              <input type="number" min="0" value={account.stats.following}
                onChange={(e) => setStat('following', Math.max(0, +e.target.value))} />
            </label>
          </div>
          <label className="cp-field">
            <span className="cp-label">Reach · last 30 days <span className="cp-hint">(dashboard)</span></span>
            <input type="number" min="0" value={account.reachLast30Days}
              onChange={(e) => setField('reachLast30Days', Math.max(0, +e.target.value))} />
          </label>
        </section>

        <section className="cp-group">
          <h3>Highlights <span className="cp-hint">truncates at {LIMITS.HIGHLIGHT_TITLE}</span></h3>
          {account.highlights.map((h, i) => (
            <label className="cp-field" key={i}>
              <span className="cp-label">#{i + 1} <span className="cp-preview">→ {clampHighlight(h.title)}</span></span>
              <input value={h.title} maxLength={30}
                onChange={(e) => setHighlightTitle(i, e.target.value)} />
            </label>
          ))}
        </section>

        <section className="cp-group">
          <h3>Post</h3>
          <label className="cp-field">
            <span className="cp-label">Select post</span>
            <select value={postId} onChange={(e) => setPostId(e.target.value)}>
              {posts.map((p, i) => (
                <option key={p.id} value={p.id}>{`#${i + 1} · ${p.type}`}</option>
              ))}
            </select>
          </label>
          <div className="cp-field">
            <span className="cp-label">Image</span>
            <ImagePicker src={post.image} onChange={(url) => setPostImage(post.id, url)} />
          </div>
          <label className="cp-field">
            <span className="cp-label">
              Caption{' '}
              <span className="cp-hint">
                {cap.truncated
                  ? `cuts at ${LIMITS.CAPTION_PREVIEW} → "… more"`
                  : `${post.caption.length} chars`}
              </span>
            </span>
            <textarea rows={4} value={post.caption}
              onChange={(e) => setPostCaption(post.id, e.target.value)} />
          </label>
        </section>
      </div>
    </aside>
  )
}
