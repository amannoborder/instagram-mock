import { useState, useEffect } from 'react'
import { LIMITS, clamp } from '../lib/limits.js'
import { ICONS } from '../lib/icons.js'
import Icon, { Verified } from './Icon.jsx'
import { useStore } from '../store.jsx'

// Fullscreen story: segmented progress bar that auto-advances every 5s
// (tap the image to skip forward), plus the reply bar. Closes after the
// last segment, mirroring the original vanilla behavior.
export default function StoryOverlay({ idx, onClose }) {
  const { stories } = useStore()
  const s = stories[idx] || stories[0]
  const segs = s.segments || [s.avatar]
  const [cur, setCur] = useState(0)

  const advance = () => {
    setCur((c) => {
      if (c < segs.length - 1) return c + 1
      onClose()
      return c
    })
  }

  // 5s auto-advance per segment; restarts whenever `cur` changes.
  useEffect(() => {
    const t = setTimeout(advance, 5000)
    return () => clearTimeout(t)
  }, [cur, idx]) // eslint-disable-line react-hooks/exhaustive-deps

  const handle = clamp(s.user, LIMITS.USERNAME)

  return (
    <div className="overlay show" id="story-overlay">
      <div className="story-progress">
        {segs.map((_, i) => (
          <div className={`seg ${i < cur ? 'done' : i === cur ? 'active' : ''}`} key={i}>
            <div className="fill"></div>
          </div>
        ))}
      </div>

      <div className="story-head">
        <img className="sa" src={s.avatar} alt="" />
        <div className="su">{handle} <Verified show={s.verified} size={13} /></div>
        <div className="st">2h</div>
        <div style={{ flex: 1 }}></div>
        <span className="close-story" onClick={onClose}>
          <Icon html={ICONS.close({ stroke: '#fff' })} />
        </span>
      </div>

      <div className="story-img" onClick={advance}>
        <img src={segs[cur]} alt="" />
      </div>

      <div className="story-reply">
        <div className="field">Reply to {handle}…</div>
        <Icon html={ICONS.heart({ stroke: '#fff' })} />
        <Icon html={ICONS.share({ stroke: '#fff' })} />
      </div>
    </div>
  )
}
