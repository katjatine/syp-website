// Settings of the Timeline page (src/timeline.md) that stay out of the browser editor (Output Claude/77).
// The stops on the river are in src/_data/timeline.json ("Timeline" in the editor). The note beside the source of the
// river: the river is drawn after the real Scheldt (lib/scheldt-river.js; Tine, file 53).
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/timeline/",
  // The browser tab says "Timeline since 2008", clearer than the page title alone
  shortTitle: "Timeline since 2008",
  shortTitle_fr: "Chronologie depuis 2008",
  shortTitle_nl: "Tijdlijn sinds 2008",
  back: { label: "Home", label_fr: "Accueil", label_nl: "Home", url: "/" },
  prose: false,
  // The titles of the small moments open their text (js/timeline.js)
  scripts: ["/js/timeline.js"],
});
