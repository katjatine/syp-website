// Settings of the homepage (src/index.md) that stay out of the browser editor (Output Claude/77).
// The texts and photos are in src/index.md ("Home" in the editor), which drops comments when it saves, so the notes are here.
// Each "whatPoints" lead is Markdown now (a link is fine), so "Run by [GoodPlanet Belgium](https://www.goodplanet.be),".
//
// Hero
// Why and what we do, under the title (designer feedback, 5 October 2026: first why, then what we do about it)
// The bold line above the buttons. Add the start month once the start of the next group is known, e.g. "No fee, for 16 to 26 year olds. Next group starts in March."
// The blue band under the title shows why to join, in four points from src/_data/whyJoin.json (designer feedback, 5 October 2026).
// The four figures that stood there (40 participants, 9 nationalities, 4 exchanges, 2012) are on the Exchanges page now.
// Made by members: from the SYP Facebook page. First names only (Raphael confirms on /relecture/).
// The title comes from our 2013 motto "Many small flows create a big stream", with one line under it (Tine, file 62, October 2026).
// What is in it for you: you can start something too (designer feedback, 5 October 2026; was "Started by members, shared with all of us.")
// A podcast card (Tine, file 62, option A): a label on the photo ("badge"), the photo itself plays the first episode,
// and each episode gets a button. The buttons and the photo say for screen readers that they open the podcast on "platform".
// "Who we are" (was "What is the SYP?"; title and five points chosen by Tine, file 62, October 2026).
// The text is in whatPoints, not under the three dashes: the homepage no longer shows text written there.
// Each point: "icon" (a name from lib/lucide-icons.js), "lead" (the bold start; HTML allowed, for the link) and "text".
// The icons sit on discs in GoodPlanet's colours, in turn lime, orange, pink, green; "tone: blue" is for GoodPlanet itself.
// The river timeline takes its stops from src/_data/timeline.json
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/",
  type: "home",
});
