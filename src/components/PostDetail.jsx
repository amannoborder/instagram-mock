import { Ic } from './Icon.jsx'
import PostCard from './PostCard.jsx'
import { useStore } from '../store.jsx'

// Opened-post overlay (light): IG "Posts" header + the full post card.
export default function PostDetail({ id, onClose }) {
  const { posts, handle } = useStore()
  const p = posts.find((x) => x.id === id)
  if (!p) return null
  return (
    <div className="overlay light show" id="post-detail-overlay">
      <div className="detail-header">
        <span className="back-btn" onClick={onClose}><Ic name="back" /></span>
        <div className="dh-titles">
          <div className="dh-sub">{handle}</div>
          <div className="dh-main">Posts</div>
        </div>
      </div>
      <div className="body">
        <PostCard post={p} />
      </div>
    </div>
  )
}
