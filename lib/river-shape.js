// The estuary of the three rivers (Timeline page, homepage, "How it works"): their bends come from the real Scheldt
// (lib/scheldt-river.js), their mouth from here. The shapes are fixed, so the river looks the same on every build.

const LINE_END = 5.2; // line width in px at the mouth, as in lib/scheldt-river.js

const num = (n) => String(Math.round(n * 10) / 10);

// The estuary after the last stop: the line runs on, then a soft funnel opens evenly on both sides,
// like the Western Scheldt widening into the sea. "at" is where the river reaches it across the band (0 to 1).
const OPEN = 38; // half the width of the funnel at its end, in band units
function mouthAcross(at) {
  const y = at * 100, half = (LINE_END / 2) / 0.8;
  return {
    line: `M0,${num(y)} L75,${num(y)}`,
    funnel: `M0,${num(y - half)} L28,${num(y - half)} C52,${num(y - half)} 62,${num(y - OPEN * 0.75)} 75,${num(y - OPEN)} L75,${num(y + OPEN)} C62,${num(y + OPEN * 0.75)} 52,${num(y + half)} 28,${num(y + half)} L0,${num(y + half)} Z`,
  };
}
function mouthDown(at, bandPx) {
  const x = at * 100, half = ((LINE_END / 2) / bandPx) * 100;
  return {
    line: `M${num(x)},0 L${num(x)},100`,
    funnel: `M${num(x - half)},0 L${num(x - half)},45 C${num(x - half)},72 ${num(x - OPEN * 0.75)},86 ${num(x - OPEN)},100 L${num(x + OPEN)},100 C${num(x + OPEN * 0.75)},86 ${num(x + half)},72 ${num(x + half)},45 L${num(x + half)},0 Z`,
  };
}

module.exports = { mouthAcross, mouthDown };
