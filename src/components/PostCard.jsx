import { ACCOUNT } from '../lib/data.js'
import { LIMITS, clamp, withCommas } from '../lib/limits.js'
import { Ic, Verified } from './Icon.jsx'
import Caption from './Caption.jsx'

const handle = clamp(ACCOUNT.username, LIMITS.USERNAME)

// A single feed post card: header, media, action row, likes, caption, comments.
export default function PostCard({ post }) {
  const p = post
  return (
    <div className="post" data-post={p.id}>
      <div className="post-head">
        <div className="pa-ring"><img src={ACCOUNT.avatar} alt="" /></div>
        <div className="pa-meta">
          <div className="pa-user">{handle} <Verified show={ACCOUNT.verified} size={12} /></div>
          {p.type === 'reel' && <div className="pa-sub">Original audio</div>}
        </div>
        <Ic name="more" />
      </div>

      <div className="post-media">
        <img src={p.image} alt="" />
        {p.type === 'carousel' && (
          <>
            <div className="car-count">1/3</div>
            <div className="carousel-dots"><i className="on"></i><i></i><i></i></div>
          </>
        )}
      </div>

      <div className="post-actions">
        <div className="left"><Ic name="heart" /> <Ic name="comment" /> <Ic name="share" /></div>
        <div className="spacer"></div>
        <Ic name="save" />
      </div>

      <div className="post-likes">{withCommas(p.likes)} likes</div>

      <Caption user={handle} text={p.caption} />

      {p.comments?.length > 0 && (
        <div className="post-comments">
          <div className="view-all">View all {p.comments.length} comments</div>
          {p.comments.map((c, i) => (
            <div className="cmt" key={i}><b>{clamp(c.user, LIMITS.USERNAME)}</b>{c.text}</div>
          ))}
        </div>
      )}

      <div className="post-time">{p.time}</div>
    </div>
  )
}
