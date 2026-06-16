// iOS-style status bar (time + signal / wifi / battery glyphs).
export default function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-right">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4" width="3" height="8" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.5c2.2 0 4.2.9 5.7 2.3l1.1-1.2A10 10 0 0 0 8.5 1 10 10 0 0 0 1.7 3.6l1.1 1.2A8 8 0 0 1 8.5 2.5Z"/><path d="M8.5 6c1.2 0 2.3.5 3.1 1.3l1.1-1.2A6 6 0 0 0 8.5 4.5 6 6 0 0 0 4.3 6.1l1.1 1.2A4.4 4.4 0 0 1 8.5 6Z"/><circle cx="8.5" cy="10" r="1.6"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke="currentColor" opacity=".5"/><rect x="3" y="3" width="16" height="6" rx="1.5" fill="currentColor"/><rect x="23" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".5"/></svg>
      </span>
    </div>
  )
}
