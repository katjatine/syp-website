// The addresses of the three languages (Tine, file 88; src/_data/languages.json) and the settings that make one page
// file into three pages. Used by eleventy.config.js (filters and the link transform) and by the .11tydata.js files.
const languages = require("../src/_data/languages.json");

const pages = Object.entries(languages.pages);
// The English address that an address belongs to, or the address itself: /fr/actualites/x/ gives /news/x/.
function englishUrl(url) {
  url = String(url || "");
  let best = null;
  for (const [en, other] of pages) {
    for (const local of Object.values(other)) {
      if (url === local) return en;
      if (en !== "/" && url.startsWith(local) && (!best || local.length > best[1].length)) best = [en, local];
    }
  }
  return best ? best[0] + url.slice(best[1].length) : url;
}
// The address of an English page in another language: exact, else under the longest matching section, else unchanged.
function localUrl(url, lang) {
  if (!lang || lang === "en") return url;
  const [pathPart, hash] = String(url || "").split("#");
  let local = null;
  if (languages.pages[pathPart]) local = languages.pages[pathPart][lang];
  else {
    const section = pages.filter(([en]) => en !== "/" && pathPart.startsWith(en)).sort((a, b) => b[0].length - a[0].length)[0];
    if (section) local = section[1][lang] + pathPart.slice(section[0].length);
  }
  return local ? local + (hash !== undefined ? "#" + hash : "") : url;
}

// Settings for a .11tydata.js file: the page is made once per language ("lang" is en, fr or nl) and its address follows
// languages.json. "permalink" is the English address; "{{ page.fileSlug }}" in it is filled in, as Eleventy would.
function inLanguages(settings) {
  const english = settings.permalink;
  return {
    ...settings,
    // addAllPagesToCollections: the French and Dutch pages join the collections too (news, exchanges)
    pagination: { data: "languages.codes", size: 1, alias: "lang", addAllPagesToCollections: true },
    permalink: (data) => {
      const en = String(typeof english === "function" ? english(data) : english).replace(/\{\{\s*page\.fileSlug\s*\}\}/g, data.page.fileSlug);
      return localUrl(en, data.lang);
    },
  };
}

module.exports = { languages, englishUrl, localUrl, inLanguages };
