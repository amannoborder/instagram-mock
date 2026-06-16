import { ACCOUNT, POSTS, ALL_STORIES } from '../lib/data.js'
import { LIMITS, clamp } from '../lib/limits.js'
import PostCard from './PostCard.jsx'

// Home/feed screen: own-story bubble + tray, then the first few post cards.
export default function Feed({ onOpenStory }) {
  return (
    <div className="body" data-screen="feed">
      <div className="feed-stories">
        <div className="fstory">
          <div className="ring me"><img src={ACCOUNT.avatar} alt="" /></div>
          <div className="name">Your story</div>
        </div>
        {ALL_STORIES.map((s, i) => (
          <div className="fstory" key={i} onClick={() => onOpenStory(i)}>
            <div className="ring"><img src={s.avatar} alt="" /></div>
            <div className="name">{clamp(s.user, LIMITS.USERNAME)}</div>
          </div>
        ))}
      </div>

      {POSTS.slice(0, 4).map((p) => <PostCard post={p} key={p.id} />)}
    </div>
  )
}
