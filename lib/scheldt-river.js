// The river timeline drawn after the real Scheldt: from its source at Gouy at the top of the page to the sea at Vlissingen.
// The course is the one of the small map on the exchange pages (lib/scheldt-map.js, Natural Earth, public domain),
// straightened out like an old strip map: the big turns (east after Ghent, back west after Antwerp) are taken out so the
// river can run down the page, and the bends that are left are real bends of the Scheldt, stretched lengthwise and
// widened sideways. Every stop sits on the apex of one of those bends, so there are as many bends as stops; the smallest
// bends are smoothed away first. Where the Scheldt runs straight (canalised in France, straightened above Ghent),
// the river on the page runs calmly too.
// The shape is computed once from fixed data, so the river looks the same on every build.

const { COURSE } = require("./scheldt-map");

const STEP = 0.5; // km between samples along the river
const LOCAL = 1.2; // km: smooths the corners of the coarse course
const AXIS = 10; // km: the valley axis; bends shorter than this stay, longer turns are straightened
const LINE_START = 2.6; // line width in px at the source
const LINE_END = 5.2; // line width in px at the mouth

const num = (n) => String(Math.round(n * 10) / 10);

// Kilometres east and north, so distances are true.
const KX = 111.32 * Math.cos((50.8 * Math.PI) / 180), KY = 110.57;
const raw = COURSE.map(([lat, lon]) => [lon * KX, lat * KY]);
const len = [0];
for (let i = 1; i < raw.length; i++) len.push(len[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
const TOTAL = len[len.length - 1];
const at = (d) => {
  let i = 1;
  while (i < raw.length - 1 && len[i] < d) i++;
  const t = (d - len[i - 1]) / (len[i] - len[i - 1] || 1);
  return [raw[i - 1][0] + t * (raw[i][0] - raw[i - 1][0]), raw[i - 1][1] + t * (raw[i][1] - raw[i - 1][1])];
};
const samples = [];
for (let d = 0; d <= TOTAL; d += STEP) samples.push(at(d));
const smooth = (sigma) => {
  const r = Math.ceil((3 * sigma) / STEP), w = [];
  for (let k = -r; k <= r; k++) w.push(Math.exp(-0.5 * ((k * STEP) / sigma) ** 2));
  return samples.map((_, i) => {
    let x = 0, y = 0, sum = 0;
    for (let k = -r; k <= r; k++) {
      const p = samples[Math.min(samples.length - 1, Math.max(0, i + k))];
      x += p[0] * w[k + r]; y += p[1] * w[k + r]; sum += w[k + r];
    }
    return [x / sum, y / sum];
  });
};
const river = smooth(LOCAL), axis = smooth(AXIS);
// How far the river lies beside its valley axis, in km. Positive is the river's left bank, which is the right
// of the page when it flows down the page.
const OFFSET = river.map((p, i) => {
  const a = axis[Math.max(0, i - 1)], b = axis[Math.min(axis.length - 1, i + 1)];
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
  return (p[0] - axis[i][0]) * (-dy / d) + (p[1] - axis[i][1]) * (dx / d);
});

// The apexes of the bends: each one a turn to the right or to the left, in turn.
const APEXES = [];
for (let i = 1; i < OFFSET.length - 1; i++) {
  const v = OFFSET[i];
  if ((v >= OFFSET[i - 1] && v > OFFSET[i + 1]) || (v <= OFFSET[i - 1] && v < OFFSET[i + 1])) APEXES.push(i);
}
// Keep the n clearest bends: drop the shallowest pair of neighbouring apexes until n are left (a pair, so the turns
// still alternate; at the very end one apex at an end of the river).
function clearest(n) {
  const e = APEXES.filter((i) => i * STEP > 4);
  const depth = (i) => Math.abs(OFFSET[e[i]] - OFFSET[e[i + 1]]);
  while (e.length > n) {
    if (e.length === n + 1) { depth(0) < depth(e.length - 2) ? e.shift() : e.pop(); continue; }
    let j = 0;
    for (let i = 1; i < e.length - 1; i++) if (depth(i) < depth(j)) j = i;
    e.splice(j, 2);
  }
  return e;
}

// Places where a river flows into the Scheldt, as km from the source along this course. "left" is the Scheldt's
// left bank, so it comes in from the right of the page.
const TRIBUTARIES = [
  { name: "Scarpe", place: [50.505, 3.455], bank: "left" },
  { name: "Haine", place: [50.452, 3.585], bank: "right" },
  { name: "Lys", place: [51.055, 3.73], bank: "left" },
  { name: "Dender", place: [51.03, 4.1], bank: "right" },
  { name: "Rupel", place: [51.127, 4.29], bank: "right" },
].map((t) => {
  const p = [t.place[1] * KX, t.place[0] * KY];
  let best = 0, dist = Infinity;
  samples.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < dist) { dist = d; best = i; } });
  return { ...t, at: best };
});

