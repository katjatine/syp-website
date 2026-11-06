// Settings of The Scheldt page (src/the-scheldt.md) that stay out of the browser editor (Output Claude/77).
// Its own layout (src/_includes/types/scheldt.njk): everything on the page comes from the front matter of src/the-scheldt.md.
// The map (lib/scheldt-map.js) puts a numbered dot on the river for each stop. "places" is one "latitude, longitude",
// or two separated by ";" for a walk (the dot goes halfway). The name sits right of the dot; "anchor: end" puts it left,
// "middle" centres it; dx and dy move it (in map units, about 4 px each). borders: where the river crosses into the next
// country. "we" and "url": the 'We were here' line under each place. "sources": Markdown, links are fine.
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/the-scheldt/",
  type: "scheldt",
});
