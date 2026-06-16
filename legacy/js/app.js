// app.js — renders the phone-mock screens and wires navigation.
import { ACCOUNT, POSTS, STORIES, REELS } from './data.js';
import { ICONS, VERIFIED } from './icons.js';
import {
  LIMITS, clamp, clampHighlight, captionParts, abbreviateCount, withCommas
} from './limits.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// ---- helpers ----------------------------------------------------------
const handle = clamp(ACCOUNT.username, LIMITS.USERNAME);
const verifiedMark = (cond, size = 13) => (cond ? VERIFIED(size) : '');

// ---- PROFILE screen ---------------------------------------------------
function renderProfile() {
  const a = ACCOUNT;
  const bio = clamp(a.bio, LIMITS.BIO);
  const body = el(`<div class="body" data-screen="profile"></div>`);

  body.append(el(`
    <div class="profile-top">
      <div class="profile-id-row">
        <div class="avatar-wrap">
          <div class="avatar-ring"><img src="${a.avatar}" alt=""></div>
          <div class="avatar-plus">${ICONS.add()}</div>
        </div>
        <div class="stats">
          <div><div class="num">${a.stats.posts}</div><div class="label">posts</div></div>
          <div><div class="num">${abbreviateCount(a.stats.followers)}</div><div class="label">followers</div></div>
          <div><div class="num">${a.stats.following}</div><div class="label">following</div></div>
        </div>
      </div>
    </div>`));

  body.append(el(`
    <div class="profile-bio">
      <div class="profile-name">${handle} ${verifiedMark(a.verified)}</div>
      <div class="profile-cat">${a.category}</div>
      <div class="profile-text">${escapeHtml(bio)}</div>
      ${a.links.map(l => `<a class="profile-link" href="${l.url}">${ICONS.share({ w: 14 })} ${l.label}</a>`).join('')}
      <div class="bio-count">${bio.length}/${LIMITS.BIO} bio chars</div>
    </div>`));

  body.append(el(`
    <div class="action-row">
      <button class="btn primary">Follow</button>
      <button class="btn grey">Message</button>
      <button class="btn grey icon">${ICONS.add({ w: 18 })}</button>
    </div>`));

  // Highlights (probe ~15-char truncation)
  const hls = el(`<div class="highlights"></div>`);
  hls.append(el(`<div class="hl"><div class="hl-cover hl-new">${ICONS.add({ w: 26 })}</div><div class="hl-title">New</div></div>`));
  a.highlights.forEach(h => {
    hls.append(el(`<div class="hl">
      <div class="hl-cover"><img src="${h.cover}" alt=""></div>
      <div class="hl-title" title="${escapeHtml(h.title)}">${escapeHtml(clampHighlight(h.title))}</div>
    </div>`));
  });
  body.append(hls);

  // Tabs
  const tabs = el(`
    <div class="tabs">
      <div class="tab active" data-tab="grid">${ICONS.grid()}</div>
      <div class="tab" data-tab="reels">${ICONS.reels()}</div>
      <div class="tab" data-tab="tagged">${ICONS.tagged()}</div>
    </div>`);
  body.append(tabs);

  // Grid
  const grid = el(`<div class="grid"></div>`);
  POSTS.forEach(p => {
    const badge = p.type === 'carousel' ? ICONS.carousel()
      : p.type === 'reel' ? ICONS.reels({ w: 19 }) : '';
    const views = p.type === 'reel' && p.views
      ? `<div class="tile-views">${ICONS.play({ w: 15 })}${abbreviateCount(p.views)}</div>` : '';
    const tile = el(`<div class="tile" data-post="${p.id}">
      <img src="${p.image}" alt="">
      ${badge ? `<div class="tile-badge">${badge}</div>` : ''}
      ${views}
    </div>`);
    tile.addEventListener('click', () => openPostDetail(p.id));
    grid.append(tile);
  });
  body.append(grid);

  // Tab switching (grid ↔ reels-only)
  tabs.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    tabs.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === t));
    const which = t.dataset.tab;
    grid.querySelectorAll('.tile').forEach(tile => {
      const p = POSTS.find(pp => pp.id === tile.dataset.post);
      const show = which === 'grid' || (which === 'reels' && p.type === 'reel') || (which === 'tagged' && false);
      tile.classList.toggle('hidden', !show);
    });
  }));

  return body;
}

