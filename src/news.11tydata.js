// Settings of the News page (src/news.md) that stay out of the browser editor (Output Claude/77).
// The posts themselves are in src/news/, one file per post ("News" in the editor).
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/news/",
  joinCta: true,
  prose: false,
});
