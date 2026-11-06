// Small line drawings of what grows and flies along the Scheldt, placed beside the river timeline.
// Decorative only (aria-hidden). They draw in currentColor; the colour and size are set in site.css.

const DRAWINGS = {
  // Reeds and bulrushes on a strip of bank, as on the narrow upper course.
  reeds: {
    viewBox: "0 0 60 72",
    paths: [
      "M14,70 C15,52 13,34 10,15",
      "M22,70 C22,50 24,32 27,9",
      "M31,70 C32,57 35,45 41,31",
      "M18,70 C16,59 9,50 2,46",
      "M26,70 C30,58 39,52 50,51",
      "M35,70 C39,62 47,58 57,59",
      "M20,70 C21,56 20,46 17,37",
      "M10,14 L9.6,7",
      "M27,8 L27.5,1",
      "M2,71 C18,69 42,69 58,71",
    ],
    fills: ["M9.9,13 C7.6,15 7.2,25 9.6,28 C12,25 12.2,15 9.9,13 Z", "M27.1,8 C24.8,10 24.6,21 27,24 C29.4,21 29.4,10 27.1,8 Z"],
  },
  // Gulls over the estuary.
  gulls: {
    viewBox: "0 0 70 34",
    paths: [
      "M4,15 C8,9 13,9 16,14 C19,9 24,9 28,13",
      "M36,26 C39,21 43,21 45,25 C47,21 51,21 54,24",
      "M49,8 C51,5 54,5 56,8 C58,5 61,5 63,7",
    ],
    fills: [],
  },
};

function riverNature(type, mirrored = false) {
  const d = DRAWINGS[type];
  if (!d) return "";
  const lines = d.paths.map((p) => `<path d="${p}"></path>`).join("");
  const fills = d.fills.map((p) => `<path class="river-deco-fill" d="${p}"></path>`).join("");
  return `<span class="river-deco river-deco-${type}${mirrored ? " is-mirrored" : ""}" aria-hidden="true"><svg viewBox="${d.viewBox}" focusable="false">${lines}${fills}</svg></span>`;
}

module.exports = { riverNature };
