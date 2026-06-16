// icons.js — Instagram-accurate inline SVGs. Stroke icons use 24×24,
// stroke-width ~1.7 to match IG's outline weight.
// Each factory returns an SVG markup string; render it through <Icon html={...} />.
const s = (paths, opts = {}) =>
  `<svg aria-hidden="true" class="ic ${opts.cls || ''}" viewBox="0 0 24 24" width="${opts.w || 24}" height="${opts.h || 24}"
     fill="${opts.fill || 'none'}" stroke="${opts.stroke || 'currentColor'}"
     stroke-width="${opts.sw || 1.7}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const ICONS = {
  home: (o) => s('<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/>', o),
  homeFill: (o) => s('<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/>', { ...o, fill: 'currentColor', stroke: 'none' }),
  search: (o) => s('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>', o),
  reels: (o) => s('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 8h18M8.5 3 11 8M14 3l2.5 5"/><path d="m10.5 11 4.5 2.6-4.5 2.6Z" fill="currentColor" stroke="none"/>', o),
  shop: (o) => s('<path d="M6 8V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1"/><rect x="3" y="8" width="18" height="13" rx="2"/>', o),
  newPost: (o) => s('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>', o),
  menu: (o) => s('<path d="M4 7h16M4 12h16M4 17h16"/>', o),
  back: (o) => s('<path d="M15 5l-7 7 7 7"/>', o),
  close: (o) => s('<path d="M6 6l12 12M18 6 6 18"/>', o),
  heart: (o) => s('<path d="M12 20s-7-4.35-9.33-9.04C1.13 8 2.4 4.5 5.6 4.5c1.96 0 3.18 1.2 3.9 2.2.7-1 1.94-2.2 3.9-2.2 3.2 0 4.47 3.5 2.93 6.46C19 15.65 12 20 12 20Z"/>', o),
  heartFill: (o) => s('<path d="M12 20s-7-4.35-9.33-9.04C1.13 8 2.4 4.5 5.6 4.5c1.96 0 3.18 1.2 3.9 2.2.7-1 1.94-2.2 3.9-2.2 3.2 0 4.47 3.5 2.93 6.46C19 15.65 12 20 12 20Z"/>', { ...o, fill: '#ed4956', stroke: '#ed4956' }),
  comment: (o) => s('<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"/>', o),
  share: (o) => s('<path d="M22 3 11 14M22 3l-7 19-4-8-8-4Z"/>', o),
  save: (o) => s('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z"/>', o),
  saveFill: (o) => s('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z"/>', { ...o, fill: 'currentColor', stroke: 'currentColor' }),
  grid: (o) => s('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>', o),
  tagged: (o) => s('<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="10" r="2.4"/><path d="M8.5 17a3.5 3.5 0 0 1 7 0"/>', o),
  more: (o) => s('<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>', o),
  audio: (o) => s('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>', o),
  carousel: (o) => s('<rect x="7" y="3" width="14" height="14" rx="2.5" fill="#fff" stroke="#fff"/><rect x="3" y="7" width="14" height="14" rx="2.5" fill="none" stroke="#fff" stroke-width="2"/>', o),
  play: (o) => s('<path d="M8 5v14l11-7Z" fill="currentColor" stroke="none"/>', o),
  chevron: (o) => s('<path d="M6 9l6 6 6-6"/>', o),
  chevronRight: (o) => s('<path d="M9 5l7 7-7 7"/>', o),
  personAdd: (o) => s('<circle cx="9" cy="8" r="3.4"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M18.5 8v6M15.5 11h6"/>', o),
  add: (o) => s('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>', o),
  lock: (o) => s('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', o),
  // Threads wordless logo (simplified hook/@ shape).
  threads: (o) => s('<path d="M12.2 21c-5 0-8.2-3.3-8.2-9s3.3-9 8.2-9c3.4 0 5.8 1.4 7.1 3.9"/><path d="M12.4 17.4c2.3 0 3.7-1.1 3.7-3 0-2-1.7-3-3.9-2.9-1.9.1-3.1 1.1-3 2.7.1 1.6 1.5 2.4 3 2.4 2.6 0 4.4-1.6 4.4-4.6 0-1.5-.5-2.7-1.3-3.6"/>', o),
  // Bio link (chain) icon — IG uses this, not the paper-plane.
  link: (o) => s('<path d="M10.5 13.5 13.5 10.5"/><path d="M12 7.5 13.2 6.3a3.7 3.7 0 0 1 5.2 5.2L17 12.9"/><path d="M12 16.5 10.8 17.7a3.7 3.7 0 0 1-5.2-5.2L7 11.1"/>', o),
  // Direct messages glyph (the IG/Messenger paper-plane in a rounded chat bubble).
  dm: (o) => s('<path d="M12 3a9 8 0 0 0-9 8 7.4 7.4 0 0 0 1.3 4.2L3 21l5-1.6A9.6 9.6 0 0 0 12 19a9 8 0 0 0 0-16Z"/><path d="m8 11.5 8-2.5-2.6 7.6-2-3.1-3.4-2Z" stroke-width="1.4"/>', o),
};

// Verified blue badge (filled, IG's exact burst shape simplified).
export const VERIFIED = (size = 12) =>
  `<svg class="verified" viewBox="0 0 24 24" width="${size}" height="${size}" aria-label="Verified">
    <path fill="#3897f0" d="M12 1.5l2.6 2.1 3.3-.3 1 3.2 2.9 1.6-1 3.2 1 3.2-2.9 1.6-1 3.2-3.3-.3L12 22.5l-2.6-2.1-3.3.3-1-3.2L2.2 15.8l1-3.2-1-3.2 2.9-1.6 1-3.2 3.3.3z"/>
    <path fill="#fff" d="M10.6 15.2 7.3 12l1.3-1.3 2 2 4.1-4.4 1.4 1.3z"/>
  </svg>`;
