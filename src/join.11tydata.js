// Settings of the Join page (src/join.md) that stay out of the browser editor (Output Claude/77).
// The texts, photos and blocks are in src/join.md; the editor rewrites that file and drops comments there, so the notes
// about the page are here.
//
// Headline and lede: why first, then the invitation (designer feedback, 5 October 2026: the why as a thread through the site).
// Chips: short facts as labels at the top. One with an icon stands out in lime. Travel, bed and meals (reviewer feedback 14):
//   "arranged", not "free": the trip to the meeting point is not confirmed as paid.
// The photo opens large on click (reviewer feedback, October 2026: on a phone the faces are tiny).
// Blocks, top to bottom:
//   reasons         Five reasons. "icon" is a line icon in lib/line-icons.js. Titles and texts after reviewer feedback
//                   (October 2026, points 3 to 6): natural English, diversity instead of 'Go international', the Scheldt by
//                   name with one checked fact (seal counts: Rijkswaterstaat, Watervogels en zeezoogdieren in de Zoute Delta
//                   2024-2025), and real skills. The photo on the fifth: a participant on a jetty over the Veerse Meer,
//                   exchange in Zeeland, October 2025.
//   trip-band       What we arrange for the weekends away (reviewer feedback 14), between the reasons and who can join: one
//                   centred call and a sailing boat on a slow wave. Only what the sources support: travel arranged (not
//                   "free travel"), a place to sleep, meals, no fee. Not for the plenary in Tournai.
//   text-and-quote  Who can join, with Bart's quote under the heading on a computer (Tine, file 64: the quotes spread over
//                   the site; approved by Raphaël on 2 October 2026, first names only; source: brochure '10 ans', 2017).
//   journey         How it works: the steps of one group's year and a half as stops along a small river. "nature" adds
//                   reeds (by the source, the first step) or gulls (over the sea, the last step); "icon" is a Lucide icon
//                   (lib/lucide-icons.js, reviewer feedback 12). "Brainstorm weekends" ties the reviewer's step name to the word the
//                   menu and the Exchanges page use.
//   signup-band     The sign-up, the deepest layer of the band of water under the motto (blocks/motto-band.njk). "waiting"
//                   shows while there is no form link (site.json joinFormUrl empty). Raphaël, 2 Oct 2026: the next call and
//                   information session start early 2027; the form comes later. The mail button says so ("Email us",
//                   was "Tell us you are interested").
//   privacy         How we handle your details, and the note about the game.
//   contact         Contact and social media.
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/join/",
  // Shown in the browser tab as "Join | Scheldt Youth Parliament", so the name is not there twice
  shortTitle: "Join",
  shortTitle_fr: "Participer",
  shortTitle_nl: "Doe mee",
  photoLarge: true,
  lightbox: true,
  prose: false,
});
