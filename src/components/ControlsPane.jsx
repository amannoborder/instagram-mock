// Controls panel — out of scope for now (per Rio). Reserves the left column;
// the post-plan inputs will live here and drive the mock on the right.
export default function ControlsPane() {
  return (
    <aside className="controls-pane" aria-label="Controls panel (placeholder)">
      <h2>Post Controls</h2>
      <div className="ph-tag">Placeholder · coming next</div>
      <p className="ph-note">
        Inputs for the post-plan (caption, username, bio, highlight titles,
        counts, media) will live here and drive the mock on the right in real time.
        Char-limit + truncation rules are already wired in.
         {/* <code>src/lib/limits.js</code>. */}
      </p>
      <div className="ph-skeleton" aria-hidden="true">
        <div className="sk"></div>
        <div className="sk"></div>
        <div className="sk tall"></div>
        <div className="sk"></div>
      </div>
    </aside>
  )
}
