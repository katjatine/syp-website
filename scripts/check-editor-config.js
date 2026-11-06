// Checks .pages.yml against the site's files: every key in a page is a field in the editor (or is kept at the top level
// by settings.content.merge), every value passes the field's pattern and every select value is one of its options.
// Run with: node scripts/check-editor-config.js      Nothing is changed.
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const ROOT = path.join(__dirname, "..");
const config = yaml.load(fs.readFileSync(path.join(ROOT, ".pages.yml"), "utf8"));
const components = config.components || {};
let problems = 0;
const say = (where, msg) => { problems++; console.log(`${where}: ${msg}`); };

const resolve = (f) => (f.component ? { ...components[f.component], ...f, type: components[f.component].type } : f);
const readFile = (file, format) => {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (format === "json") return JSON.parse(text);
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const data = yaml.load(m[1]) || {};
  if (m[2].trim()) data.body = m[2];
  return data;
};
const optionValues = (f) => (f.options && f.options.values || []).map((v) => (typeof v === "object" ? v.name : v));

function checkValue(field, value, where) {
  field = resolve(field);
  if (value === undefined || value === null || value === "") return;
  if (field.list && !(field.list === false)) {
    if (!Array.isArray(value)) return say(where, "should be a list");
    const single = { ...field, list: false };
    value.forEach((v, i) => checkValue(single, v, `${where}[${i}]`));
    if (field.list.max && value.length > field.list.max) say(where, `more than ${field.list.max} items`);
    return;
  }
  if (Array.isArray(value)) return say(where, "is a list, the field is not");
  switch (field.type) {
    case "object": return checkObject(field.fields, value, where, false);
    case "block": {
      const def = (field.blocks || []).find((b) => b.name === value[field.blockKey || "_block"]);
      if (!def) return say(where, `block type "${value[field.blockKey]}" is not offered here`);
      const fields = def.component ? components[def.component].fields : def.fields;
      return checkObject(fields, value, where, false, [field.blockKey || "_block"]);
    }
    case "select": if (!optionValues(field).includes(value)) say(where, `"${value}" is not one of ${optionValues(field).join(", ")}`); return;
    case "boolean": if (typeof value !== "boolean") say(where, "should be true or false"); return;
    case "number": if (typeof value !== "number") say(where, "should be a number"); return;
    case "date": return;
    case "image": case "file": {
      // As Pages CMS does (fields/core/image): the output prefix becomes the input folder, then folder and extension must fit.
      const media = (config.media || []).find((m) => m.name === (field.options && field.options.media)) || (config.media || [])[0];
      if (!media) return;
      if (typeof value !== "string") return say(where, "should be a path");
      const p = value.startsWith(media.output + "/") ? media.input + value.slice(media.output.length) : value;
      const exts = (field.options && field.options.extensions) || media.extensions || [];
      if (!p.startsWith(media.input + "/")) say(where, `"${value}" does not start with ${media.output}/`);
      else if (exts.length && !exts.includes(path.extname(p).slice(1).toLowerCase())) say(where, `"${value}" is not ${exts.join(", ")}`);
      return;
    }
    default: {
      if (typeof value === "object" && !(value instanceof Date)) return say(where, "is an object, the field is " + field.type);
      // Pages CMS checks string, text and rich-text with z.string(): a number, true/false or a date is refused.
      if (typeof value !== "string") return say(where, `is ${value instanceof Date ? "a date" : "a " + typeof value}, the editor expects text: ${String(value)}`);
      const p = field.pattern;
      if (p && !new RegExp(typeof p === "string" ? p : p.regex).test(String(value))) say(where, `fails "${(p.message || p)}": ${String(value).slice(0, 80)}`);
    }
  }
}
function checkObject(fields, data, where, topLevel, skip = []) {
  if (typeof data !== "object" || data === null) return say(where, "should be an object");
  const names = new Set(fields.map((f) => resolve(f).name));
  for (const [k, v] of Object.entries(data)) {
    if (skip.includes(k)) continue;
    if (!names.has(k)) { if (!topLevel) say(where, `key "${k}" is not a field (Pages CMS may drop it)`); continue; }
    checkValue(fields.find((f) => resolve(f).name === k), v, `${where}.${k}`);
  }
}

for (const entry of config.content) {
  if (entry.type === "file") {
    const data = readFile(entry.path, entry.format);
    if (entry.list) data.forEach((item, i) => checkObject(entry.fields, item, `${entry.path}[${i}]`, false));
    else checkObject(entry.fields, data, entry.path, true);
  } else if (entry.type === "collection") {
    for (const f of fs.readdirSync(path.join(ROOT, entry.path)).filter((f) => f.endsWith(".md"))) {
      checkObject(entry.fields, readFile(path.join(entry.path, f), entry.format), path.join(entry.path, f), true);
    }
  }
}
console.log(problems ? `${problems} problems.` : "All files fit the editor configuration.");
// On Netlify a problem stops the build (netlify.toml), so the previous version stays online.
process.exitCode = problems ? 1 : 0;
