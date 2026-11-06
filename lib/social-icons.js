// Round social media icons, after the hand-cut circles in the footer of goodplanet.be but drawn for the SYP.
// Each disc is cut a little differently, as with scissors: round, but not perfect.
// Decorative only (aria-hidden): the link around it carries the name. Colours and size are set in site.css (.social-icons).
// Use in a template: {% socialIcon "instagram" %}, or the whole row with blocks/social-icons.njk.

// The symbols, drawn on a 24 px grid and shown a little larger in the middle of the disc. "line" parts are strokes, the others are filled.
const GLYPHS = {
  facebook: {
    fill: ["M13.4,22 V13.6 H16.2 L16.65,10.3 H13.4 V8.25 C13.4,7.3 13.67,6.65 15.03,6.65 H16.77 V3.7 C16.47,3.66 15.44,3.57 14.23,3.57 C11.7,3.57 10.02,5.1 10.02,7.9 V10.3 H7.2 V13.6 H10.02 V22 Z"],
  },
  instagram: {
    line: ["M8.5,3.5 H15.5 A5,5 0 0 1 20.5,8.5 V15.5 A5,5 0 0 1 15.5,20.5 H8.5 A5,5 0 0 1 3.5,15.5 V8.5 A5,5 0 0 1 8.5,3.5 Z", "M16,12 A4,4 0 1 1 8,12 A4,4 0 1 1 16,12 Z"],
    fill: ["M18.4,6.8 A1.25,1.25 0 1 1 15.9,6.8 A1.25,1.25 0 1 1 18.4,6.8 Z"],
  },
  linkedin: {
    fill: [
      "M3.7,9 H7.5 V21 H3.7 Z",
      "M7.75,5.05 A2.15,2.15 0 1 1 3.45,5.05 A2.15,2.15 0 1 1 7.75,5.05 Z",
      "M9.9,9 H13.55 V10.65 C14.1,9.65 15.35,8.7 17.2,8.7 C21.1,8.7 21.85,11.25 21.85,14.6 V21 H18 V15.3 C18,13.9 17.97,12.15 16.05,12.15 C14.1,12.15 13.8,13.65 13.8,15.2 V21 H9.9 Z",
    ],
  },
  mail: {
    line: ["M5.2,5.5 H18.8 A2.2,2.2 0 0 1 21,7.7 V16.3 A2.2,2.2 0 0 1 18.8,18.5 H5.2 A2.2,2.2 0 0 1 3,16.3 V7.7 A2.2,2.2 0 0 1 5.2,5.5 Z", "M3.8,7 L12,13.2 L20.2,7"],
  },
};

// A disc of radius 23 around (24, 24), its edge moved in or out by up to 4.5 percent at fifteen points
// and rounded between them. A fixed seed per icon keeps the shape the same at every build.
function handCutDisc(seed) {
  let s = seed >>> 0;
  const random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const round = (n) => Math.round(n * 10) / 10;
  const points = [];
  const start = random() * 2 * Math.PI;
  for (let i = 0; i < 15; i++) {
    const angle = start + (i / 15) * 2 * Math.PI + (random() - 0.5) * 0.12;
    const radius = 23 * (1 + (random() - 0.5) * 0.09);
    points.push([24 + radius * Math.cos(angle), 24 + radius * Math.sin(angle)]);
  }
  const mid = (p, q) => `${round((p[0] + q[0]) / 2)},${round((p[1] + q[1]) / 2)}`;
  let d = `M${mid(points[14], points[0])}`;
  points.forEach((p, i) => { d += ` Q${round(p[0])},${round(p[1])} ${mid(p, points[(i + 1) % 15])}`; });
  return `${d} Z`;
}

const SEEDS = { facebook: 3, instagram: 5, linkedin: 8, mail: 13 };

function socialIcon(name) {
  const glyph = GLYPHS[name];
  if (!glyph) return "";
  const lines = (glyph.line || []).map((d) => `<path class="social-icon-line" d="${d}"></path>`).join("");
  const fills = (glyph.fill || []).map((d) => `<path d="${d}"></path>`).join("");
  return (
    `<svg class="social-icon social-icon-${name}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">` +
    `<path class="social-icon-disc" d="${handCutDisc(SEEDS[name])}"></path>` +
    `<g class="social-icon-glyph" transform="translate(10.5 10.5) scale(1.125)">${lines}${fills}</g></svg>`
  );
}

module.exports = { socialIcon };
