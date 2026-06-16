import { useState } from 'react'
import { LIMITS, captionParts } from '../lib/limits.js'

// Caption with IG's ~125-char "… more" collapse. Tapping "… more" reveals tail.
// `variant="reel"` uses the reels caption classes (white text on media).
export default function Caption({ user, text, variant }) {
  const [expanded, setExpanded] = useState(false)
  const { head, tail, truncated } = captionParts(text, LIMITS.CAPTION_PREVIEW)

  if (variant === 'reel') {
    return (
      <div className="rcap">
        <span className="rcap-text">{expanded ? head + tail : head}</span>
        {truncated && !expanded && (
          <span className="cap-more" onClick={() => setExpanded(true)}> … more</span>
        )}
      </div>
    )
  }

  return (
    <div className="post-caption">
      <span className="cap-user">{user}</span>
      <span className="cap-text">{expanded ? head + tail : head}</span>
      {truncated && !expanded && (
        <span className="cap-more" onClick={() => setExpanded(true)}>… more</span>
      )}
    </div>
  )
}