// n stops: point 0 is the source, points 1..n the stops. "detail" is the most points of the real river drawn between two
// stops: 5 on the Timeline page, fewer on the homepage, where a piece is short and too many small bends would look restless.
function scheldtRiver(n, detail = 5) {
  const apex = clearest(n);
  const points = [0].concat(apex);
  // Across the band: 0 is the left edge, 1 the right edge, with the bends centred in it. Like the bends of the river
  // drawn before, the deepest ones may swing a little beyond the band. Shallow bends are lifted a little,
  // so they still show.
  const used = OFFSET.slice(0, apex[apex.length - 1] + 1);
  const mid = (Math.max(...apex.map((i) => OFFSET[i])) + Math.min(...apex.map((i) => OFFSET[i]))) / 2;
  const span = Math.max(...used.map((v) => Math.abs(v - mid))) || 1;
  const across = (i) => { const v = (OFFSET[i] - mid) / span; return 0.5 + 0.62 * Math.sign(v) * Math.abs(v) ** 0.7; };
  const cross = points.map(across);
  // A bend that turns to the right of the page puts its stop's text on the right ("b"), and the other way round.
  const sides = apex.map((i) => (OFFSET[i] > OFFSET[i - 1] ? "b" : "a"));
  const width = (k) => LINE_START + (LINE_END - LINE_START) * (k / Math.max(n, 1));

  // From point k to point k+1, down the page: y runs 0 to 100, x 0 to 100 across the band.
  // The real bend in between, as a smooth curve; it leaves and reaches each stop straight down (the apex of a bend),
  // so the pieces join up smoothly whatever their height.
  function curve(k) {
    const a = points[k], b = points[k + 1];
    const count = Math.max(2, Math.min(detail, Math.round((b - a) * STEP / 4)));
    const pts = [];
    for (let j = 0; j <= count; j++) {
      const i = Math.round(a + ((b - a) * j) / count);
      pts.push([across(i) * 100, ((i - a) / (b - a)) * 100]);
    }
    pts[0][0] = cross[k] * 100;
    pts[count][0] = cross[k + 1] * 100;
    // Catmull-Rom through the samples, with an upright start and end.
    const parts = [];
    for (let j = 0; j < count; j++) {
      const p0 = pts[Math.max(0, j - 1)], p1 = pts[j], p2 = pts[j + 1], p3 = pts[Math.min(count, j + 2)];
      let c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      let c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      if (j === 0) c1 = [p1[0], p1[1] + (p2[1] - p1[1]) / 2];
      if (j === count - 1) c2 = [p2[0], p2[1] - (p2[1] - p1[1]) / 2];
      parts.push([p1, c1, c2, p2]);
    }
    return parts;
  }
  function down(k) {
    const parts = curve(k);
    return `M${num(parts[0][0][0])},0` + parts.map(([, c1, c2, p2]) => ` C${num(c1[0])},${num(c1[1])} ${num(c2[0])},${num(c2[1])} ${num(p2[0])},${num(p2[1])}`).join("");
  }
  // The same piece across the page (the homepage on wide screens), turned a quarter to the left: the river flows to the
  // right with its left bank (looking downstream) at the top, so the bends are the real ones and not their mirror image.
  // x runs 0 to 100 along the piece, y 0 to 100 across the band.
  const turn = ([x, y]) => `${num(y)},${num(100 - x)}`;
  function sideways(k) {
    const parts = curve(k);
    return `M0,${num(100 - parts[0][0][0])}` + parts.map(([, c1, c2, p2]) => ` C${turn(c1)} ${turn(c2)} ${turn(p2)}`).join("");
  }
  // Where the drawn river lies across the band at height y (0 to 100) of piece k.
  function xAt(k, y) {
    const part = curve(k).find((p) => p[3][1] >= y);
    const bez = (t, i) => (1 - t) ** 3 * part[0][i] + 3 * (1 - t) ** 2 * t * part[1][i] + 3 * (1 - t) * t ** 2 * part[2][i] + t ** 3 * part[3][i];
    let lo = 0, hi = 1;
    for (let n = 0; n < 30; n++) { const t = (lo + hi) / 2; bez(t, 1) < y ? (lo = t) : (hi = t); }
    return bez(lo, 0);
  }

  // Side rivers that flow in between point k and point k+1: a thin line from beyond the bank that meets the Scheldt
  // flowing downstream. One side river in a piece meets it halfway, two at 40 and 72%: within a piece the exact spot
  // does not show, and so they never touch a stop or its line. Returned in the same 0 to 100 box as down(k), or with
  // "turned" in the box of across(k), for the river running to the right.
  function tributaries(k, turned = false) {
    const P = turned ? turn : ([x, y]) => `${num(x)},${num(y)}`;
    const a = points[k], b = points[k + 1];
    const here = TRIBUTARIES.filter((t) => t.at > a && t.at <= b).sort((p, q) => p.at - q.at);
    return here.map((t, j) => {
      const y = here.length === 1 ? 64 : 52 + (30 * j) / (here.length - 1);
      const x = xAt(k, y), y0 = Math.max(20, y - 58);
      const from = t.bank === "left" ? 122 : -22;
      // A soft S: along the bank first, then bending in to flow with the Scheldt.
      const mx = (from + x) / 2, my = (y0 + y) / 2;
      return { name: t.name, bank: t.bank, d: `M${P([from, y0])} C${P([from, y0 + 14])} ${P([mx + (from - x) * 0.12, my - 10])} ${P([mx, my])} S${P([x, y - 14])} ${P([x, y])}` };
    });
  }

  return { cross, sides, width, down, across: sideways, tributaries, km: points.map((i) => Math.round(i * STEP)) };
}

module.exports = { scheldtRiver };
