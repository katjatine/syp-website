// Three languages in one file (Tine, file 88, 5 November 2026): every text has an English field and, beside it, the same
// name with _fr and _nl ("headline", "headline_fr", "headline_nl"). The blocks are shared, so a block moved in the editor
// moves in all three languages. localize() gives the page in one language: each field takes its _fr or _nl twin when
// that is filled in, else the English text; the _fr and _nl keys themselves are left out.
const LANGS = ["en", "fr", "nl"];
const OTHER = LANGS.filter((l) => l !== "en");
const isTwin = (key) => OTHER.some((l) => key.endsWith("_" + l));
const filled = (v) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);

function localize(value, lang) {
  if (Array.isArray(value)) return value.map((v) => localize(v, lang));
  if (!value || typeof value !== "object" || value instanceof Date) return value;
  const out = {};
  for (const key of Object.keys(value)) {
    if (isTwin(key)) continue;
    const twin = lang && lang !== "en" ? value[key + "_" + lang] : undefined;
    out[key] = localize(filled(twin) ? twin : value[key], lang);
  }
  return out;
}

module.exports = { LANGS, localize };
