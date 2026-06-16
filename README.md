# IG Mock — phone-mock pane (React + Vite)

A visual-only, pixel-accurate replica of the current Instagram mobile UI, for
planning posts on an AI-influencer collection account. No live IG, no network —
calibrated to real IG screenshots and driven by a JSON post-plan.

```bash
npm install
npm run dev       # → http://localhost:8731  (auto-opens)
npm run build     # production bundle → dist/
npm run preview   # serve the built bundle
```

## Pages (react-router)
- **`/`** — the phone mock on its own (the clean deliverable view), in IG **dark
  mode**. Link to the controls page in the corner.
- **`/controls`** — the live editor: the controls form + a phone preview
  side-by-side.

The **controls are live** — inputs edit a shared store
([src/store.jsx](src/store.jsx)) that every mock screen reads from, so edits
(username, display name, bio, counts, highlight titles, captions, verified, note,
**uploaded images**) render in the phone preview in real time, with char-limit
counters + truncation driven by [src/lib/limits.js](src/lib/limits.js). The store
persists across the two pages (it sits above the router).

## Screens (all in the phone mock)
- **Profile** (default) — avatar w/ story ring, counts, bio, Follow/Message row,
  Highlights, tabs, 4:5 grid with carousel/reel badges + view counts.
- **Feed / Home** — Stories tray, post cards with caption truncation.
- **Opened post** — tap any grid tile (or `#post=p1`).
- **Stories** — 9:16, segmented progress, reply bar (`#story`).
- **Reels** — 9:16, right action rail, audio row (`#reels`, or Reels tab).
- **Highlights** — circular covers with ~15-char title truncation.

Deep-link any screen via hash: `#feed`, `#profile`, `#reels`, `#story`, `#post=p3`.

## Spec compliance (matches real IG)
| Target | Implementation |
| --- | --- |
| Feed tiles 4:5 portrait | `--tile-ratio: 4/5` |
| ~1.5px grid gaps | `--grid-gap: 1.5px` |
| Bio 150 chars | `clamp(bio, 150)` — see live counter on profile |
| Caption preview ~125 → "… more" | `captionParts()`, expands on tap |
| Username 30 chars | `clamp(name, 30)` |
| Highlight title ~15 chars | `clampHighlight()` → silent ellipsis |
| Stories / Reels 9:16 | fixed-ratio overlays |
| Verified badge, counts, follow/message, bottom nav | all present |

All limits + truncation live in one place: **`src/lib/limits.js`**.

## Project structure
```
index.html                 Vite entry (mounts #root)
vite.config.js             Vite + @vitejs/plugin-react
src/
  main.jsx                 React root
  App.jsx                  two-pane shell, phone frame, screen + overlay state
  styles.css               all visual calibration (ratios, gaps, IG type scale)
  lib/
    limits.js              char limits + truncation (the spec-critical module)
    data.js                the JSON post-plan (what the controls pane will edit)
    icons.js               IG-accurate inline SVG icons + verified badge
  components/
    Icon.jsx               renders SVG-string icons (display:contents wrapper)
    StatusBar.jsx          iOS status bar
    AppHeader.jsx          feed wordmark / profile handle header
    BottomNav.jsx          bottom tab bar
    Profile.jsx            profile screen (bio, highlights, tabs, grid)
    Feed.jsx               home feed (stories tray + post cards)
    PostCard.jsx           single post card (feed + opened-post)
    Caption.jsx            ~125-char "… more" caption (feed + reel variants)
    PostDetail.jsx         opened-post overlay
    StoryOverlay.jsx       9:16 story with segmented auto-advance
    ReelsOverlay.jsx       9:16 reel with action rail
    ControlsPane.jsx       left-column placeholder (out of scope for now)
legacy/                    original vanilla HTML/CSS/JS (pre-React), kept for reference
```

## Next: controls pane
The placeholder reserves the left column. Wiring it up = lift `ACCOUNT` / `POSTS`
into React state, render inputs that mutate them, and let the mock re-render.
Truncation is already centralized in `src/lib/limits.js`, so the controls
inherit the exact IG behavior for free.