// ---- FEED (home) screen ----------------------------------------------
function renderFeed() {
  const body = el(`<div class="body" data-screen="feed"></div>`);

  // Stories tray
  const tray = el(`<div class="feed-stories"></div>`);
  tray.append(el(`<div class="fstory"><div class="ring me"><img src="${ACCOUNT.avatar}" alt=""></div><div class="name">Your story</div></div>`));
  STORIES.concat(seedStories()).forEach((s, i) => {
    const f = el(`<div class="fstory"><div class="ring"><img src="${s.avatar}" alt=""></div><div class="name">${clamp(s.user, LIMITS.USERNAME)}</div></div>`);
    f.addEventListener('click', () => openStory(i));
    tray.append(f);
  });
  body.append(tray);

  // Posts
  POSTS.slice(0, 4).forEach(p => body.append(renderPostCard(p)));
  return body;
}

function renderPostCard(p) {
  const card = el(`<div class="post" data-post="${p.id}"></div>`);
  card.append(el(`
    <div class="post-head">
      <div class="pa-ring"><img src="${ACCOUNT.avatar}" alt=""></div>
      <div class="pa-meta">
        <div class="pa-user">${handle} ${verifiedMark(ACCOUNT.verified, 12)}</div>
        ${p.type === 'reel' ? '<div class="pa-sub">Original audio</div>' : ''}
      </div>
      ${ICONS.more()}
    </div>`));

  card.append(el(`
    <div class="post-media">
      <img src="${p.image}" alt="">
      ${p.type === 'carousel' ? `<div class="car-count">1/3</div>
        <div class="carousel-dots"><i class="on"></i><i></i><i></i></div>` : ''}
    </div>`));

  card.append(el(`
    <div class="post-actions">
      <div class="left">${ICONS.heart()} ${ICONS.comment()} ${ICONS.share()}</div>
      <div class="spacer"></div>
      ${ICONS.save()}
    </div>`));

  card.append(el(`<div class="post-likes">${withCommas(p.likes)} likes</div>`));
  card.append(renderCaption(p));

  if (p.comments?.length) {
    card.append(el(`<div class="post-comments">
      <div class="view-all">View all ${p.comments.length} comments</div>
      ${p.comments.map(c => `<div class="cmt"><b>${clamp(c.user, LIMITS.USERNAME)}</b>${escapeHtml(c.text)}</div>`).join('')}
    </div>`));
  }
  card.append(el(`<div class="post-time">${p.time}</div>`));
  return card;
}

// Caption with live ~125-char "… more" truncation + expand.
function renderCaption(p) {
  const { head, tail, truncated } = captionParts(p.caption, LIMITS.CAPTION_PREVIEW);
  const wrap = el(`<div class="post-caption"><span class="cap-user">${handle}</span><span class="cap-text"></span></div>`);
  const textSpan = $('.cap-text', wrap);
  textSpan.textContent = head;
  if (truncated) {
    const more = el(`<span class="cap-more">… more</span>`);
    more.addEventListener('click', () => { textSpan.textContent = head + tail; more.remove(); });
    wrap.append(more);
  }
  return wrap;
}

