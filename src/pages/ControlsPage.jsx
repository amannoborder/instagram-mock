import { Link } from 'react-router-dom'
import ControlsPane from '../components/ControlsPane.jsx'
import PhoneMock from '../components/PhoneMock.jsx'

// The controls editor on its own page — form on the left, a live phone preview
// on the right (the store is shared, so edits show immediately).
export default function ControlsPage() {
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
