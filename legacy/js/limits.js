// limits.js — Instagram character limits & truncation behavior.
// Calibrated to the real IG mobile app. All screens pull from here so the
// truncation rules live in exactly one place (the controls panel will too).

export const LIMITS = {
  USERNAME: 30,        // IG handle hard cap
  BIO: 150,            // profile bio hard cap
  CAPTION_PREVIEW: 125,// caption collapses ~125 chars then "… more"
  HIGHLIGHT_TITLE: 15, // highlight cover title before truncation
  COMMENT_PREVIEW: 125 // comments collapse similarly
};

const ELLIPSIS = '…'; // …

// Hard cap with no affordance (username, bio). Returns the clamped string.
export function clamp(str = '', max) {
  const s = String(str);
  return s.length > max ? s.slice(0, max) : s;
}

// Highlight titles: IG silently cuts and appends an ellipsis character.
export function clampHighlight(str = '') {
  const s = String(str).trim();
  if (s.length <= LIMITS.HIGHLIGHT_TITLE) return s;
  return s.slice(0, LIMITS.HIGHLIGHT_TITLE - 1).trimEnd() + ELLIPSIS;
}

// Caption / comment collapse. Returns { head, tail, truncated }.
// IG keeps the whole caption on one logical line, shows ~125 chars, then a
// non-breaking "… more" affordance. Expanding reveals `tail`.
export function captionParts(str = '', max = LIMITS.CAPTION_PREVIEW) {
  const s = String(str);
  if (s.length <= max) return { head: s, tail: '', truncated: false };
  // Avoid slicing mid-word where reasonable (IG breaks on the char count,
  // but trimming a dangling partial word reads cleaner and stays ≤ max).
  let cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > max - 18) cut = cut.slice(0, lastSpace);
  return { head: cut, tail: s.slice(cut.length), truncated: true };
}

// Counts: IG abbreviates large numbers (1,234 / 12.3K / 1.2M).
export function abbreviateCount(n) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0).replace(/\.0$/, '') + 'K';
  if (n < 1000000) return Math.round(n / 1000) + 'K';
  if (n < 10000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return Math.round(n / 1000000) + 'M';
}

// Full counts (followers list style) get thousands separators.
export function withCommas(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