// ---- POST DETAIL screen ----------------------------------------------
function openPostDetail(id) {
  const p = POSTS.find(x => x.id === id);
  const scr = el(`<div class="overlay light show" id="post-detail-overlay"></div>`);
  const header = el(`
    <div class="detail-header">
      <span class="back-btn">${ICONS.back()}</span>
      <div class="dh-titles"><div class="dh-sub">${handle}</div><div class="dh-main">Posts</div></div>
    </div>`);
  $('.back-btn', header).addEventListener('click', () => scr.remove());
  const body = el(`<div class="body"></div>`);
  body.append(renderPostCard(p));
  scr.append(header, body);
  $('.screen').append(scr);
}

// ---- STORIES overlay --------------------------------------------------
function openStory(idx) {
  const all = STORIES.concat(seedStories());
  const s = all[idx] || all[0];
  const segs = s.segments || [s.avatar];
  let cur = 0;
  const ov = el(`<div class="overlay show" id="story-overlay"></div>`);

  const segBar = segs.map((_, i) => `<div class="seg ${i < cur ? 'done' : i === cur ? 'active' : ''}"><div class="fill"></div></div>`).join('');
  ov.innerHTML = `
    <div class="story-progress">${segBar}</div>
    <div class="story-head">
      <img class="sa" src="${s.avatar}" alt="">
      <div class="su">${clamp(s.user, LIMITS.USERNAME)} ${verifiedMark(s.verified, 13)}</div>
      <div class="st">2h</div>
      <div style="flex:1"></div>
      <span class="close-story">${ICONS.close({ stroke: '#fff' })}</span>
    </div>
    <div class="story-img"><img src="${segs[cur]}" alt=""></div>
    <div class="story-reply">
      <div class="field">Reply to ${clamp(s.user, LIMITS.USERNAME)}…</div>
      ${ICONS.heart({ stroke: '#fff' })}
      ${ICONS.share({ stroke: '#fff' })}
    </div>`;

  const img = $('.story-img img', ov);
  const segEls = ov.querySelectorAll('.story-progress .seg');
  const advance = () => {
    if (cur < segs.length - 1) {
      segEls[cur].classList.remove('active'); segEls[cur].classList.add('done');
      cur++; segEls[cur].classList.add('active'); img.src = segs[cur];
    } else { ov.remove(); }
  };
  let timer = setTimeout(advance, 5000);
  img.addEventListener('click', () => { clearTimeout(timer); advance(); timer = setTimeout(advance, 5000); });
  $('.close-story', ov).addEventListener('click', () => { clearTimeout(timer); ov.remove(); });
  $('.screen').append(ov);
}

// ---- REELS overlay ----------------------------------------------------
function openReels() {
  const r = REELS[0] || POSTS[0];
  const { head, tail, truncated } = captionParts(r.caption, LIMITS.CAPTION_PREVIEW);
  const ov = el(`<div class="overlay show" id="reels-overlay"></div>`);
  ov.innerHTML = `
    <div class="reel">
      <div class="reel-bg"><img src="${r.image}" alt=""></div>
      <div class="reel-top">
        <div class="rt-title">Reels</div>
        <span class="close-reel">${ICONS.close({ stroke: '#fff' })}</span>
      </div>
      <div class="reel-rail">
        <div class="rr">${ICONS.heart({ stroke: '#fff' })}<span>${abbreviateCount(r.likes)}</span></div>
        <div class="rr">${ICONS.comment({ stroke: '#fff' })}<span>${abbreviateCount(r.comments?.length ? 1200 : 340)}</span></div>
        <div class="rr">${ICONS.share({ stroke: '#fff' })}<span>${abbreviateCount(890)}</span></div>
        <div class="rr">${ICONS.more({ stroke: '#fff' })}</div>
        <div class="rr-audio"><img src="${ACCOUNT.avatar}" alt=""></div>
      </div>
      <div class="reel-meta">
        <div class="ru"><img src="${ACCOUNT.avatar}" alt=""> ${handle} ${verifiedMark(ACCOUNT.verified, 12)} <span class="followbtn">Follow</span></div>
        <div class="rcap"><span class="rcap-text"></span></div>
        <div class="raudio">${ICONS.audio({ w: 15, stroke: '#fff' })} ${handle} · Original audio</div>
      </div>
    </div>`;
  const t = $('.rcap-text', ov); t.textContent = head;
  if (truncated) {
    const more = el(`<span class="cap-more"> … more</span>`);
    more.addEventListener('click', () => { t.textContent = head + tail; more.remove(); });
    $('.rcap', ov).append(more);
  }
  $('.close-reel', ov).addEventListener('click', () => ov.remove());
  $('.screen').append(ov);
}

