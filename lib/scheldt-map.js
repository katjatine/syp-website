// A small map of the Scheldt with one place marked, for the exchange pages.
// North is up: the source in France at the bottom, the sea in the Netherlands at the top left.
// The river widens on its way down, like the river timeline, and opens into the Western Scheldt.
//
// The course from Gouy to Antwerp comes from Natural Earth, 1:10m rivers (public domain, naturalearthdata.com).
// Natural Earth stops near Antwerp, so the Western Scheldt is drawn by hand along the fairway to Vlissingen.
// Points are [latitude, longitude].

const RIVER = [
  [49.991, 3.264], [50.008, 3.23], [50.025, 3.208], [50.046, 3.203], [50.075, 3.219], [50.09, 3.239], [50.107, 3.241],
  [50.118, 3.197], [50.131, 3.181], [50.152, 3.191], [50.173, 3.212], [50.223, 3.275], [50.279, 3.32], [50.306, 3.357],
  [50.32, 3.406], [50.315, 3.449], [50.327, 3.492], [50.346, 3.506], [50.386, 3.531], [50.432, 3.582], [50.445, 3.584],
  [50.462, 3.557], [50.501, 3.453], [50.521, 3.43], [50.566, 3.436], [50.587, 3.427], [50.617, 3.383], [50.658, 3.356],
  [50.684, 3.35], [50.717, 3.367], [50.747, 3.413], [50.832, 3.593], [50.878, 3.637], [50.9, 3.677], [50.917, 3.676],
  [50.933, 3.656], [50.952, 3.67], [50.974, 3.708], [51.017, 3.744], [51.046, 3.755], [51.034, 3.793], [51.009, 3.823],
  [51.003, 3.847], [51.009, 3.873], [51.015, 3.99], [51.018, 4.033], [51.045, 4.055], [51.054, 4.079], [51.043, 4.11],
  [51.057, 4.142], [51.046, 4.17], [51.045, 4.191], [51.066, 4.193], [51.1, 4.182], [51.122, 4.216], [51.124, 4.276],
  [51.132, 4.316], [51.17, 4.333], [51.197, 4.349], [51.225, 4.392], [51.234, 4.395], [51.269, 4.308],
];
const ESTUARY = [
  [51.3, 4.29], [51.34, 4.265], [51.385, 4.225], [51.4, 4.16], [51.395, 4.08], [51.412, 4.01], [51.395, 3.93],
  [51.362, 3.86], [51.37, 3.79], [51.4, 3.7], [51.418, 3.62], [51.425, 3.55], [51.44, 3.46],
];

const SCALE = 64; // px per degree of latitude
const PAD = 5;
const NORTH = 51.56, SOUTH = 49.99, WEST = 3.18, EAST = 4.4;
const SQUEEZE = Math.cos((50.8 * Math.PI) / 180); // degrees of longitude are shorter this far north

const r = (n) => Math.round(n * 10) / 10;
const project = ([lat, lon]) => [PAD + (lon - WEST) * SQUEEZE * SCALE, PAD + (NORTH - lat) * SCALE];
const WIDTH = r(2 * PAD + (EAST - WEST) * SQUEEZE * SCALE);
const HEIGHT = r(2 * PAD + (NORTH - SOUTH) * SCALE);

const course = RIVER.concat(ESTUARY).map(project);
const estuaryStart = RIVER.length - 1;

// The river as filled shapes: thin at the source, a little wider downstream, then a funnel that fades into the sea.
const len = [0];
for (let i = 1; i < course.length; i++) len.push(len[i - 1] + Math.hypot(course[i][0] - course[i - 1][0], course[i][1] - course[i - 1][1]));
const total = len[len.length - 1];
const half = (i) => {
  const e = Math.max(0, (len[i] - len[estuaryStart]) / (total - len[estuaryStart]));
  return 0.5 + 0.45 * (len[i] / total) + 1.5 * e * e;
};
const outline = (from, to) => {
  const left = [], right = [];
  for (let i = from; i <= to; i++) {
    const a = course[Math.max(0, i - 1)], b = course[Math.min(course.length - 1, i + 1)], p = course[i];
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d, ny = dx / d, h = half(i);
    left.push([p[0] + nx * h, p[1] + ny * h]);
    right.push([p[0] - nx * h, p[1] - ny * h]);
  }
  return "M" + left.concat(right.reverse()).map(([x, y]) => `${r(x)},${r(y)}`).join(" L") + " Z";
};
const riverShape = outline(0, estuaryStart);
const estuaryShape = outline(estuaryStart, course.length - 1);
// The fade runs from Bath, where the Western Scheldt turns west, to the open sea.
const fadeFrom = course[estuaryStart + 3], fadeTo = course[course.length - 1];

