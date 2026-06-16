import { useState } from 'react'
import { LIMITS, clamp, clampHighlight, abbreviateCount } from '../lib/limits.js'
import { ICONS } from '../lib/icons.js'
import Icon, { Ic, Verified } from './Icon.jsx'
import { useStore } from '../store.jsx'

export default function Profile({ onOpenPost }) {
  const { account: a, posts: POSTS, handle } = useStore()
  const bio = clamp(a.bio, LIMITS.BIO)
  const [tab, setTab] = useState('grid')

  const visible = (p) =>
    tab === 'grid' || (tab === 'reels' && p.type === 'reel') // 'tagged' shows none

  return (
    <div className="body" data-screen="profile">
      <div className="profile-top">
        <div className="profile-id-row">
          <div className="avatar-wrap">
            {a.note && <div className="note-bubble">{a.note}</div>}
            <div className="avatar-ring"><img src={a.avatar} alt="" /></div>
            <div className="avatar-plus"><Ic name="add" /></div>
          </div>
          <div className="profile-id-main">
            {/* Display name sits above the stats, beside the avatar (current IG) */}
            <div className="profile-name">{a.displayName} <Verified show={a.verified} /></div>
            <div className="stats">
              <div><div className="num">{a.stats.posts}</div><div className="label">posts</div></div>
              <div><div className="num">{abbreviateCount(a.stats.followers)}</div><div className="label">followers</div></div>
              <div><div className="num">{a.stats.following}</div><div className="label">following</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-bio">
        <div className="profile-cat">{a.category}</div>
        <div className="profile-text">{bio}</div>
        {a.links.map((l, i) => (
          <a className="profile-link" href={l.url} key={i}>
            <Ic name="link" opts={{ w: 14 }} /> {l.label}
          </a>
        ))}
      </div>

      <div className="action-row">
        <button className="btn grey">Edit profile</button>
        <button className="btn grey">Share profile</button>
        <button className="btn grey icon"><Ic name="personAdd" opts={{ w: 18 }} /></button>
      </div>

      {/* Professional Dashboard — Creator/Business accounts, own-profile view */}
      <div className="pro-dashboard">
        <div className="pd-text">
          <div className="pd-title">Professional dashboard</div>
          <div className="pd-sub">{abbreviateCount(a.reachLast30Days)} accounts reached in the last 30 days</div>
        </div>
        <span className="pd-chev"><Ic name="chevronRight" opts={{ w: 18 }} /></span>
      </div>

      <div className="highlights">
        <div className="hl">
          <div className="hl-cover hl-new"><Ic name="add" opts={{ w: 26 }} /></div>
          <div className="hl-title">New</div>
        </div>
        {a.highlights.map((h, i) => (
          <div className="hl" key={i}>
            <div className="hl-cover"><img src={h.cover} alt="" /></div>
            <div className="hl-title" title={h.title}>{clampHighlight(h.title)}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        <div className={`tab ${tab === 'grid' ? 'active' : ''}`} onClick={() => setTab('grid')}>
          <Icon html={ICONS.grid()} />
        </div>
        <div className={`tab ${tab === 'reels' ? 'active' : ''}`} onClick={() => setTab('reels')}>
          <Icon html={ICONS.reels()} />
        </div>
        <div className={`tab ${tab === 'tagged' ? 'active' : ''}`} onClick={() => setTab('tagged')}>
          <Icon html={ICONS.tagged()} />
        </div>
      </div>

      <div className="grid">
        {POSTS.map((p) => (
          <div
            className={`tile ${visible(p) ? '' : 'hidden'}`}
            data-post={p.id}
            key={p.id}
            onClick={() => onOpenPost(p.id)}
          >
            <img src={p.image} alt="" />
            {p.type === 'carousel' && <div className="tile-badge"><Icon html={ICONS.carousel()} /></div>}
            {p.type === 'reel' && <div className="tile-badge"><Ic name="reels" opts={{ w: 19 }} /></div>}
            {p.type === 'reel' && p.views && (
              <div className="tile-views"><Ic name="play" opts={{ w: 15 }} />{abbreviateCount(p.views)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
