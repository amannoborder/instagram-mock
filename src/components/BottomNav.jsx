import { ICONS } from '../lib/icons.js'
import Icon from './Icon.jsx'
import { useStore } from '../store.jsx'

// Bottom tab bar — IG's new 2026 layout: Home · Reels · DMs · Search · Profile.
// (Create (+) has moved out of the bar to the feed top-left; Shop is gone.)
// The home glyph swaps outline ↔ filled to mirror IG's active state.
export default function BottomNav({ screen, onScreen, onReels }) {
  const { account } = useStore()
  return (
    <nav className="bottom-nav">
      <div className="nav-item" id="nav-home" onClick={() => onScreen('feed')}>
        <Icon html={screen === 'feed' ? ICONS.homeFill() : ICONS.home()} />
      </div>
      <div className="nav-item" id="nav-reels" onClick={onReels}>
        <Icon html={ICONS.reels()} />
      </div>
      <div className="nav-item nav-badge" id="nav-dms">
        <Icon html={ICONS.dm()} />
      </div>
      <div className="nav-item" id="nav-search" onClick={() => onScreen('feed')}>
        <Icon html={ICONS.search()} />
      </div>
      <div className="nav-item" id="nav-profile" onClick={() => onScreen('profile')}>
        <img className="nav-avatar" src={account.avatar} alt="" />
      </div>
    </nav>
  )
}
