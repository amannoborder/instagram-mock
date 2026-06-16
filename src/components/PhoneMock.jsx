import { useState, useEffect } from 'react'
import { POSTS } from '../lib/data.js'
import StatusBar from './StatusBar.jsx'
import AppHeader from './AppHeader.jsx'
import BottomNav from './BottomNav.jsx'
import Profile from './Profile.jsx'
import Feed from './Feed.jsx'
import PostDetail from './PostDetail.jsx'
import StoryOverlay from './StoryOverlay.jsx'
import ReelsOverlay from './ReelsOverlay.jsx'

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

// The phone preview: device frame + screens + overlays. Reads all data from the
// shared store, so it stays in sync with the controls page.
export default function PhoneMock() {
  const [screen, setScreen] = useState('profile')
  const [overlay, setOverlay] = useState(null)

  useEffect(() => {
    const parsed = parseHash()
    setScreen(parsed.screen)
    setOverlay(parsed.overlay)
  }, [])

  const closeOverlay = () => setOverlay(null)

  return (
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
  )
}
