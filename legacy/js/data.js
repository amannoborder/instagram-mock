// data.js — the post-plan that feeds the mock. This is the shape the future
// controls panel will edit. Images are generated SVG gradients (no network),
// so the mock renders identically offline and stays deterministic.

// Deterministic gradient "photo" generator → data URI. Keeps the mock
// self-contained (no live IG, no external image hosts).
function photo(c1, c2, label = '', angle = 135) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'>
    <defs><linearGradient id='g' gradientTransform='rotate(${angle})'>
      <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='400' height='500' fill='url(#g)'/>
    ${label ? `<text x='200' y='260' font-family='Arial' font-size='34' font-weight='700'
      fill='rgba(255,255,255,.92)' text-anchor='middle'>${label}</text>` : ''}
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const ACCOUNT = {
  username: 'aurelia.atelier',          // ≤ 30
  displayName: 'Aurelia · AI Atelier',
  verified: true,
  category: 'Digital creator',
  // Bio deliberately probes the 150-char cap. Anything past 150 is clipped.
  bio:
    'Synthetic muse & curator ✦ AI-generated couture drops weekly\n' +
    'Collection account — every look is rendered, never worn\n' +
    'New capsule → Fridays 6pm GMT',
  links: [{ label: 'aurelia.studio/drops', url: '#' }],
  avatar: photo('#f9ce34', '#ee2a7b', 'A', 90),
  stats: { posts: 0, followers: 184200, following: 12 }, // posts filled below
  // Story highlights — titles probe the ~15-char truncation.
  highlights: [
    { title: 'SS26 Capsule Edit', cover: photo('#fceabb', '#f8b500', '', 160) },
    { title: 'Behind the Render', cover: photo('#c2e9fb', '#a1c4fd', '', 160) },
    { title: 'Press', cover: photo('#e0c3fc', '#8ec5fc', '', 160) },
    { title: 'Atelier Process', cover: photo('#f4c4f3', '#fc67fa', '', 160) },
    { title: 'FAQ', cover: photo('#fbc2eb', '#a6c1ee', '', 160) }
  ]
};

// The feed grid. Tiles render 4:5. Captions probe the ~125-char "… more" cut.
export const POSTS = [
  {
    id: 'p1',
    image: photo('#ee2a7b', '#6228d7', 'LOOK 01'),
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
    image: photo('#f9ce34', '#ee2a7b', 'LOOK 02'),
    type: 'image',
    likes: 9820,
    caption: 'Sunbleached organza test. No retouch on the light — straight render. ☀️',
    comments: [{ user: 'atelier.kim', text: 'the translucency 😮‍💨', verified: false }],
    time: '6 HOURS AGO'
  },
  {
    id: 'p3',
    image: photo('#22c1c3', '#fdbb2d', 'LOOK 03'),
    type: 'reel',
    likes: 53110,
    views: 412000,
    caption:
      'Turntable for the “Aero” gown — 9:16, full 360. Cloth sim took 14 hours ' +
      'and it was worth every frame. Sound on for the seam-stress soundtrack. 🎧',
    comments: [{ user: 'cgi.couture', text: 'the cloth sim is buttery', verified: true }],
    time: '1 DAY AGO'
  },
  { id: 'p4', image: photo('#a18cd1', '#fbc2eb', 'LOOK 04'), type: 'image', likes: 7340,
    caption: 'Velvet noir, matte subsurface.', comments: [], time: '1 DAY AGO' },
  { id: 'p5', image: photo('#84fab0', '#8fd3f4', 'LOOK 05'), type: 'carousel', likes: 11200,
    caption: 'Glass-knit study, 3 ways.', comments: [], time: '2 DAYS AGO' },
  { id: 'p6', image: photo('#ff9a9e', '#fecfef', 'LOOK 06'), type: 'image', likes: 6010,
    caption: 'Petalwork bodice.', comments: [], time: '2 DAYS AGO' },
  { id: 'p7', image: photo('#30cfd0', '#330867', 'LOOK 07'), type: 'reel', likes: 38900,
    views: 256000, caption: 'Nightfall walk cycle.', comments: [], time: '3 DAYS AGO' },
  { id: 'p8', image: photo('#ffecd2', '#fcb69f', 'LOOK 08'), type: 'image', likes: 4720,
    caption: 'Sand-cast accessories.', comments: [], time: '4 DAYS AGO' },
  { id: 'p9', image: photo('#5ee7df', '#b490ca', 'LOOK 09'), type: 'image', likes: 8150,
    caption: 'Iridescent shell coat.', comments: [], time: '5 DAYS AGO' },
  { id: 'p10', image: photo('#d299c2', '#fef9d7', 'LOOK 10'), type: 'carousel', likes: 9930,
    caption: 'Pearl-drip gloves.', comments: [], time: '6 DAYS AGO' },
  { id: 'p11', image: photo('#accbee', '#e7f0fd', 'LOOK 11'), type: 'image', likes: 5400,
    caption: 'Cloudweave cape.', comments: [], time: '1 WEEK AGO' },
  { id: 'p12', image: photo('#ff758c', '#ff7eb3', 'LOOK 12'), type: 'image', likes: 7600,
    caption: 'Rosé latex sculpt.', comments: [], time: '1 WEEK AGO' }
];

ACCOUNT.stats.posts = POSTS.length;

// Active stories (the avatar ring / stories tray).
export const STORIES = [
  { user: ACCOUNT.username, avatar: ACCOUNT.avatar, verified: true,
    segments: [photo('#ee2a7b', '#6228d7', 'NEW DROP', 200), photo('#f9ce34', '#ee2a7b', '', 200)] }
];

// Reels feed (9:16).
export const REELS = POSTS.filter(p => p.type === 'reel');
