// Small line icons in the quiet style of the river drawings, for the five reasons on the Join page
// and the three recommendations on Youth voices.
// Decorative only (aria-hidden). They draw in currentColor; colour and size are set in site.css.
// Use in a template: {% lineIcon "voice" %}. In src/join.md every reason names its icon with "icon".
//
// The recommendation icons on Youth voices (dam, parkWater, route) come from free icon sets,
// drawn on a 24 grid and placed here on the 48 grid with a scale ("parts" below):
//   Lucide (https://lucide.dev), ISC licence, (c) Lucide Contributors: park, route, megaphone, video.
//   Hugeicons (https://hugeicons.com), free set, MIT licence, (c) Hugeicons: plant and dam (in "dam").
//   Tabler Icons (https://tabler.io/icons), v3.48.0, MIT licence, (c) Paweł Kuna: users-group (in "people").
// Join reasons after reviewer feedback (October 2026): "skills" (Lucide presentation: no drop that reads as blood),
// "people" (Tabler users-group: meeting people from three countries) and "fish" (Lucide fish: life back in the Scheldt).
// The licence allows free use on a website without credit on the page; keeping this notice in the source is enough.

const ICONS = {
  // Make your voice heard: a speech bubble with a small wave in it.
  voice: [
    "M10,9 H38 A6,6 0 0 1 44,15 V28 A6,6 0 0 1 38,34 H22 L14,41 V34 H10 A6,6 0 0 1 4,28 V15 A6,6 0 0 1 10,9 Z",
    "M13,22 C16,18.5 19.5,18.5 22,22 C24.5,25.5 28,25.5 31,22 C33,19.5 34.5,19.5 35,20",
  ],
  // Live something international: three circles, three countries.
  countries: ["M28,19 A11,11 0 1 1 6,19 A11,11 0 1 1 28,19 Z", "M42,19 A11,11 0 1 1 20,19 A11,11 0 1 1 42,19 Z", "M35,31 A11,11 0 1 1 13,31 A11,11 0 1 1 35,31 Z"],
  // Learn differently: a magnifying glass over a drop.
  explore: [
    "M33,20 A13,13 0 1 1 7,20 A13,13 0 1 1 33,20 Z",
    "M29.5,29.5 L43,43",
    "M20,12 C20,12 14.5,18.5 14.5,22 A5.5,5.5 0 0 0 25.5,22 C25.5,18.5 20,12 20,12 Z",
  ],
  // Do something for the river: a heart with a wave in it.
  care: [
    "M24,42 C24,42 5,30.5 5,17.5 A9.5,9.5 0 0 1 24,12.5 A9.5,9.5 0 0 1 43,17.5 C43,30.5 24,42 24,42 Z",
    "M13,24 C16,21 19,21 22,24 C25,27 28,27 31,24 C33,22 34.5,22 35.5,22.5",
  ],
  // Have a good time: the sun over the water.
  sun: [
    "M12,30 A12,12 0 0 1 36,30",
    "M24,9 V13 M10,16 L13,19 M38,16 L35,19 M4,30 H8 M40,30 H44",
    "M4,36 C8,33 12,33 16,36 C20,39 24,39 28,36 C32,33 36,33 40,36 C41.5,37 43,37.5 44,37.5",
    "M13,42 C16.5,39.5 20,39.5 24,42 C28,44.5 31.5,44.5 35,42",
  ],
  // Join, build real skills: a presentation board (Lucide "presentation").
  skills: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="M2 3h20"/>',
    '<path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/>',
    '<path d="m7 21 5-5 5 5"/>',
  ] }] },
  // Join, people from three countries: three people, one group (Tabler "users-group", without its invisible frame path).
  people: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>',
    '<path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"/>',
    '<path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>',
    '<path d="M17 10h2a2 2 0 0 1 2 2v1"/>',
    '<path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>',
    '<path d="M3 13v-1a2 2 0 0 1 2 -2h2"/>',
  ] }] },
  // Join, the Scheldt: a fish, for the life that came back to the river (Lucide "fish").
  fish: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>',
    '<path d="M18 12v.5"/>',
    '<path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/>',
    '<path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
    '<path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/>',
    '<path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>',
  ] }] },
  // Recommendation 1, natural and technical flood defences: a small plant beside a dam with the water against it,
  // nature first and then the dam (both Hugeicons, "plant" and "dam"; Tine's choice C, file 42, 2 Oct).
  dam: { parts: [
    { s: 1.05, x: -1.5, y: 11, els: [
      '<path d="M18 10s-6 4-6 11m-2.651-9.817a4.114 4.114 0 0 1-5.37-.388C1.555 8.372 2.039 3.04 2.039 3.04s5.333-.485 7.756 1.939a4.1 4.1 0 0 1 1.16 3.521"/>',
      '<path d="M14.964 12.818a3.656 3.656 0 0 1 .107-5.06c2.154-2.154 6.894-1.723 6.894-1.723s.43 4.74-1.724 6.894a3.65 3.65 0 0 1-2.741 1.068M6 7s6 5 6 14"/>',
    ] },
    { s: 1.05, x: 22, y: 11, els: [
      '<path d="M7.815 17.587L6.107 4.844c-.07-.519-.105-.779-.2-.987a1.46 1.46 0 0 0-.873-.788C4.822 3 4.569 3 4.064 3c-.574 0-.86 0-1.091.083c-.419.15-.748.491-.893.925C2 4.247 2 4.544 2 5.138V18c0 1.414 0 2.121.424 2.56s1.114.44 2.495.44c1.566 0 2.35 0 2.782-.515c.433-.515.326-1.31.114-2.898"/>',
      '<path d="M22 12c-.6-.5-1.2-1-2.5-1c-2.5 0-2.5 2-5 2c-2.6 0-2.4-2-5-2c-.924 0-1.507.273-2 .618M22 18c-.6-.5-1.2-1-2.5-1c-2.5 0-2.5 2-5 2c-2.6 0-2.4-2-5-2c-.633 0-1.106.128-1.5.32"/>',
    ] },
  ] },
  // Recommendation 2, public space for water and for people: a tree, a picnic table and the sun (Lucide "park")
  // above the long, slow wave of the earlier home-made icon (Tine's combination, 2 Oct).
  parkWater: {
    parts: [{ s: 1.5, x: 6, y: -1, els: [
      '<path d="M12 18h10M21 14h-8M15 14l-2 6M19 14l2 6"/>',
      '<path d="M13.248 9.998A4.5 4.5 0 0 0 11.75 8.6V8a1 1 0 0 0-7.5 0 4.9 4.9 0 0 0 2.25 9H8"/>',
      '<path d="M8 20v-5.922a2 2 0 0 0-.586-1.414L6.5 11.75M9.205 12.795 8 14"/>',
      '<circle cx="19" cy="6" r="2"/>',
    ] }],
    paths: ["M4,41 C8,38 12,38 16,41 C20,44 24,44 28,41 C32,38 36,38 40,41 C41.5,42 43,42.5 44,42.5"],
  },
  // Recommendation 3, the water system across borders: a route from upstream to downstream (Lucide "route"; Tine, 2 Oct).
  route: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<circle cx="6" cy="19" r="3"/>',
    '<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>',
    '<circle cx="18" cy="5" r="3"/>',
  ] }] },
  // News posts without a photo get a coloured tile with an icon (Tine's choice A, file 44).
  // Recruitment: a megaphone (Lucide "megaphone").
  megaphone: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="m3 11 18-5v12L3 14v-3z"/>',
    '<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  ] }] },
  // An online meeting: a video call (Lucide "video").
  video: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>',
    '<rect x="2" y="6" width="14" height="12" rx="2"/>',
  ] }] },
  // The Scheldt page: floods and drought (Lucide "waves"), drinkable water (Lucide "droplet"),
  // rights for the river (Lucide "scale").
  waves: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    '<path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    '<path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  ] }] },
  droplet: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  ] }] },
  scale: { parts: [{ s: 2, x: 0, y: 0, els: [
    '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>',
    '<path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>',
    '<path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  ] }] },
};

function lineIcon(name, cls = "") {
  const icon = ICONS[name];
  if (!icon) return "";
  const paths = Array.isArray(icon) ? icon : icon.paths || [];
  // Parts from a 24-grid icon set: scaled into the 48 grid. The stroke width is divided by the scale (inline,
  // so it wins over the stylesheet) to keep every line as thick as the home-made ones.
  const parts = (icon.parts || []).map((p) => {
    const w = `calc(var(--line-icon-stroke, 2.3px) / ${p.s})`;
    const els = p.els.map((e) => e.replace(/\/>$/, ` style="stroke-width:${w}"/>`)).join("");
    return `<g transform="translate(${p.x} ${p.y}) scale(${p.s})">${els}</g>`;
  }).join("");
  return `<svg class="line-icon line-icon-${name}${cls ? " " + cls : ""}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${parts}${paths.map((d) => `<path d="${d}"></path>`).join("")}</svg>`;
}

module.exports = { lineIcon };
