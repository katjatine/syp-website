// Icons from Lucide (https://lucide.dev), lucide-static v1.52.0, ISC licence, (c) Lucide Contributors.
// The licence allows free use on a website without credit on the page; keeping this notice in the source is enough.
// Tine prefers icons from free sets over self-drawn ones (memory "iconen uit vrije sets"); the Join and Youth voices
// icons in lib/line-icons.js already use Lucide shapes, scaled to their 48 grid.
//
// Use in a template: {% icon "flag" %} or {% icon "play", "my-class" %}. Decorative only (aria-hidden):
// the text beside an icon always says what it means. They draw in currentColor on Lucide's own 24 grid;
// size and stroke width come from site.css (.icon). To add one: copy its elements from lucide-static (same version).
// Homepage after reviewer feedback (Tine, file 62, October 2026): Who we are, podcasts, the river.
// Join, How it works (reviewer feedback 12, October 2026): laptop, lightbulb, search and landmark, one per step.

const ICONS = {
  "route": [
    "<circle cx=\"6\" cy=\"19\" r=\"3\"/>",
    "<path d=\"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15\"/>",
    "<circle cx=\"18\" cy=\"5\" r=\"3\"/>"
  ],
  "landmark": [
    "<path d=\"M10 18v-7\"/>",
    "<path d=\"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z\"/>",
    "<path d=\"M14 18v-7\"/>",
    "<path d=\"M18 18v-7\"/>",
    "<path d=\"M3 22h18\"/>",
    "<path d=\"M6 18v-7\"/>"
  ],
  "flag": [
    "<path d=\"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528\"/>"
  ],
  "footprints": [
    "<path d=\"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z\"/>",
    "<path d=\"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z\"/>",
    "<path d=\"M16 17h4\"/>",
    "<path d=\"M4 13h4\"/>"
  ],
  "sparkles": [
    "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/>",
    "<path d=\"M20 2v4\"/>",
    "<path d=\"M22 4h-4\"/>",
    "<circle cx=\"4\" cy=\"20\" r=\"2\"/>"
  ],
  "megaphone": [
    "<path d=\"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z\"/>",
    "<path d=\"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14\"/>",
    "<path d=\"M8 6v8\"/>"
  ],
  "handshake": [
    "<path d=\"m11 17 2 2a1 1 0 1 0 3-3\"/>",
    "<path d=\"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4\"/>",
    "<path d=\"m21 3 1 11h-2\"/>",
    "<path d=\"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3\"/>",
    "<path d=\"M3 4h8\"/>"
  ],
  "play": [
    "<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\"/>"
  ],
  // The Pause/Play button under the moving photos on About (blocks/photo-ribbon.njk; Tine, file 63)
  "pause": [
    "<rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/>",
    "<rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/>"
  ],
  "headphones": [
    "<path d=\"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3\"/>"
  ],
  "sprout": [
    "<path d=\"M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3\"/>",
    "<path d=\"M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4\"/>",
    "<path d=\"M5 21h14\"/>"
  ],
  "sailboat": [
    "<path d=\"M10 2v15\"/>",
    "<path d=\"M7 22a4 4 0 0 1-4-4 1 1 0 0 1 1-1h16a1 1 0 0 1 1 1 4 4 0 0 1-4 4z\"/>",
    "<path d=\"M9.159 2.46a1 1 0 0 1 1.521-.193l9.977 8.98A1 1 0 0 1 20 13H4a1 1 0 0 1-.824-1.567z\"/>"
  ],
  "scroll-text": [
    "<path d=\"M15 12h-5\"/>",
    "<path d=\"M15 8h-5\"/>",
    "<path d=\"M19 17V5a2 2 0 0 0-2-2H4\"/>",
    "<path d=\"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3\"/>"
  ],
  "user-plus": [
    "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/>",
    "<circle cx=\"9\" cy=\"7\" r=\"4\"/>",
    "<line x1=\"19\" x2=\"19\" y1=\"8\" y2=\"14\"/>",
    "<line x1=\"22\" x2=\"16\" y1=\"11\" y2=\"11\"/>"
  ],
  // Join (reviewer feedback, October 2026): the photo at the top opens large; this corner mark says so on phones too
  "maximize-2": [
    "<path d=\"M15 3h6v6\"/>",
    "<path d=\"m21 3-7 7\"/>",
    "<path d=\"m3 21 7-7\"/>",
    "<path d=\"M9 21H3v-6\"/>"
  ],
  "laptop": [
    "<path d=\"M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z\"/>",
    "<path d=\"M20.054 15.987H3.946\"/>"
  ],
  "lightbulb": [
    "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"/>",
    "<path d=\"M9 18h6\"/>",
    "<path d=\"M10 22h4\"/>"
  ],
  "search": [
    "<path d=\"m21 21-4.34-4.34\"/>",
    "<circle cx=\"11\" cy=\"11\" r=\"8\"/>"
  ]
};

function icon(name, cls = "") {
  const parts = ICONS[name];
  if (!parts) throw new Error(`Unknown Lucide icon "${name}" (lib/lucide-icons.js)`);
  return `<svg class="icon icon-${name}${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${parts.join("")}</svg>`;
}

module.exports = { icon, ICON_NAMES: Object.keys(ICONS) };
