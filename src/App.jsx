import { useState, useEffect } from 'react'
import { POSTS } from './lib/data.js'
import StatusBar from './components/StatusBar.jsx'
import AppHeader from './components/AppHeader.jsx'
import BottomNav from './components/BottomNav.jsx'
import ControlsPane from './components/ControlsPane.jsx'
import Profile from './components/Profile.jsx'
import Feed from './components/Feed.jsx'
import PostDetail from './components/PostDetail.jsx'
import StoryOverlay from './components/StoryOverlay.jsx'
import ReelsOverlay from './components/ReelsOverlay.jsx'

// Parse the deep-link hash once (handy for review: #feed, #profile, #reels,
// #story[=idx], #post=p3). Returns the initial { screen, overlay }.
function parseHash() {
  const h = window.location.hash.slice(1)
  const [key, val] = h.split('=')
  const screen = key === 'feed' ? 'feed' : 'profile'
  let overlay = null
  if (key === 'reels') overlay = { type: 'reels' }
  else if (key === 'story') overlay = { type: 'story', idx: Number(val) || 0 }
  else if (key === 'post') overlay = { type: 'post', id: val || POSTS[0].id }
  return { screen, overlay }
}

export default function App() {
  const [screen, setScreen] = useState('profile')
  const [overlay, setOverlay] = useState(null)

  useEffect(() => {
    const { screen, overlay } = parseHash()
    setScreen(screen)
    setOverlay(overlay)
  }, [])

  const closeOverlay = () => setOverlay(null)

  return (
    <div className="workspace">
      {/* Pane 1: controls (out of scope — placeholder, left per Rio) */}
      <ControlsPane />

      {/* Pane 2: the phone mock */}
      <div className="device">
        <div className="screen">
          <div className="island"></div>
          <StatusBar />
          <AppHeader screen={screen} />

          {screen === 'feed'
            ? <Feed onOpenStory={(idx) => setOverlay({ type: 'story', idx })} />
            : <Profile onOpenPost={(id) => setOverlay({ type: 'post', id })} />}

          <BottomNav
            screen={screen}
            onScreen={setScreen}
            onReels={() => setOverlay({ type: 'reels' })}
          />

          <div className="home-indicator"></div>

          {overlay?.type === 'post' && <PostDetail id={overlay.id} onClose={closeOverlay} />}
          {overlay?.type === 'story' && <StoryOverlay idx={overlay.idx} onClose={closeOverlay} />}
          {overlay?.type === 'reels' && <ReelsOverlay onClose={closeOverlay} />}
        </div>
      </div>
    </div>
  )
}
