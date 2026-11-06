// Settings of the Partners page (src/partners.md) that stay out of the browser editor (Output Claude/77).
// The texts, logos and blocks are in src/partners.md; the editor drops comments there, so the notes are here.
//
// The lead partner (GoodPlanet, the one with "lead") stands in the top of the page, under the intro, with the photo in
// "heroAside" beside both (Tine, 5 October 2026): SYP written in a heart in the sand, at the beach clean-up in Zeeland,
// January 2024. Larger than inside the card, less white space at the top.
// Agence de l'Eau Artois-Picardie: the bloc-marque (République Française + agency logo) may only be scaled, never changed:
// large on its own row ("logoWide"), so 'AGENCE DE L'EAU' can be read (Tine, file 51). Source: Sharepoint 01. Logos/AEAP.jpg,
// white margin trimmed.
// The Agence de l'Eau comes first in the list under the lead partner, the full width ("featured"; Raphaël, 22 October 2026; Tine, file 83).
// Rights for the Scheldt: no logo exists (checked again on 16 September 2026): an informal movement, its site shows the
// name as text only ("textOnly").
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/partners/",
  joinCta: true,
  prose: false,
  leadInHero: true,
});
