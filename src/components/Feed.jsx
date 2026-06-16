import { LIMITS, clamp } from '../lib/limits.js'
import PostCard from './PostCard.jsx'
import { useStore } from '../store.jsx'

// Home/feed screen: own-story bubble + tray, then the first few post cards.
export default function Feed({ onOpenStory }) {
  const { account, posts, stories } = useStore()
  return (
    <div className="body" data-screen="feed">
      <div className="feed-stories">
        <div className="fstory">
          <div className="ring me"><img src={account.avatar} alt="" /></div>
          <div className="name">Your story</div>
        </div>
        {stories.map((s, i) => (
          <div className="fstory" key={i} onClick={() => onOpenStory(i)}>
            <div className="ring"><img src={s.avatar} alt="" /></div>
            <div className="name">{clamp(s.user, LIMITS.USERNAME)}</div>
          </div>
        ))}
      </div>

      {posts.slice(0, 4).map((p) => <PostCard post={p} key={p.id} />)}
    </div>
  )
}
