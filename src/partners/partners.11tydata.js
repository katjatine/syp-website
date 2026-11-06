// Settings shared by the partners' own pages in this folder, and notes that stay out of the browser editor (it drops comments).
//
// Agence de l'Eau Artois-Picardie: asked for by Raphaël (mail and form, 22 October 2026). Sources: brochure '10 ans', 2017
//   (pp. 14, 18 to 33), activity report 2022-2023, action plans 2023-2026. His form says Jo and Christine met in 2008; the
//   brochure has the partnership signed in 2007, so no year for the meeting there.
// HZ University of Applied Sciences: asked for by Raphaël (form, 22 October 2026). Sources: final report Erasmus+ 2024-2026,
//   activity reports 2022-2023 and 2024, timeline.json. Do not mention Future Water Leaders Europe (Raphaël, 2 October 2026).
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../../lib/languages");
module.exports = inLanguages({
  permalink: "/partners/{{ page.fileSlug }}/",
  joinCta: true,
  back: { url: "/partners/", label: "All partners", label_fr: "Tous les partenaires", label_nl: "Alle partners" },
});