// How far along the river (in px from the source) the point of the river closest to p lies.
const along = (p) => {
  let best = 0, dist = Infinity;
  for (let i = 1; i < course.length; i++) {
    const [ax, ay] = course[i - 1], [bx, by] = course[i];
    const dx = bx - ax, dy = by - ay, seg = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / seg));
    const d = Math.hypot(ax + t * dx - p[0], ay + t * dy - p[1]);
    if (d < dist) { dist = d; best = len[i - 1] + t * (len[i] - len[i - 1]); }
  }
  return best;
};
// The point on the river at a given distance from the source.
const pointAt = (s) => {
  let i = 1;
  while (i < course.length - 1 && len[i] < s) i++;
  const t = (s - len[i - 1]) / (len[i] - len[i - 1] || 1);
  return [course[i - 1][0] + t * (course[i][0] - course[i - 1][0]), course[i - 1][1] + t * (course[i][1] - course[i - 1][1])];
};

// places: one [lat, lon] for a place, or two for a walk along the river.
// The dot always sits on the river: on the nearest bit of river for a place, halfway along the river for a walk.
const dot = (places) => {
  const spots = (places || []).map((p) => along(project(p)));
  return spots.length ? pointAt((Math.min(...spots) + Math.max(...spots)) / 2) : null;
};

// Where the dot is, as a share of the map width and height, so the place name can sit beside it.
function scheldtSpot(places) {
  const p = dot(places);
  return p ? { x: Math.round((p[0] / WIDTH) * 1000) / 1000, y: Math.round((p[1] / HEIGHT) * 1000) / 1000 } : null;
}

