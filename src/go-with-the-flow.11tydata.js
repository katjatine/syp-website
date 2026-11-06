// Settings of the Go with the flow page (src/go-with-the-flow.md) that stay out of the browser editor (Output Claude/77).
// The card texts are copied from the cards in the download (src/downloads/go-with-the-flow-water-goose-game.pdf).
// How to play is drawn as a short river ("journey" block): "nature" adds reeds (by the source, the first step) or gulls
// (over the sea, the last step). The steps have no icons here, so the river draws plain dots.
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/go-with-the-flow/",
  shortTitle: "Go with the flow, the water game",
  shortTitle_fr: "Go with the flow, le jeu de l'eau",
  shortTitle_nl: "Go with the flow, het waterspel",
  prose: false,
  scripts: ["/js/game.js"],
});
