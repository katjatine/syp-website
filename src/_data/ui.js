// The fixed words of the site per language, from ui-words.json, with English for every French or Dutch word that is
// missing, so a new word added in English never leaves an empty button. Templates: {% set T = ui[lang or "en"] %}.
const words = require("./ui-words.json");
const merge = (en, other) => {
  const out = { ...en };
  for (const [k, v] of Object.entries(other || {})) out[k] = v && typeof v === "object" ? merge(en[k] || {}, v) : v || en[k];
  return out;
};
module.exports = { en: words.en, fr: merge(words.en, words.fr), nl: merge(words.en, words.nl) };
