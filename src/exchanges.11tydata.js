// Settings of the Exchanges overview (src/exchanges.md) that stay out of the browser editor (Output Claude/77).
// Lede: reviewer feedback (October 2026, E1): say what an exchange is, then what the list shows, without 'This page is about'.
// designer feedback (5 October 2026): what is in it for you, so the lede speaks to the reader; the last group's four exchanges
// and Tournai are in the figures band right under it. 'Since 2008' stays before 2025 (Tine, 2 Oct).
// Figures: the last group, in the blue band under the title (designer feedback, 5 October 2026: on the homepage these figures
// said little and read as if they belonged to 2012). Three recommendations: one per group (Recommendations page).
// "Before 2025" carries Ana's quote from a river trip in 2013 (Tine, file 64: the quotes spread over the site; approved by
// Raphaël on 2 October 2026, first names only). Never put a 2010, 2013 or 2021 quote on a 2025 or 2026 exchange page.
// The cards of the list come from the exchange pages themselves (src/exchanges/).
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/exchanges/",
  joinCta: true,
  prose: false,
});
