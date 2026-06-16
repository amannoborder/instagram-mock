import { Ic } from './Icon.jsx'
import { useStore } from '../store.jsx'

// Top app bar: the cursive "Instagram" wordmark on feed, the handle on profile.
export default function AppHeader({ screen }) {
  const { handle } = useStore()
  if (screen === 'feed') {
    // New 2026 layout: Create (+) sits at the top-left; DMs moved to the nav,
    // so the top-right keeps only Notifications (heart).
    return (
      <header className="app-header">
        <div className="h-left">
          <Ic name="newPost" />
          <div className="brand">Instagram</div>
        </div>
        <div className="h-actions">
          <span className="badge-dot"><Ic name="heart" /></span>
        </div>
      </header>
    )
  }
  // Profile bar: Create (+) on the left, centered handle, Threads + menu on the right.
  return (
    <header className="app-header profile-header">
      <div className="h-left">
        <Ic name="newPost" />
      </div>
      <div className="h-title">
        <Ic name="lock" opts={{ w: 16 }} /> <span className="handle">{handle}</span> <Ic name="chevron" opts={{ w: 18 }} />
      </div>
      <div className="h-actions">
        <Ic name="threads" /> <Ic name="menu" />
      </div>
    </header>
  )
}
