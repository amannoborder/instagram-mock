import { ICONS, VERIFIED } from '../lib/icons.js'

// Renders an SVG-string icon. The wrapper is display:contents (see styles.css),
// so the <svg> participates in layout directly — same box tree as the original.
export default function Icon({ html, className }) {
  return (
    <span
      className={className ? `ic-slot ${className}` : 'ic-slot'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Convenience: <Ic name="heart" opts={{ w: 12 }} />
export function Ic({ name, opts, className }) {
  return <Icon html={ICONS[name](opts)} className={className} />
}

// Verified blue badge, rendered only when `show` is truthy.
export function Verified({ show, size = 13 }) {
  if (!show) return null
  return <Icon html={VERIFIED(size)} />
}
