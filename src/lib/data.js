// data.js — the post-plan that feeds the mock. This is the shape the future
// controls panel will edit.
//
// Images are pulled from Lorem Picsum (https://picsum.photos) — a free, no-auth
// stock-photo source. Each URL is *seeded*, so the same picture loads every time
// (deterministic). Swap these for your real renders when the post-plan is ready.
const img = (seed, w, h) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const ACCOUNT = {
  username: 'aurelia.atelier',          // ≤ 30
  displayName: 'Aurelia · AI Atelier',
  verified: true,
  category: 'Digital creator',
  note: 'Today’s vibe…',                  // the "Note" bubble shown above the avatar
  // Bio deliberately probes the 150-char cap. Anything past 150 is clipped.
  bio:
    'Synthetic muse & curator ✦ AI-generated couture drops weekly\n' +
    'Collection account — every look is rendered, never worn\n' +
    'New capsule → Fridays 6pm GMT',
  links: [{ label: 'aurelia.studio/drops', url: '#' }],
  avatar: img('aurelia-avatar', 240, 240),
  stats: { posts: 0, followers: 184200, following: 12 }, // posts filled below
  // Drives the Professional Dashboard card (Creator/Business accounts, owner view).
  reachLast30Days: 612400,
  // Story highlights — titles probe the ~15-char truncation.
  highlights: [
    { title: 'SS26 Capsule Edit', cover: img('hl-capsule', 200, 200) },
    { title: 'Behind the Render', cover: img('hl-render', 200, 200) },
    { title: 'Press', cover: img('hl-press', 200, 200) },
    { title: 'Atelier Process', cover: img('hl-atelier', 200, 200) },
    { title: 'FAQ', cover: img('hl-faq', 200, 200) }
  ]
};

// The feed grid. Tiles render 3:4; in-feed media renders 4:5. Captions probe
// the ~125-char "… more" cut.
export const POSTS = [
  {
    id: 'p1',
    image: img('look-liquid-chrome', 800, 1000),
    type: 'carousel',
    likes: 21430,
    caption:
      'Drop 01 — “Liquid Chrome”. Rendered in a single overnight pass, then ' +
      'hand-graded for that wet-metal falloff. Swipe for the back seam and the ' +
      'detached collar study. Which colourway should make the capsule? 🤍',
    comments: [
      { user: 'studio.noor', text: 'the chrome falloff is unreal 🔥', verified: false },
      { user: 'render.daily', text: 'collar study >>> please drop the wires', verified: true }
    ],
    time: '2 HOURS AGO'
  },
  {
    id: 'p2',
    image: img('look-organza', 800, 1000),
    type: 'image',
    likes: 9820,
    caption: 'Sunbleached organza test. No retouch on the light — straight render. ☀️',
    comments: [{ user: 'atelier.kim', text: 'the translucency 😮‍💨', verified: false }],
    time: '6 HOURS AGO'
  },
  {
    id: 'p3',
    image: img('look-aero-gown', 800, 1000),
    type: 'reel',
    likes: 53110,
    views: 412000,
    caption:
      'Turntable for the “Aero” gown — 9:16, full 360. Cloth sim took 14 hours ' +
      'and it was worth every frame. Sound on for the seam-stress soundtrack. 🎧',
    comments: [{ user: 'cgi.couture', text: 'the cloth sim is buttery', verified: true }],
    time: '1 DAY AGO'
  },
  { id: 'p4', image: img('look-velvet-noir', 800, 1000), type: 'image', likes: 7340,
    caption: 'Velvet noir, matte subsurface.', comments: [], time: '1 DAY AGO' },
  { id: 'p5', image: img('look-glass-knit', 800, 1000), type: 'carousel', likes: 11200,
    caption: 'Glass-knit study, 3 ways.', comments: [], time: '2 DAYS AGO' },
  { id: 'p6', image: img('look-petalwork', 800, 1000), type: 'image', likes: 6010,
    caption: 'Petalwork bodice.', comments: [], time: '2 DAYS AGO' },
  { id: 'p7', image: img('look-nightfall', 800, 1000), type: 'reel', likes: 38900,
    views: 256000, caption: 'Nightfall walk cycle.', comments: [], time: '3 DAYS AGO' },
  { id: 'p8', image: img('look-sandcast', 800, 1000), type: 'image', likes: 4720,
    caption: 'Sand-cast accessories.', comments: [], time: '4 DAYS AGO' },
  { id: 'p9', image: img('look-iridescent', 800, 1000), type: 'image', likes: 8150,
    caption: 'Iridescent shell coat.', comments: [], time: '5 DAYS AGO' },
  { id: 'p10', image: img('look-pearl-drip', 800, 1000), type: 'carousel', likes: 9930,
    caption: 'Pearl-drip gloves.', comments: [], time: '6 DAYS AGO' },
  { id: 'p11', image: img('look-cloudweave', 800, 1000), type: 'image', likes: 5400,
    caption: 'Cloudweave cape.', comments: [], time: '1 WEEK AGO' },
  { id: 'p12', image: img('look-rose-latex', 800, 1000), type: 'image', likes: 7600,
    caption: 'Rosé latex sculpt.', comments: [], time: '1 WEEK AGO' }
];

ACCOUNT.stats.posts = POSTS.length;

// A few extra story avatars so the tray reads like a real feed.
function seedStories() {
  return [
    { user: 'studio.noor', avatar: img('studio-noor', 160, 160), verified: false, segments: [img('story-noor', 800, 1400)] },
    { user: 'render.daily', avatar: img('render-daily', 160, 160), verified: true, segments: [img('story-render', 800, 1400)] },
    { user: 'cgi.couture', avatar: img('cgi-couture', 160, 160), verified: true, segments: [img('story-cgi', 800, 1400)] },
    { user: 'atelier.kim', avatar: img('atelier-kim', 160, 160), verified: false, segments: [img('story-kim', 800, 1400)] }
  ];
}

// Active stories (the avatar ring / stories tray).
export const STORIES = [
  { user: ACCOUNT.username, avatar: ACCOUNT.avatar, verified: true,
    segments: [img('story-drop-1', 800, 1400), img('story-drop-2', 800, 1400)] }
];

// The full tray, in render order (own story first, then seeded accounts).
export const ALL_STORIES = STORIES.concat(seedStories());

// Reels feed (9:16).
export const REELS = POSTS.filter(p => p.type === 'reel');
