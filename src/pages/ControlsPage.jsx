import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ControlsPane from '../components/ControlsPane.jsx'
import PhoneMock from '../components/PhoneMock.jsx'
import { useStore } from '../store.jsx'

// The controls editor on its own page — form on the left, a live phone preview
// on the right (the store is shared, so edits show immediately).
export default function ControlsPage() {
  const { pausePolling, resumePolling } = useStore()

  // Pause manifest polling while editing so live re-fetches don't wipe edits.
  useEffect(() => {
    pausePolling()
    return () => resumePolling()
  }, [pausePolling, resumePolling])

  return (
    <div className="page workspace">
      <ControlsPane />
      <div className="preview-col">
        <Link className="page-link" to="/">← Back to mock</Link>
        <PhoneMock />
      </div>
    </div>
  )
}
