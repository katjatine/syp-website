// Settings of the Reports page (src/reports.md) that stay out of the browser editor (Output Claude/77).
// The standing photo sits beside the reports ("text-with-photo" block), not at the top, where it looked odd next to the
// short intro (Tine, October 2026). On a computer it stays in view while you read; on a phone it comes after the reports.
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/reports/",
  prose: false,
});
