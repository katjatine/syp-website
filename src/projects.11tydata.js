// Settings of the page Member projects (src/projects.md) that stay out of the browser editor (Output Claude/77).
// The projects themselves are in src/_data/memberProjects.json ("Member projects" in the editor); the homepage shows the
// three newest (Tine, file 92, 6 November 2026). In English, French and Dutch: lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/projects/",
  joinCta: true,
  prose: false,
});