// ---- App shell / nav --------------------------------------------------
const SCREENS = { profile: renderProfile, feed: renderFeed };
let currentScreen = 'profile';

function mountScreen(name) {
  currentScreen = name;
  const old = $('.body');
  const fresh = SCREENS[name]();
  old.replaceWith(fresh);
  renderHeader(name);
  syncNav(name);
}

function renderHeader(name) {
  const host = $('.app-header');
  if (name === 'feed') {
    host.innerHTML = `
      <div class="brand">Instagram</div>
      <div class="h-actions">
        <span class="badge-dot">${ICONS.heart()}</span>
        ${ICONS.share()}
      </div>`;
  } else {
    host.innerHTML = `
      <div class="h-title">${ICONS.lock({ w: 16 })} ${handle} ${ICONS.chevron({ w: 18 })}</div>
      <div class="h-actions">${ICONS.newPost()} ${ICONS.menu()}</div>`;
  }
}

function syncNav(name) {
  // Swap the home glyph between outline / filled to mirror IG's active state.
  $('#nav-home').innerHTML = name === 'feed' ? ICONS.homeFill() : ICONS.home();
}

function buildNav() {
  const nav = $('.bottom-nav');
  const items = [
    ['nav-home', name => name === 'feed' ? ICONS.homeFill() : ICONS.home(), () => mountScreen('feed')],
    ['nav-search', () => ICONS.search(), () => mountScreen('feed')],
    ['nav-reels', () => ICONS.reels(), openReels],
    ['nav-shop', () => ICONS.shop(), () => {}],
    ['nav-profile', () => `<img class="nav-avatar" src="${ACCOUNT.avatar}" alt="">`, () => mountScreen('profile')]
  ];
  items.forEach(([id, render, onClick]) => {
    const it = el(`<div class="nav-item" id="${id}">${render(currentScreen)}</div>`);
    it.addEventListener('click', onClick);
    nav.append(it);
  });
}

// ---- utilities --------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// A few extra story avatars so the tray reads like a real feed.
function seedStories() {
  const grad = (c1, c2) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='${c1}'/><circle cx='60' cy='60' r='44' fill='${c2}'/></svg>`);
  return [
    { user: 'studio.noor', avatar: grad('#ee2a7b', '#fff'), verified: false, segments: [grad('#ee2a7b', '#6228d7')] },
    { user: 'render.daily', avatar: grad('#22c1c3', '#fff'), verified: true, segments: [grad('#22c1c3', '#fdbb2d')] },
    { user: 'cgi.couture', avatar: grad('#a18cd1', '#fff'), verified: true, segments: [grad('#a18cd1', '#fbc2eb')] },
    { user: 'atelier.kim', avatar: grad('#30cfd0', '#fff'), verified: false, segments: [grad('#30cfd0', '#330867')] }
  ];
}

// ---- boot -------------------------------------------------------------
buildNav();
// Hash deep-links (handy for review: #feed, #profile, #reels, #story, #post=p3)
function route() {
  const h = location.hash.slice(1);
  const [key, val] = h.split('=');
  if (key === 'feed') mountScreen('feed');
  else mountScreen('profile');
  if (key === 'reels') openReels();
  else if (key === 'story') openStory(Number(val) || 0);
  else if (key === 'post') openPostDetail(val || POSTS[0].id);
}
route();
