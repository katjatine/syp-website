// Settings of the About page (src/project.md) that stay out of the browser editor (Output Claude/77).
// The texts, photos and blocks of the page are in src/project.md; the editor rewrites that file and drops comments there,
// so the notes about the page are here.
//
// The About page after reviewer feedback (Tine, file 63, October 2026): people first. The title and what we do at the top,
// beside a photo of people; then the moving gallery of earlier groups, the mix of the group, the aim, the river and our
// seat at the commission, and two colour cards. The menu and the browser tab say "About"; the big title is the headline.
// Who we are, why and what we do about it in the lede (designer feedback, 5 October 2026: the why as a thread through the site).
// The moving gallery ("photo-ribbon" block), oldest first: year is the sticker on the photo; place and year make the
// caption ("By the sea, 2013"). Left out on purpose: the selfie at the top of this page, and the Senate (2015), which is
// the photo of the join call at the bottom of this page and most others (Tine, file 63).
// In three languages (Tine, file 88, pilot of 5 November 2026): one file, three pages. Every text has a twin with _fr and
// _nl in src/project.md; lib/localize.js picks the right one for each page, English when the twin is empty.
// The addresses are in src/_data/languages.json.
const { inLanguages } = require("../lib/languages");

module.exports = inLanguages({
  permalink: "/about/",
  editPencil: true,
  joinCta: true,
  // The gallery photos open large
  lightbox: true,
});