function scheldtMap(places, label) {
  const p = dot(places);
  if (!p) return "";
  const [x, y] = p;
  const mark = `<circle class="scheldt-map-halo" cx="${r(x)}" cy="${r(y)}" r="7"></circle><circle class="scheldt-map-place" cx="${r(x)}" cy="${r(y)}" r="3.6"></circle>`;
  label = String(label || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const title = label ? `<title>${label}</title>` : "";
  return `<svg class="scheldt-map" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img"${label ? ` aria-label="${label}"` : ' aria-hidden="true"'} focusable="false">${title}<defs><linearGradient id="scheldt-map-sea" gradientUnits="userSpaceOnUse" x1="${r(fadeFrom[0])}" y1="${r(fadeFrom[1])}" x2="${r(fadeTo[0])}" y2="${r(fadeTo[1])}"><stop offset="0" stop-color="currentColor"></stop><stop offset="1" stop-color="currentColor" stop-opacity="0.15"></stop></linearGradient></defs><path class="scheldt-map-river" d="${riverShape}"></path><path class="scheldt-map-estuary" d="${estuaryShape}" fill="url(#scheldt-map-sea)"></path>${mark}</svg>`;
}


// A larger map for the Scheldt page: numbered stops from the source to the sea with their names beside them,
// and a dashed line where the river crosses a border, with the country on either side.
// stops: [{ places, name, anchor ("start", "end" or "middle"), dx, dy }], borders: [{ place, above, below }]
const esc = (t) => String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
function scheldtJourney(stops, borders, label) {
  const LEFT = 2, RIGHT = 36, TOP = 9, BOTTOM = 3;
  const vb = [-LEFT, -TOP, r(WIDTH + LEFT + RIGHT), r(HEIGHT + TOP + BOTTOM)];
  const lines = (borders || []).map((b) => {
    const [x, y] = dot([b.place]);
    return `<path class="journey-map-border" d="M${r(x - 5)},${r(y)} H${r(x + 5)}"></path>` +
      `<text class="journey-map-country" x="${r(x + 6.5)}" y="${r(y - 1.2)}">${esc(b.above)}</text>` +
      `<text class="journey-map-country" x="${r(x + 6.5)}" y="${r(y + 3.4)}">${esc(b.below)}</text>`;
  }).join("");
  const marks = (stops || []).map((s, i) => {
    const [x, y] = dot(s.places);
    const anchor = s.anchor || "start";
    const tx = x + (s.dx != null ? s.dx : anchor === "end" ? -4.2 : anchor === "start" ? 4.2 : 0);
    const ty = y + (s.dy != null ? s.dy : 0);
    return `<g class="journey-map-stop"><circle class="journey-map-dot" cx="${r(x)}" cy="${r(y)}" r="2.7"></circle>` +
      `<text class="journey-map-number" x="${r(x)}" y="${r(y)}">${i + 1}</text>` +
      `<text class="journey-map-name" x="${r(tx)}" y="${r(ty)}" text-anchor="${anchor}">${esc(s.name)}</text></g>`;
  }).join("");
  return `<svg class="journey-map" viewBox="${vb.join(" ")}" role="img" aria-label="${esc(label)}" focusable="false"><title>${esc(label)}</title><defs><linearGradient id="journey-map-sea" gradientUnits="userSpaceOnUse" x1="${r(fadeFrom[0])}" y1="${r(fadeFrom[1])}" x2="${r(fadeTo[0])}" y2="${r(fadeTo[1])}"><stop offset="0" stop-color="currentColor"></stop><stop offset="1" stop-color="currentColor" stop-opacity="0.15"></stop></linearGradient></defs><path class="scheldt-map-river" d="${riverShape}"></path><path class="scheldt-map-estuary" d="${estuaryShape}" fill="url(#journey-map-sea)"></path>${lines}${marks}</svg>`;
}

// A map for "One river, three countries" on the About page: the same river as above, with a soft colour band behind it
// for each country, split at the latitude where the river crosses a border, and on the right a column with each
// country's name and what the river is called there (option A on choice page 63; Tine, file 63, October 2026).
// data: { label, sea, countries: [{ name, river, tone }] from the sea to the source, tone pink, lime, orange or green,
//         borders: [[lat, lon]] top first, places: [{ name, places, anchor ("start", "end" or "middle"), dx, dy }] }
// dx and dy move a place name (in map units, about 3 px each).
// Colours and fonts are in site.css (.countries-map-*). The sizes here must match the font sizes there (map units):
// the label column is made wide enough for the longest text, and the type is large enough to stay at least 12 px
// on a 375 px phone. So keep the river names short (about 30 characters), or the whole map shrinks.
const COUNTRY_SIZE = 7.4, RIVER_SIZE = 5.2;
function scheldtCountries(data) {
  data = data || {};
  const countries = data.countries || [];
  const edges = (data.borders || []).map((b) => project(b)[1]).sort((a, b) => a - b);
  const count = Math.min(countries.length, edges.length + 1);
  if (!count) return "";
  // Lato is about 0.44 em per letter in Regular and 0.50 in Bold; a little more leaves room for the fallback fonts.
  const textWidth = Math.max(...countries.slice(0, count).map((c) =>
    Math.max(String(c.name || "").length * 0.53 * COUNTRY_SIZE, String(c.river || "").length * 0.47 * RIVER_SIZE)));
  const LEFT = 2, TOP = 12, BOTTOM = 6, BAR_X = WIDTH + 3, TEXT_X = WIDTH + 7.5, RIGHT = 7.5 + textWidth + 3, CORNER = 3.5;
  const X0 = -LEFT, X1 = r(WIDTH + RIGHT), Y0 = -TOP, Y1 = r(HEIGHT + BOTTOM);
  const vb = [X0, Y0, r(X1 - X0), r(Y1 - Y0)];
  const cuts = [Y0].concat(edges.slice(0, count - 1).map(r), [Y1]);
  // A band with rounded outer corners only: the top of the first band and the bottom of the last.
  const band = (top, bottom, roundTop, roundBottom) => {
    const t = roundTop ? CORNER : 0, b = roundBottom ? CORNER : 0;
    return `M${X0},${r(bottom - b)} V${r(top + t)}` + (t ? ` A${t},${t} 0 0 1 ${r(X0 + t)},${top}` : "") +
      ` H${r(X1 - t)}` + (t ? ` A${t},${t} 0 0 1 ${X1},${r(top + t)}` : "") + ` V${r(bottom - b)}` +
      (b ? ` A${b},${b} 0 0 1 ${r(X1 - b)},${bottom}` : "") + ` H${r(X0 + b)}` + (b ? ` A${b},${b} 0 0 1 ${X0},${r(bottom - b)}` : "") + " Z";
  };
  const tone = (t) => String(t || "").toLowerCase().replace(/[^a-z-]/g, "");
  const lands = countries.slice(0, count).map((c, i) => {
    const top = cuts[i], bottom = cuts[i + 1], y = (top + bottom) / 2;
    const cls = tone(c.tone) ? ` countries-map-tone-${tone(c.tone)}` : "";
    return `<g class="countries-map-country${cls}"><path class="countries-map-band" d="${band(top, bottom, i === 0, i === count - 1)}"></path>` +
      `<rect class="countries-map-bar" x="${r(BAR_X)}" y="${r(y - 7.6)}" width="1.8" height="15.2" rx="0.9"></rect>` +
      `<text class="countries-map-country-name" x="${r(TEXT_X)}" y="${r(y - 1.15)}">${esc(c.name)}</text>` +
      `<text class="countries-map-river-name" x="${r(TEXT_X)}" y="${r(y + 6.45)}">${esc(c.river)}</text></g>`;
  }).join("");
  const lines = cuts.slice(1, -1).map((y) => `<path class="countries-map-border" d="M${X0},${y} H${X1}"></path>`).join("");
  const places = (data.places || []).map((s) => {
    const p = dot(s.places);
    if (!p) return "";
    const [x, y] = p;
    const anchor = ["start", "end", "middle"].includes(s.anchor) ? s.anchor : "start";
    const tx = x + (s.dx != null ? Number(s.dx) : anchor === "end" ? -3.8 : anchor === "start" ? 3.8 : 0);
    const ty = y + (s.dy != null ? Number(s.dy) : 0);
    return `<circle class="countries-map-dot" cx="${r(x)}" cy="${r(y)}" r="1.6"></circle>` +
      `<text class="countries-map-place-name" x="${r(tx)}" y="${r(ty)}" text-anchor="${anchor}">${esc(s.name)}</text>`;
  }).join("");
  const sea = data.sea ? `<text class="countries-map-sea" x="${r(X0 + 4.5)}" y="${r(Y0 + 7)}">${esc(data.sea)}</text>` : "";
  const label = esc(data.label);
  const named = label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"';
  return `<div class="countries-map"><svg class="countries-map-svg" viewBox="${vb.join(" ")}"${named} focusable="false">` +
    `<g aria-hidden="true"><defs><linearGradient id="countries-map-sea" gradientUnits="userSpaceOnUse" x1="${r(fadeFrom[0])}" y1="${r(fadeFrom[1])}" x2="${r(fadeTo[0])}" y2="${r(fadeTo[1])}"><stop offset="0" stop-color="currentColor"></stop><stop offset="1" stop-color="currentColor" stop-opacity="0.15"></stop></linearGradient></defs>` +
    `${lands}${lines}<path class="scheldt-map-river" d="${riverShape}"></path><path class="scheldt-map-estuary" d="${estuaryShape}" fill="url(#countries-map-sea)"></path>${places}${sea}</g></svg></div>`;
}

// The whole course from the source to the sea, also used for the river timeline (lib/scheldt-river.js).
const COURSE = RIVER.concat(ESTUARY);

module.exports = { scheldtMap, scheldtSpot, scheldtJourney, scheldtCountries, COURSE };
