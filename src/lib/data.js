// data.js — the post-plan that feeds the mock. This is the shape the future
// controls panel will edit.
//
// Images are pulled from Lorem Picsum (https://picsum.photos) — a free, no-auth
// stock-photo source. Each URL is *seeded*, so the same picture loads every time
// (deterministic). Swap these for your real renders when the post-plan is ready.
const img = (seed, w, h) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

// Real feed renders, uploaded to ImageKit. Filenames are inconsistent on the
// bucket (mixed case, some with spaces), so map each post number to its exact
// file rather than assuming a pattern. NOTE: image 3 (Image3.png) currently
// 404s on the bucket — re-upload/rename it for that tile to load.
const IK_FILES = {
  1: 'Image1.png',
  2: 'image 2.png',
  3: 'Image3.png',
  4: 'Image4.png',
  5: 'Image5.png',
  6: 'image 6.png',
  7: 'Image 7.png',
  8: 'Image 8.png',
  9: 'Image 9.png',
  10: 'Image 10.png',
};
const ik = (n) => `https://ik.imagekit.io/xanalia/xana/diamond/${encodeURIComponent(IK_FILES[n])}`;

export const ACCOUNT = {
  username: 'eiwa.material',             // ≤ 30
  displayName: 'EIWA-MATERIAL',
  verified: true,
  category: 'Master Diamond Polishing',
  note: 'Triple Excellent ✨',             // the "Note" bubble shown above the avatar
  // Bio deliberately probes the 150-char cap. Anything past 150 is clipped.
  bio:
    'Triple Excellent, every time.\n' +
    'The value of a diamond is in its polish.\n' +
    'Work with us: 03-6381-7541 / info@eiwa-material.com',
  links: [{ label: 'info@eiwa-material.com', url: 'mailto:info@eiwa-material.com' }],
  avatar: ik(1),
  stats: { posts: 0, followers: 184200, following: 12 }, // posts filled below
  // Drives the Professional Dashboard card (Creator/Business accounts, owner view).
  reachLast30Days: 612400,
  // Story highlights — titles probe the ~15-char truncation.
  highlights: [
    { title: 'Polishing', cover: ik(2) },
    { title: 'Recutting', cover: ik(4) }
  ]
};

// The feed grid. Tiles render 3:4; in-feed media renders 4:5. Captions probe
// the ~125-char "… more" cut.
export const POSTS = [
  {
    id: 'p1',
    image: ik(1),
    type: 'image',
    likes: 21430,
    caption:
      'Three decades. One obsession: the perfect polish.\n' +
      'For 30 years, we’ve shaped the world’s highest-value diamonds — where ' +
      'trust is cut as precisely as the stone itself. ✨\n' +
      '#DiamondPolishing #30YearsOfTrust #EIWA #LuxuryDiamonds #JapaneseCraftsmanship',
    comments: [
      { user: 'maison.lumiere', text: 'thirty years of pure craft 🤍', verified: true },
      { user: 'rough.and.fire', text: 'the standard everyone measures against', verified: false }
    ],
    time: '2 HOURS AGO'
  },
  {
    id: 'p2',
    image: ik(2),
    type: 'image',
    likes: 18760,
    caption:
      'Consistently achieving Triple Excellent.\n' +
      'Cut. Polish. Symmetry. When all three reach Excellent, light has nowhere ' +
      'to hide. This is the standard we never compromise. 💎\n' +
      '#3EX #TripleExcellent #DiamondCut #BrillianceRedefined #EIWA',
    comments: [{ user: 'gem.optics', text: 'light has nowhere to hide — perfectly said', verified: false }],
    time: '6 HOURS AGO'
  },
  {
    id: 'p3',
    image: ik(3),
    type: 'image',
    likes: 24510,
    caption:
      'The world stops at 3EX. We begin there.\n' +
      'Our craftsmen pursue a level of precision the grading charts don’t even ' +
      'measure. 200× fewer polishing marks. 10–20× more light return.\n' +
      '#BeyondStandard #DiamondScience #PrecisionPolishing #EIWA #FineJewelry',
    comments: [{ user: 'carat.science', text: '200× fewer marks is wild 🔬', verified: true }],
    time: '1 DAY AGO'
  },
  {
    id: 'p4',
    image: ik(4),
    type: 'image',
    likes: 33980,
    caption:
      'A second life, a brighter shine.\n' +
      'Our recutting service revives tired or dated stones — restoring fire that ' +
      'time and old cuts had dimmed.\n' +
      '#DiamondRecutting #Restoration #SecondLife #EIWA #DiamondExperts',
    comments: [],
    time: '1 DAY AGO'
  },
  {
    id: 'p5',
    image: ik(5),
    type: 'image',
    likes: 15240,
    caption:
      'Cuts inspired by Japanese aesthetics.\n' +
      'Beyond the standard round — bespoke cuts born from the quiet discipline ' +
      'of Japanese design. 🌸\n' +
      '#OriginalCut #JapaneseAesthetics #BespokeDiamonds #EIWA #ArtOfTheCut',
    comments: [],
    time: '2 DAYS AGO'
  },
  {
    id: 'p6',
    image: ik(6),
    type: 'image',
    likes: 12880,
    caption:
      'Exceptional craftsmen, backed by 30 years of trust.\n' +
      'Every facet passes through experienced hands. Machines measure — masters decide.\n' +
      '#MasterCraftsman #DiamondPolisher #Handcrafted #EIWA #Artisan',
    comments: [],
    time: '2 DAYS AGO'
  },
  {
    id: 'p7',
    image: ik(7),
    type: 'image',
    likes: 28640,
    caption:
      'From rough selection to final polish.\n' +
      'The journey of a diamond is decided long before the first cut — it begins ' +
      'with choosing the right rough.\n' +
      '#RoughDiamond #DiamondJourney #FromRoughToFinal #EIWA #DiamondPolishing',
    comments: [],
    time: '3 DAYS AGO'
  },
  {
    id: 'p8',
    image: ik(8),
    type: 'image',
    likes: 19320,
    caption:
      '“God resides in the details.”\n' +
      'A single polishing mark, invisible to most, is everything to us. ' +
      'Perfection lives in what you cannot see.\n' +
      '#InTheDetails #Perfection #DiamondPolishing #EIWA #LuxuryCraft',
    comments: [],
    time: '4 DAYS AGO'
  },
  {
    id: 'p9',
    image: ik(9),
    type: 'image',
    likes: 17100,
    caption:
      'Trusted by the world’s diamond institutions.\n' +
      'From our factories to global vaults — the standard that the industry’s ' +
      'most demanding partners rely on.\n' +
      '#TrustedWorldwide #DiamondInstitutions #GlobalStandard #EIWA #FineDiamonds',
    comments: [],
    time: '5 DAYS AGO'
  },
  {
    id: 'p10',
    image: ik(10),
    type: 'image',
    likes: 22480,
    caption:
      'The value of a diamond is determined by its polish.\n' +
      'Entrust your diamonds to us — and let their true light be revealed. ✨\n' +
      '#DiamondValue #ThePolishMatters #EntrustYourDiamonds #EIWA #30YearsOfTrust',
    comments: [],
    time: '6 DAYS AGO'
  }
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

// The seeded (non-owner) stories, exported so the store can rebuild the tray
// after the owner's avatar/username change.
export const SEEDED_STORIES = seedStories();

// The full tray, in render order (own story first, then seeded accounts).
export const ALL_STORIES = STORIES.concat(SEEDED_STORIES);

// Reels feed (9:16).
export const REELS = POSTS.filter(p => p.type === 'reel');
