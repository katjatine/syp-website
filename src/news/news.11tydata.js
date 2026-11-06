// News posts, in English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../../lib/languages");
module.exports = inLanguages({
  "type": "news",
  "tags": [
    "news"
  ],
  "permalink": "/news/{{ page.fileSlug }}/"
});
