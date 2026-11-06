// Checks the French and Dutch twins (Tine, file 88; lib/localize.js) in the pages and data files.
// Run with: node scripts/check-translations.js [files]      (no files: every page and data file with twins)
//   1. Leaving out every _fr and _nl key must give exactly the English of the main branch: translating never changes
//      the English site.
//   2. It lists every English text without a French or Dutch twin, so nothing is forgotten.
// Nothing is changed.
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { execFileSync } = require("child_process");
const ROOT = path.join(__dirname, "..");

// Keys that are never translated: addresses, photos, choices, numbers, settings.
const SINGLE = /^(type|url|photo|logo|logo2x|file|icon|tone|accent|anchor|year|date|places|permalink|layout|tags|kind|id|hidden|featured|goodplanet|wide|logoWide|latest|count|src|href|width|height|crop|order|map|coords|lat|lng|zoom|code|slug|pdf|video|youtube|episodes|tile|classes|nature|homeNature|era|weight|key)$/;
const isTwin = (k) => /_(fr|nl)$/.test(k);
const looksLikeText = (s) => /[A-Za-z]{2}/.test(s) && !/^(\/|#|https?:|mailto:)\S*$/.test(s) && !/^[\w-]+\.(jpe?g|png|svg|pdf|webp)$/.test(s);

function read(text, file) {
  if (file.endsWith(".json")) return JSON.parse(text);
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return {};
  const data = yaml.load(m[1]) || {};
  if (m[2].trim()) data.body = m[2].trim();
  return data;
}
const strip = (v) => Array.isArray(v) ? v.map(strip) : v && typeof v === "object" && !(v instanceof Date)
  ? Object.fromEntries(Object.entries(v).filter(([k]) => !isTwin(k)).map(([k, x]) => [k, strip(x)])) : v;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function missing(v, where, out, key) {
  if (Array.isArray(v)) return v.forEach((x, i) => missing(x, `${where}[${i}]`, out, key));
  if (!v || typeof v !== "object" || v instanceof Date) return;
  for (const [k, x] of Object.entries(v)) {
    if (isTwin(k) || k.startsWith("_") || SINGLE.test(k)) continue;
    const isStrings = typeof x === "string" || (Array.isArray(x) && x.length && x.every((s) => typeof s === "string"));
    if (isStrings && [].concat(x).some(looksLikeText)) {
      for (const l of ["fr", "nl"]) if (v[`${k}_${l}`] === undefined || v[`${k}_${l}`] === "") out.push(`${where}.${k}_${l}`);
    } else missing(x, `${where}.${k}`, out, k);
  }
}

let files = process.argv.slice(2);
if (!files.length) {
  const walk = (d) => fs.readdirSync(d).flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? (["_includes", "css", "js", "fonts", "images", "downloads"].includes(f) ? [] : walk(p)) : [p]; });
  files = walk(path.join(ROOT, "src")).map((p) => path.relative(ROOT, p)).filter((f) => /\.(md|json)$/.test(f) && /_(fr|nl)\b/.test(fs.readFileSync(path.join(ROOT, f), "utf8")));
}
let problems = 0;
for (const file of files) {
  const now = read(fs.readFileSync(path.join(ROOT, file), "utf8"), file);
  let before = null;
  try { before = read(execFileSync("git", ["show", `main:${file}`], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }), file); } catch (e) {}
  if (before && !same(strip(now), strip(before))) { problems++; console.log(`${file}: the English is not the same as on main`); }
  const out = [];
  missing(now, file, out);
  if (out.length) { problems += out.length; console.log(`${file}: ${out.length} missing\n  ${out.slice(0, 15).join("\n  ")}${out.length > 15 ? "\n  ..." : ""}`); }
}
console.log(problems ? `${problems} problems.` : `All ${files.length} files: English unchanged, every text in French and Dutch.`);
process.exitCode = problems ? 1 : 0;
