// Settings shared by the exchange pages in this folder (src/_includes/types/exchange.njk), and notes that used to stand
// in their front matter: the browser editor (Output Claude/77, "Exchanges") drops comments when it saves.
//
// riverMap: the dot on the small map of the Scheldt beside "Where": one place as "latitude, longitude", or two separated
//   by ";" for a walk (the dot goes halfway). Denain and Valenciennes; Oudenaarde and Zingem; Ghent; Tournai;
//   Wolphaartsdijk, on the Veerse Meer.
// facts, Cost: reviewer feedback 14 (October 2026): what we arrange, on every exchange page. Booked by GoodPlanet for all
//   four exchanges (hostels in Lille and Ghent, Kanoa in Zeeland, meals in the budget); 'arranged', not 'free travel'.
//   Not on Tournai.
// quote: Raphaël asks the 2024-2026 members for a quote (2 Oct 2026). Add text, name (first name) and meta (country, year)
//   when it arrives, and accent (orange, green, pink or lime) for the colour of the card. Never put a 2010, 2013 or 2021
//   quote on a 2025 or 2026 exchange page.
// shortTitle (Tournai): a shorter name for the browser tab.
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../../lib/languages");
module.exports = inLanguages({
  permalink: "/exchanges/{{ page.fileSlug }}/",
  type: "exchange",
  tags: ["exchanges"],
});
