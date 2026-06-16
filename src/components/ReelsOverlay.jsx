import { ACCOUNT, POSTS, REELS } from '../lib/data.js'
import { LIMITS, clamp, abbreviateCount } from '../lib/limits.js'
import { ICONS } from '../lib/icons.js'
import Icon, { Ic, Verified } from './Icon.jsx'
import Caption from './Caption.jsx'

const handle = clamp(ACCOUNT.username, LIMITS.USERNAME)

// Fullscreen reel: media, right action rail (like/comment/share/audio),
// and the meta row with follow button, caption, and audio attribution.
export default function ReelsOverlay({ onClose }) {
  const r = REELS[0] || POSTS[0]
  return (
    <div className="overlay show" id="reels-overlay">
      <div className="reel">
        <div className="reel-bg"><img src={r.image} alt="" /></div>

        <div className="reel-top">
          <div className="rt-title">Reels</div>
          <span className="close-reel" onClick={onClose}>
            <Icon html={ICONS.close({ stroke: '#fff' })} />
          </span>
        </div>

        <div className="reel-rail">
          <div className="rr"><Icon html={ICONS.heart({ stroke: '#fff' })} /><span>{abbreviateCount(r.likes)}</span></div>
          <div className="rr"><Icon html={ICONS.comment({ stroke: '#fff' })} /><span>{abbreviateCount(r.comments?.length ? 1200 : 340)}</span></div>
          <div className="rr"><Icon html={ICONS.share({ stroke: '#fff' })} /><span>{abbreviateCount(890)}</span></div>
          <div className="rr"><Icon html={ICONS.more({ stroke: '#fff' })} /></div>
          <div className="rr-audio"><img src={ACCOUNT.avatar} alt="" /></div>
        </div>

        <div className="reel-meta">
          <div className="ru">
            <img src={ACCOUNT.avatar} alt="" /> {handle} <Verified show={ACCOUNT.verified} size={12} />
            <span className="followbtn">Follow</span>
          </div>
          <Caption variant="reel" text={r.caption} />
          <div className="raudio">
            <Ic name="audio" opts={{ w: 15, stroke: '#fff' }} /> {handle} · Original audio
          </div>
        </div>
      </div>
    </div>
  )
}
