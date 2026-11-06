// Every page in its own language (Tine, file 88; lib/localize.js). A page made in three languages (lib/languages.js) has
// "lang"; each of its texts then takes its _fr or _nl twin, English when the twin is empty. English pages stay exactly
// as they are. The keys are found in the pages themselves: every top-level key of a page that has twins.
// "bodyTranslated" is the French or Dutch text of a page with a Markdown body (body_fr, body_nl in its front matter).
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { localize } = require("../../lib/localize");

const SRC = path.join(__dirname, "..");
const walk = (d) => fs.readdirSync(d).flatMap((f) => {
  const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) return f.startsWith("_") || ["css", "js", "fonts", "images", "downloads"].includes(f) ? [] : walk(p);
  return f.endsWith(".md") ? [p] : [];
});
const keys = new Set(["shortTitle", "back"]);
for (const file of walk(SRC)) {
  const m = fs.readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  if (!/_(fr|nl):/.test(m[1])) continue;
  const data = yaml.load(m[1]) || {};
  for (const k of Object.keys(data)) { const base = k.replace(/_(fr|nl)$/, ""); if (base !== "body") keys.add(base); }
}

const pick = (key) => (data) => {
  if (!data.lang || data.lang === "en") return data[key];
  return localize({ [key]: data[key], [`${key}_fr`]: data[`${key}_fr`], [`${key}_nl`]: data[`${key}_nl`] }, data.lang)[key];
};
const computed = Object.fromEntries([...keys].map((k) => [k, pick(k)]));
computed.bodyTranslated = (data) => (data.lang && data.lang !== "en" ? data[`body_${data.lang}`] || "" : "");
module.exports = computed;
