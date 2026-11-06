// Eleventy configuration for the Scheldt Youth Parliament website.
// Plain JavaScript, no plugins. See README.md for the everyday tasks.
const fs = require("fs");
const path = require("path");
const { mouthAcross, mouthDown } = require("./lib/river-shape");
const { scheldtRiver } = require("./lib/scheldt-river");
const { riverNature } = require("./lib/river-nature");
const { scheldtMap, scheldtSpot, scheldtJourney, scheldtCountries } = require("./lib/scheldt-map");
const { lineIcon } = require("./lib/line-icons");
const { socialIcon } = require("./lib/social-icons");
const { icon } = require("./lib/lucide-icons");
const { localize } = require("./lib/localize");
const { languages, englishUrl, localUrl } = require("./lib/languages");

module.exports = function (eleventyConfig) {
  // Files copied as they are into the finished site.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/downloads": "downloads" });

  // Page blocks (the browser editor, Output Claude/77): a page with "blocks" in its front matter is built from them by
  // src/_includes/page-blocks.njk. Texts in blocks are Markdown (bold, links, lists) and go through the same Markdown
  // library as the text of a page itself, so a page looks the same whether it is written as blocks or as text.
  //   markdown        a text of one or more paragraphs: "<p>...</p>"
  //   markdownInline  one line without its <p>, for a heading or a short label
  //   sentences       a heading split after each sentence, each in a <span> that site.css keeps together
  //                   ("Who can join? You can." becomes two spans; the heading then breaks between them).
  //                   A heading of one sentence stays as it is.
  let markdownLibrary;
  eleventyConfig.amendLibrary("md", (md) => {
    markdownLibrary = md;
  });
  eleventyConfig.addFilter("markdown", (text) => markdownLibrary.render(String(text || "")));
  eleventyConfig.addFilter("markdownInline", (text) => markdownLibrary.renderInline(String(text || "")));

  // Three languages (Tine, file 88; lib/localize.js, lib/languages.js). "localize" gives data in one language:
  // {{ joinCall | localize(L) }}. "localUrl" gives the French or Dutch address of an English page. "translations" lists
  // the versions of a page for the language switcher. "inLang" keeps the pages of one language in a collection.
  eleventyConfig.addFilter("localize", (data, lang) => localize(data, lang));
  eleventyConfig.addFilter("localUrl", localUrl);
  eleventyConfig.addFilter("translations", (url) => {
    const en = englishUrl(url);
    return languages.codes.map((code) => ({ code, url: localUrl(en, code), short: languages.short[code], name: languages.names[code] }));
  });
  // The language of a page in a collection is read from its address: a collection item does not carry the language yet.
  const urlLang = (url) => (String(url || "").match(/^\/(fr|nl)\//) || [])[1] || "en";
  eleventyConfig.addFilter("inLang", (items, lang) => (items || []).filter((x) => urlLang(x.url) === (lang || "en")));
  eleventyConfig.addFilter("sentences", (text) => {
    const parts = String(text || "").split(/(?<=[.?!])\s+/).filter(Boolean);
    if (parts.length < 2) return markdownLibrary.renderInline(String(text || ""));
    return parts.map((part) => `<span>${markdownLibrary.renderInline(part)}</span>`).join(" ");
  });
  // A file name with its ending, also when the browser editor writes a path ("/images/logos/hz.svg" becomes "hz.svg")
  eleventyConfig.addFilter("fileName", (p) => (p ? path.basename(String(p).trim()) : ""));

  // Collections: news posts (newest first) and exchanges (oldest first).
  eleventyConfig.addCollection("news", (api) =>
    api.getFilteredByGlob("src/news/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("exchanges", (api) =>
    api.getFilteredByGlob("src/exchanges/*.md").sort((a, b) => a.date - b.date)
  );

  // Date filters. Dates in front matter are written as 2026-06-25.
  const toDate = (d) => (d instanceof Date ? d : new Date(d));
  // In the language of the page: {{ date | longDate(L) }} gives 8 May 2026, 8 mai 2026 or 8 mei 2026 (languages.json).
  const locale = (lang) => languages.locales[lang] || "en-GB";
  eleventyConfig.addFilter("monthYear", (d, lang) =>
    toDate(d).toLocaleDateString(locale(lang), { month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("longDate", (d, lang) =>
    toDate(d).toLocaleDateString(locale(lang), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  // The file name without folder and extension, e.g. for the old news addresses in src/redirects.njk.
  eleventyConfig.addFilter("baseName", (p) => path.basename(String(p), path.extname(String(p))));
  eleventyConfig.addFilter("isoDate", (d) => toDate(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  // Projects of members, newest first: by the last year in "year" ("2022-2023" counts as 2023); the same year keeps the order of the file.
  eleventyConfig.addFilter("newestFirst", (items) => (items || []).map((x, i) => [x, i])
    .sort((a, b) => (Math.max(0, ...String(b[0].year || "").match(/\d{4}/g) || []) - Math.max(0, ...String(a[0].year || "").match(/\d{4}/g) || [])) || a[1] - b[1])
    .map(([x]) => x));
  // The projects on the homepage: those marked "home" in the editor, else all of them; newestFirst and limit(3) follow.
  eleventyConfig.addFilter("homeProjects", (items) => { const marked = (items || []).filter((x) => x.home); return marked.length ? marked : items || []; });
  eleventyConfig.addFilter("where", (arr, key, value) => (arr || []).filter((x) => x[key] === value));
  // The four newest news posts for the homepage (one big, three beside it; Tine, file 62), skipping posts with "latest: false".
  eleventyConfig.addFilter("homeNews", (posts) => (posts || []).filter((p) => p.data.latest !== false).slice(0, 4));
  // Previous and next page in a collection, for the exchange pages.
  eleventyConfig.addFilter("neighbours", (items, url) => {
    const i = (items || []).findIndex((x) => x.url === url);
    return { prev: i > 0 ? items[i - 1] : null, next: i >= 0 && i < items.length - 1 ? items[i + 1] : null };
  });

  // Pincode gate for the preview (Netlify edge function), same idea as appeltje-eitje.
  // After every build: fill the template with the pincode from site.json, or remove the gate.
  eleventyConfig.on("eleventy.after", () => {
    const site = JSON.parse(fs.readFileSync(path.join(__dirname, "src/_data/site.json"), "utf8"));
    const pincode = String(site.pincode || "").trim();
    const sjabloon = path.join(__dirname, "netlify/pincode-poort.js");
    const map = path.join(__dirname, "netlify/edge-functions");
    fs.rmSync(map, { recursive: true, force: true });
    if (!pincode) return;
    if (/["\\]/.test(pincode)) throw new Error("pincode in site.json may not contain quotes or a backslash");
    const code = fs.readFileSync(sjabloon, "utf8");
    if (!code.includes("__PINCODE__")) throw new Error("netlify/pincode-poort.js is missing the __PINCODE__ placeholder");
    fs.mkdirSync(map, { recursive: true });
    fs.writeFileSync(path.join(map, "pincode.js"), code.replace("__PINCODE__", pincode));
  });

  // Photo manifest (written by scripts/images.js), reloaded before every build.
  let photos = {};
  let photoCrop = {};
  eleventyConfig.on("eleventy.before", () => {
    try {
      photos = JSON.parse(fs.readFileSync(path.join(__dirname, "src/_data/photos.json"), "utf8"));
    } catch (e) {
      photos = {};
    }
    try {
      photoCrop = JSON.parse(fs.readFileSync(path.join(__dirname, "src/_data/photoCrop.json"), "utf8"));
    } catch (e) {
      photoCrop = {};
    }
  });
  // Which part of a photo stays visible when a frame crops it (src/_data/photoCrop.json).
  const cropStyle = (slug) => {
    const value = String(photoCrop[slug] || "").trim();
    if (!value) return "";
    const words = { top: "50% 0%", bottom: "50% 100%", left: "0% 50%", right: "100% 50%", center: "50% 50%", centre: "50% 50%" };
    const position = words[value] || value.replace(/[^0-9% .a-z]/gi, "");
    return ` style="object-position: ${position}"`;
  };

  // Link previews (Teams, WhatsApp, LinkedIn; Tine, file 80): a news post or exchange shares its own photo at 1200 x 630.
  // The layout asks for the address with "sharePhoto"; after the build every photo asked for is cut to size.
  // Wide photos are cropped around what stands out; upright and squarish ones stay whole on a blurred copy of themselves,
  // so nobody is cut off.
  const sharePhotos = new Set();
  eleventyConfig.on("eleventy.before", () => sharePhotos.clear());
  eleventyConfig.addFilter("sharePhoto", (value) => {
    const slug = photoSlug(value);
    if (!slug || !photos[slug]) return "";
    sharePhotos.add(slug);
    return `/images/share/${slug}.jpg`;
  });
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    if (!sharePhotos.size) return;
    const sharp = require("sharp");
    const out = path.join(dir.output, "images/share");
    fs.mkdirSync(out, { recursive: true });
    for (const slug of sharePhotos) {
      const src = path.join(__dirname, "src/images/photos", `${slug}.jpg`);
      const { width, height } = photos[slug];
      let img;
      if (width / height >= 1.5) {
        img = sharp(src).resize(1200, 630, { fit: "cover", position: sharp.strategy.attention });
      } else {
        const back = await sharp(src).resize(1200, 630, { fit: "cover" }).blur(24).modulate({ brightness: 0.85 }).toBuffer();
        const front = await sharp(src).resize(1200, 630, { fit: "inside" }).toBuffer();
        img = sharp(back).composite([{ input: front, gravity: "centre" }]);
      }
      await img.jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(out, `${slug}.jpg`));
    }
  });

  // Structured data for search engines (schema.org; Tine, file 81). The homepage says who we are, with the Dutch and French
  // names from site.alternateNames and GoodPlanet as the organisation behind it; each news post is an article.
  // Social links with "goodplanet" in the address belong to GoodPlanet, the others to SYP itself.
  eleventyConfig.addFilter("isoDate", (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : ""));
  eleventyConfig.addFilter("structuredData", (p, site) => {
    const abs = (u) => site.url + u;
    const social = Object.values(site.social || {}).filter(Boolean);
    const syp = { "@type": "Organization", "@id": abs("/#organization"), name: site.name, url: abs("/") };
    let data = null;
    if (p.url === "/") {
      data = {
        "@context": "https://schema.org",
        "@graph": [
          Object.assign({}, syp, {
            alternateName: site.alternateNames,
            description: site.description,
            logo: abs("/images/brand/syp-logo.png"),
            image: abs(site.shareImage),
            email: site.contactEmail || undefined,
            sameAs: social.filter((u) => !/goodplanet/i.test(u)),
            parentOrganization: {
              "@type": "Organization",
              name: "GoodPlanet Belgium",
              url: "https://www.goodplanet.be",
              sameAs: social.filter((u) => /goodplanet/i.test(u)),
            },
          }),
          { "@type": "WebSite", "@id": abs("/#website"), url: abs("/"), name: site.name, alternateName: site.alternateNames, inLanguage: "en", publisher: { "@id": abs("/#organization") } },
        ],
      };
    } else if (p.type === "news") {
      data = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: p.title,
        description: p.description,
        datePublished: p.date instanceof Date ? p.date.toISOString().slice(0, 10) : undefined,
        image: [abs(p.image)],
        mainEntityOfPage: abs(p.url),
        author: syp,
        publisher: Object.assign({}, syp, { logo: { "@type": "ImageObject", url: abs("/images/brand/syp-logo.png") } }),
      };
    }
    // "<" written as \u003c, so a title can never close the script tag early.
    return data ? `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>` : "";
  });

  const escapeAttr = (s) => String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  // A photo is named by its file name without ending ("ghent-2026-cafe"). The browser editor (Pages CMS, Output Claude/77)
  // writes a path instead ("/images/photos/ghent-2026-cafe.jpg", or the small "-800" version); both mean the same photo.
  const photoSlug = (p) => path.basename(String(p || "").trim(), path.extname(String(p || "").trim())).replace(/-800$/, "");
  eleventyConfig.addFilter("photoSlug", photoSlug);

  // {% photo "slug", "alt text", { sizes: "...", class: "...", eager: true } %}
  eleventyConfig.addShortcode("photo", function (slug, alt, opts = {}) {
    slug = photoSlug(slug);
    const meta = photos[slug];
    const sizes = opts.sizes || "(min-width: 1240px) 1200px, 100vw";
    const cls = opts.class ? ` class="${escapeAttr(opts.class)}"` : "";
    const loading = opts.eager ? "eager" : "lazy";
    const fetch = opts.eager ? ' fetchpriority="high"' : "";
    if (!meta) {
      return `<div class="photo-missing"${cls}>Photo "${escapeAttr(slug)}" not found. Put the original in photos-original/ and run: npm run images</div>`;
    }
    const base = `/images/photos/${slug}`;
    return (
      `<picture${cls}>` +
      `<source type="image/webp" srcset="${base}-800.webp 800w, ${base}.webp ${meta.width}w" sizes="${escapeAttr(sizes)}">` +
      `<img src="${base}.jpg" srcset="${base}-800.jpg 800w, ${base}.jpg ${meta.width}w" sizes="${escapeAttr(sizes)}" alt="${escapeAttr(alt)}" width="${meta.width}" height="${meta.height}" loading="${loading}" decoding="async"${fetch}${cropStyle(slug)}>` +
      `</picture>`
    );
  });

  // Gallery rows: photos keep their shape. Rows are filled until they are low enough,
  // a row that would stay too tall gets a maximum width instead of cropping.
  eleventyConfig.addFilter("galleryRows", (items) => {
    const WIDTH = 1200, GAP = 20, TARGET = 420, MAX_HEIGHT = 520;
    const ratio = (it) => { const m = photos[photoSlug(it.photo)]; return m ? m.width / m.height : 1.5; };
    const sum = (row) => row.reduce((t, it) => t + ratio(it), 0);
    const height = (row) => (WIDTH - GAP * (row.length - 1)) / sum(row);
    const rows = []; let row = [];
    for (const it of items || []) {
      row.push(it);
      if (height(row) <= TARGET) { rows.push(row); row = []; }
    }
    if (row.length) rows.push(row);
    return rows.map((r) => ({
      maxWidth: height(r) > MAX_HEIGHT ? Math.round(MAX_HEIGHT * sum(r) + GAP * (r.length - 1)) : null,
      items: r.map((it) => Object.assign({}, it, { ratio: Math.round(ratio(it) * 10000) / 10000 })),
    }));
  });

  // Waves follow the river: short, lively bends on the left and long, calm ones towards the right,
  // as the Scheldt settles on its way to the sea (the homepage timeline flows the same way).
  // xs are the crests and troughs from left to right, heights how far each one reaches from the middle line.
  const calmWave = (xs, heights, middle, up) => {
    const pts = xs.map((x, i) => [x, Math.round((middle + (i % 2 === (up ? 0 : 1) ? -1 : 1) * heights[i]) * 10) / 10]);
    return pts.reduce((d, [x, y], i) => {
      if (i === 0) return `M${x},${y}`;
      const [px, py] = pts[i - 1];
      const h = Math.round((x - px) * 0.4);
      return `${d} C${px + h},${py} ${x - h},${y} ${x},${y}`;
    }, "");
  };
  const WAVE_X = [0, 200, 460, 760, 1090, 1440];
  const WAVE_H = [11, 10, 8, 6, 4.5, 3];

  // Wave divider between two sections. {% wave "var(--deep)" %} or {% wave "var(--foam)", "b" %}
  // With "tide" a thin line follows the water a little higher, like the high-water mark on a quay wall (the Scheldt is tidal up to Ghent).
  // Every wave sways (Tine, file 62 for the homepage band; 5 Oct 2026: "everywhere there is such a wavy band, the footer
  // too"). Two drawings in one box:
  // - the still wave, the calm wave of before, lively on the left and calm on the right, for people who ask for less motion
  //   (site.css swaps them);
  // - a strip twice as wide whose wave repeats every 720 units, so it can slide by half its width without a seam. Its
  //   crests are even, as in the demo Tine chose from: a wave that calms to the right would show a seam when it slides.
  //   The tide line slides and breathes with the water.
  // site.css slides the strip and lets it rise and fall a little; js/sway.js (on every page) gives each wave its own speed
  // per visit and rests it off screen. {% swayWave %} is the same wave without a tide line (homepage, The Scheldt).
  const SWAY_PERIOD = 720, SWAY_AMP = 12;
  const swayLine = (middle) => `M0,${middle}` + Array.from({ length: (2880 / SWAY_PERIOD) * 2 }, (_, i) => {
    const x0 = (i * SWAY_PERIOD) / 2, y = middle + (i % 2 ? SWAY_AMP : -SWAY_AMP);
    const at = (share) => Math.round((x0 + SWAY_PERIOD * share) * 10) / 10;
    return ` C${at(0.18)},${y} ${at(0.32)},${y} ${at(0.5)},${middle}`;
  }).join("");
  const wave = (colour, variant = "a", tide = "") => {
    // A bare call hands over an empty string, not nothing, so a default in the arguments would draw a black wave.
    const fill = colour || "var(--deep)";
    const middle = variant === "b" ? 34 : 36;
    const stillLine = tide ? `<path class="wave-tide" d="${calmWave(WAVE_X, WAVE_H, middle - 12, variant === "b")}"></path>` : "";
    const swayTide = tide ? `<path class="wave-tide" d="${swayLine(middle - 12)}"></path>` : "";
    return `<div class="wave wave-sway" aria-hidden="true">` +
      `<svg class="wave-sway-still" viewBox="0 0 1440 64" preserveAspectRatio="none" focusable="false">${stillLine}<path d="${calmWave(WAVE_X, WAVE_H, middle, variant === "b")} L1440,64 L0,64 Z" fill="${fill}"></path></svg>` +
      `<div class="wave-sway-water"><svg class="wave-sway-strip" viewBox="0 0 2880 64" preserveAspectRatio="none" focusable="false">${swayTide}<path d="${swayLine(middle)} L2880,64 L0,64 Z" fill="${fill}"></path></svg></div>` +
      `</div>`;
  };
  eleventyConfig.addShortcode("wave", wave);
  eleventyConfig.addShortcode("swayWave", (colour) => wave(colour));

  // Wave accent around quotes: {% waveMark %} above, {% waveMark "md", "end" %} below.
  // Two long, flat lines of water with fading ends (site.css), calmer to the right like the big waves:
  // a clear line and a fainter one just below it, shifted a little, like a ripple following the first.
  // The one below the quote is mirrored, so the pair opens and closes the quote.
  const MARK_X = [0, 26, 56, 90, 128, 170, 220, 280];
  const MARK_H = [3.2, 3, 2.7, 2.4, 2, 1.6, 1.3, 1];
  const markLines =
    `<path d="${calmWave(MARK_X, MARK_H, 7, true)}" stroke-width="1.8" vector-effect="non-scaling-stroke"></path>` +
    `<path d="${calmWave(MARK_X, MARK_H, 13, true)}" stroke-width="1.2" stroke-opacity="0.5" vector-effect="non-scaling-stroke" transform="translate(14 0)"></path>`;
  eleventyConfig.addShortcode("waveMark", (size = "md", position = "start") =>
    `<svg class="wave-mark wave-mark-${size}${position === "end" ? " wave-mark-end" : ""}" viewBox="0 0 280 20" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g fill="none" stroke="var(--water)">${markLines}</g></svg>`
  );

  // A small sailing boat that drifts along one long, slow wave (Join, reviewer feedback 14, October 2026): {% boatWave %}.
  // Lucide's sailboat on a line drawn like the site's waves: three long bends, calmer to the right. The line stretches
  // with the width, its height does not, so a point of the wave is always at the same share of the width and the same
  // height: site.css can move the boat in shares of the width and let it rise, fall and lean in step with the line.
  // Its keyframes ("The sailing boat") follow BOAT_X and BOAT_H: change them together. A fainter line a little lower
  // and further on follows the first, like the ripple under the wave marks around quotes.
  const BOAT_X = [0, 300, 640, 1000];
  const BOAT_H = [8, 6.5, 5, 3.5];
  eleventyConfig.addShortcode("boatWave", () =>
    `<div class="boat-wave" aria-hidden="true">` +
    `<svg class="boat-wave-line" viewBox="0 0 1000 24" preserveAspectRatio="none" focusable="false"><path d="${calmWave(BOAT_X, BOAT_H, 10, true)}"></path><path class="boat-wave-ripple" d="${calmWave(BOAT_X, BOAT_H, 14.5, true)}" transform="translate(24 0)"></path></svg>` +
    `<div class="boat-x"><div class="boat-y"><div class="boat-tilt">${icon("sailboat", "boat")}</div></div></div>` +
    `</div>`
  );

  // Where an exchange took place along the Scheldt: {% scheldtMap riverMap %}, and {{ riverMap | scheldtSpot }}
  // for the position of the dot, so the place name can sit beside it (see lib/scheldt-map.js).
  // Places on the maps are [latitude, longitude]. In the files the browser editor rewrites (Output Claude/77) they are
  // written as text, which it keeps safely: "51.054, 3.722", or two places for a walk, "50.329, 3.395; 50.358, 3.523".
  const toPoint = (p) => (typeof p === "string" ? p.split(",").map((n) => parseFloat(n)) : p);
  const toPoints = (p) => (typeof p === "string" ? p.split(";").map((pair) => toPoint(pair.trim())) : p);
  const withPoints = (list) => (list || []).map((s) => ({ ...s, places: toPoints(s.places) }));
  const withPoint = (list) => (list || []).map((b) => ({ ...b, place: toPoint(b.place) }));
  eleventyConfig.addShortcode("scheldtMap", (places, label) => scheldtMap(toPoints(places), label));
  eleventyConfig.addShortcode("scheldtJourney", (stops, borders, label) => scheldtJourney(withPoints(stops), withPoint(borders), label));
  // "One river, three countries" (About page): the Scheldt with a soft band per country, {% scheldtCountries countriesMap %}
  // with countriesMap in the front matter (label, sea, countries, borders, places; see lib/scheldt-map.js). Tine, file 63.
  eleventyConfig.addShortcode("scheldtCountries", (data) => scheldtCountries(data));
  eleventyConfig.addFilter("scheldtSpot", (places) => scheldtSpot(toPoints(places)));

  // The source of all three rivers (Timeline page, homepage, "How it works"): a drop like the one in our logo, the river runs out of it.
  const DROP = "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z";
  const SOURCE = `<svg class="river-source" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${DROP}"></path></svg>`;

  // A short river for "How it works" (blocks/journey.njk), drawn like the homepage river: it follows the bends of the
  // real Scheldt (lib/scheldt-river.js), down the page on phones, across it on wide screens, turned so the bends are the
  // real ones and not their mirror image. Two points of the real river per piece, as on the homepage.
  // {% set river = steps | length | journeyRiver %}. The first step is the source, a drop as on the other two rivers;
  // the last one opens into the sea.
  eleventyConfig.addFilter("journeyRiver", (count) => {
    const stops = Math.max(count - 1, 1);
    const river = scheldtRiver(stops, 2);
    const round = (n) => Math.round(n * 1000) / 1000;
    const pieces = Array.from({ length: stops }, (_, k) => k);
    return {
      // cross: where a step lies across the band when the river runs down (phones); crossY: across the band when it
      // runs to the right (wide screens), as --c and --cy on the homepage.
      cross: river.cross.map(round),
      crossY: river.cross.map((c) => round(1 - c)),
      // Where the river runs high in the band on wide screens, reeds and gulls go under it, so they stay inside the band.
      decoBelow: river.cross.map((c) => 1 - c < 0.35),
      sides: [river.sides[0] === "a" ? "b" : "a"].concat(river.sides),
      across: pieces.map((k) => river.across(k)),
      down: pieces.map((k) => river.down(k)),
      widths: pieces.map((k) => round(river.width(k))),
      endWidth: round(river.width(stops)),
      mouthAcross: mouthAcross(1 - river.cross[stops]),
      mouthDown: mouthDown(river.cross[stops], 48),
      source: SOURCE,
    };
  });
  // Reeds or gulls beside a river: {% riverNature "gulls" %} (see lib/river-nature.js).
  eleventyConfig.addShortcode("riverNature", (type) => riverNature(type));

  // Small line icon: {% lineIcon "voice" %} (see lib/line-icons.js for the names).
  eleventyConfig.addShortcode("lineIcon", (name, cls) => lineIcon(name, cls));

  // Lucide icon: {% icon "landmark" %} or {% icon "play", "my-class" %} (see lib/lucide-icons.js for the names).
  eleventyConfig.addShortcode("icon", (name, cls) => icon(name, cls));

  // Round social media icon: {% socialIcon "instagram" %} (see lib/social-icons.js; the whole row is blocks/social-icons.njk).
  const RIVER_WORDS = { en: { today: "Today", readAbout: "Read about " }, fr: { today: "Aujourd'hui", readAbout: "Découvrir " }, nl: { today: "Vandaag", readAbout: "Lees over " } };
  let riverWords = RIVER_WORDS.en;
  eleventyConfig.addShortcode("socialIcon", (name) => socialIcon(name));

  // River timeline on the Timeline page: {% river timeline, "timeline", riverNote %} (the homepage version is below).
  // Every stop is a list item, and so are the source at the top and "Today", between what happened and what is coming.
  // Each item draws its own piece of the river, from 13px below its top (the middle of a dot) to 13px below the top
  // of the next item, so the pieces join up. The shape (bends, width) is the real Scheldt, from lib/scheldt-river.js:
  // each stop on the apex of a real bend, its text on the outer side of that bend.
  const timelineRiver = (list, note) => {
    const river = scheldtRiver(list.length);
    const sides = river.sides;
    const rows = [{ kind: "head", k: 0, x: river.cross[0] }];
    list.forEach((e, i) => {
      rows.push({ kind: "stop", e, k: i + 1, x: river.cross[i + 1] });
      const next = list[i + 1];
      if (e.era !== "upcoming" && next && next.era === "upcoming") rows.push({ kind: "today", k: i + 1 });
    });
    // "Today" lies on the bend between the last stop that happened and the first one to come.
    rows.forEach((r, n) => { if (r.kind === "today") r.x = (rows[n - 1].x + rows[n + 1].x) / 2; });
    const today = rows.findIndex((r) => r.kind === "today");
    const pct = (x) => Math.round(x * 1000) / 10;
    // Side rivers flow in where they meet the real Scheldt (Scarpe, Haine, Lys, Dender, Rupel): thin lines that fade in
    // from beyond the bank, like the many small flows of the motto at the end of the page.
    const tribs = (k, n) =>
      river.tributaries(k).map((t, j) => {
        const id = `river-trib-${n}-${j}`;
        const from = t.d.startsWith("M-") ? 0 : 1;
        return `<defs><linearGradient id="${id}" x1="${from}" y1="0" x2="${1 - from}" y2="0"><stop offset="0" stop-color="#1895D3" stop-opacity="0"></stop><stop offset="0.6" stop-color="#1895D3"></stop></linearGradient></defs><path class="river-trib" d="${t.d}" vector-effect="non-scaling-stroke" style="stroke:url(#${id})"></path>`;
      }).join("");
    const seg = (d, k, dashed, extra = "") =>
      `<svg class="river-seg river-seg-v${dashed ? " is-dashed" : ""}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${extra}<path d="${d}" vector-effect="non-scaling-stroke" style="stroke-width:${river.width(k).toFixed(2)}px"></path></svg>`;
    // From one stop to the next the river follows the Scheldt; from the source and through "Today" it makes one soft S.
    // From "Today" on the river is dotted: what is still to come.
    const piece = (n) => {
      const r = rows[n], next = rows[n + 1];
      const real = r.kind === "stop" && next.kind === "stop";
      const d = real ? river.down(r.k) : `M${pct(r.x)},0 C${pct(r.x)},50 ${pct(next.x)},50 ${pct(next.x)},100`;
      return seg(d, r.k, today !== -1 && n >= today, real ? tribs(r.k, n) : "");
    };
    // The sea after the last stop: the line runs on beside the last entry, then the banks open wide and the water fades,
    // just above the motto (Tine, file 50). Two drawings: "wide" opens towards the middle of the page, where the motto sits
    // (it assumes the river band and sea of wide screens, 120 and 440 px in site.css); "narrow" opens around the river itself.
    const sea = (r) => {
      const dashed = r.e.era === "upcoming";
      const colour = dashed ? "#1895D3" : "#1376A7";
      const draw = (cls, top) => {
        const id = `river-sea-${cls}`;
        const t = Math.round(top * 10) / 10;
        return `<svg class="river-sea river-sea-${cls}${dashed ? " is-dashed" : ""}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#1895D3" stop-opacity="0.35"></stop><stop offset="1" stop-color="#1895D3" stop-opacity="0"></stop></linearGradient><linearGradient id="${id}-line" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="85"><stop offset="0" stop-color="${colour}"></stop><stop offset="1" stop-color="${colour}" stop-opacity="0"></stop></linearGradient></defs><path d="M${t - 0.6},0 L${t - 0.6},42 C${t - 0.6},66 14,82 0,100 L100,100 C86,82 ${t + 0.6},66 ${t + 0.6},42 L${t + 0.6},0 Z" style="fill:url(#${id}-fill)"></path><path class="river-sea-line" d="M${t},0 L${t},42 C${t},62 50,66 50,85" vector-effect="non-scaling-stroke" style="stroke:url(#${id}-line);stroke-width:${river.width(list.length).toFixed(2)}px"></path></svg>`;
      };
      return draw("wide", 50 + ((r.x - 0.5) * 120 * 100) / 440) + draw("narrow", 50);
    };
    // The source: a drop, like the drop in our logo (Tine, file 50).
    const items = rows.map((r, n) => {
      const style = `--c:${r.x.toFixed(3)}`;
      if (r.kind === "head") {
        // Beside the source, on the side of the first stop: one line on what the river is ("riverNote" in timeline.md; Tine, file 53).
        const line = note ? `<p class="river-note">${note}</p>` : "";
        return `<li class="river-item river-head side-${sides[0]}"${line ? "" : ' aria-hidden="true"'} style="${style}"><div class="river-mid" aria-hidden="true">${SOURCE}${piece(n)}</div>${line}</li>`;
      }
      if (r.kind === "today") {
        // "Today" is read where it is shown: after the last stop that already happened.
        return `<li class="river-item river-today" style="${style}"><div class="river-mid">${piece(n)}<span class="river-marker is-today">${riverWords.today}</span></div></li>`;
      }
      const e = r.e;
      const upcoming = e.era === "upcoming";
      const last = n === rows.length - 1;
      const next = rows[n + 1];
      const date = e.date ? `<div class="river-date">${e.date}</div>` : "";
      const link = e.url ? `<a class="link-arrow" href="${e.url}">${e.linkLabel || riverWords.readAbout + (e.cardTitle || e.title)}</a>` : "";
      // No photos on the Timeline page. Rhythm comes from the entries themselves (src/_data/timeline.json):
      // "chapter" puts a large year number beside the river, "weight" is "milestone" (larger) or "minor" (compact),
      // "figure" adds one key number.
      const chapter = e.chapter ? `<div class="river-chapter" aria-hidden="true">${e.chapter[0]}${e.chapter[1] ? `<small>${e.chapter[1]}</small>` : ""}</div>` : "";
      const figure = e.figure ? `<div class="river-figure"><span class="river-figure-number">${e.figure.number}</span> ${e.figure.label}</div>` : "";
      // Nature along the banks: an entry can ask for a drawing with "nature": "reeds" or "gulls" (lib/river-nature.js).
      const nature = e.nature ? riverNature(e.nature) : "";
      // Extra room before a new chapter.
      const extra = `${next && next.kind === "stop" && next.e.chapter ? " has-break" : ""}${e.chapter ? " has-chapter" : ""}${e.weight ? ` is-${e.weight}` : ""}`;
      // Each stop title is a heading on the Timeline page, so screen readers and skimmers can jump from stop to stop.
      // A small moment shows its date and title; the title is a button that opens the text (js/timeline.js).
      // The heading stays a heading. Without JavaScript the text simply shows.
      const fold = e.weight === "minor" && e.text;
      const title = fold
        ? `<h2 class="river-title"><button class="river-toggle" type="button" aria-expanded="false" aria-controls="river-text-${n}">${e.title}<span class="river-toggle-icon" aria-hidden="true"></span></button></h2>`
        : `<h2 class="river-title">${e.title}</h2>`;
      const card = `${chapter}<div class="river-entry${upcoming ? " is-upcoming" : ""}"><div class="river-entry-text">${date}${title}<div class="river-text"${fold ? ` id="river-text-${n}"` : ""}>${e.text || ""}</div>${link}</div></div>${figure}`;
      // "id" in timeline.json is the moment's address, /timeline/#2015-senate-plenary: the homepage river links there,
      // and the moment lights up and opens (Tine, file 62, October 2026; site.css .river-stop:target, js/timeline.js).
      const anchor = e.id ? ` id="${e.id}"` : "";
      return `<li${anchor} class="river-item river-stop side-${sides[r.k - 1]} ${upcoming ? "is-upcoming" : "is-past"}${extra}" style="${style}"><div class="river-mid"><span class="river-dot"></span>${last ? sea(r) : piece(n)}${nature}</div>${card}</li>`;
    });
    return `<div class="river river-timeline"><ol class="river-track">${items.join("")}</ol></div>`;
  };

  // River timeline on the homepage: {% river timeline, "home" %}. Like the Timeline page it follows the bends of the real
  // Scheldt (lib/scheldt-river.js): down the page on phones, across it on wide screens. The estuary is from lib/river-shape.js.
  eleventyConfig.addShortcode("river", function (entries, mode = "home", note = "") {
    // The few words the river writes itself, in the language of the page (Tine, file 88)
    const lang = (String((this.page && this.page.url) || "").match(/^\/(fr|nl)\//) || [])[1];
    riverWords = RIVER_WORDS[lang] || RIVER_WORDS.en;
    if (mode === "timeline") return timelineRiver(entries.slice(), note);
    // Home shows only the highlights marked "home": true in timeline.json, from 2008 to the next group (Tine's choice A, file 45).
    const list = entries.filter((e) => e.home);
    // Two points of the real river per piece: the pieces here are short, and more small bends would look restless.
    const river = scheldtRiver(list.length, 2);
    const sides = river.sides;
    // --c: where a stop lies across the band when the river runs down (phones); --cy: across the band when it runs to the
    // right (wide screens), turned so the bends are not mirrored (lib/scheldt-river.js, across).
    const place = (k) => `--c:${river.cross[k].toFixed(3)};--cy:${(1 - river.cross[k]).toFixed(3)}`;
    // Side rivers flow in where they meet the real Scheldt, as on the Timeline page: thin lines that fade in from beyond
    // the bank. Across the page the Scheldt's left bank is at the top, so they fade in from above or below.
    const tribs = (k, dir) =>
      river.tributaries(k, dir === "h").map((t, j) => {
        const id = `river-trib-home-${k}-${j}-${dir}`;
        const from = t.bank === "left" ? 1 : 0;
        const grad = dir === "h" ? `x1="0" y1="${1 - from}" x2="0" y2="${from}"` : `x1="${from}" y1="0" x2="${1 - from}" y2="0"`;
        return `<defs><linearGradient id="${id}" ${grad}><stop offset="0" stop-color="#1895D3" stop-opacity="0"></stop><stop offset="0.6" stop-color="#1895D3"></stop></linearGradient></defs><path class="river-trib" d="${t.d}" vector-effect="non-scaling-stroke" style="stroke:url(#${id})"></path>`;
      }).join("");
    const svg = (cls, d, k, dashed, extra) =>
      `<svg class="river-seg ${cls}${dashed ? " is-dashed" : ""}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${extra}<path d="${d}" vector-effect="non-scaling-stroke" style="stroke-width:${river.width(k).toFixed(2)}px"></path></svg>`;
    const segs = (k, dashed) => svg("river-seg-h", river.across(k), k, dashed, tribs(k, "h")) + svg("river-seg-v", river.down(k), k, dashed, tribs(k, "v"));
    const mouth = (dashed) => {
      const k = list.length;
      const draw = (cls, viewBox, shape, gradient) =>
        `<svg class="river-mouth ${cls}${dashed ? " is-dashed" : ""}" viewBox="${viewBox}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><linearGradient id="river-sea-home-${cls}" ${gradient}><stop offset="0" stop-color="#1895D3" stop-opacity="0.5"></stop><stop offset="1" stop-color="#1895D3" stop-opacity="0"></stop></linearGradient></defs><path class="river-mouth-funnel" d="${shape.funnel}" style="fill:url(#river-sea-home-${cls});stroke:none"></path><path class="river-mouth-line" d="${shape.line}" vector-effect="non-scaling-stroke" style="stroke-width:${river.width(k).toFixed(2)}px"></path></svg>`;
      return draw("river-mouth-h", "0 0 75 100", mouthAcross(1 - river.cross[k]), 'x1="0" y1="0" x2="1" y2="0"') + draw("river-mouth-v", "0 0 100 100", mouthDown(river.cross[k], 64), 'x1="0" y1="0" x2="0" y2="1"');
    };
    // Nature along the banks: an entry in src/_data/timeline.json can ask for a drawing with "nature": "reeds" or "gulls";
    // "homeNature" is for the homepage only (the reeds by the source: on the Timeline page they stand by the run-up, which is not on home).
    const nature = (k) => {
      const e = list[k - 1];
      const type = e && (e.homeNature || e.nature);
      return type ? riverNature(type) : "";
    };
    const items = [
      `<li class="river-item river-start side-a" style="${place(0)}"><div class="river-start-inner"><a class="btn btn-small" href="/timeline/">See the full timeline</a></div><div class="river-mid">${SOURCE}${segs(0, list[0] && list[0].era === "upcoming")}</div></li>`,
    ];
    list.forEach((e, i) => {
      const k = i + 1;
      const next = list[i + 1];
      const upcoming = e.era === "upcoming";
      const lines = next ? segs(k, next.era === "upcoming") : mouth(upcoming);
      const date = e.date ? `<div class="river-date">${e.date}</div>` : "";
      // Each card: an icon in the river's blue ("icon", lib/lucide-icons.js), the date, a title of at most three words
      // ("cardTitle") and the short sentence, which on a computer opens on hover or focus (site.css). Every card is one
      // link (Tine, file 62, October 2026): to its own page ("url"), or else to the moment on the Timeline page, derived
      // from its "id" so the address is written only once.
      const href = e.url || (e.id ? `/timeline/#${e.id}` : "");
      // "homeCta" turns a card into the invitation (designer feedback, 5 October 2026: "Your turn next" must stand out and make
      // people click): a lime card, its sentence always showing, and a button inside with these words. The whole card stays
      // one link, so the button is a look, not a second link. GoatCounter counts the clicks, as on the join call.
      const cta = e.homeCta && href;
      const body = `${e.icon ? icon(e.icon) : ""}${date}<div class="mini-card-title">${e.cardTitle || e.title}</div><div class="mini-card-text">${e.short || e.text || ""}</div>${cta ? `<span class="river-card-cta">${e.homeCta}</span>` : ""}`;
      const cls = `river-card mini-card${upcoming ? " is-upcoming" : ""}${cta ? " is-cta" : ""}`;
      const count = cta ? ` data-goatcounter-click="river-join" data-goatcounter-title="${e.homeCta} (homepage river)" data-goatcounter-referrer="/"` : "";
      const card = href ? `<a class="${cls}" href="${href}"${count}>${body}</a>` : `<div class="${cls}">${body}</div>`;
      items.push(
        `<li class="river-item river-stop side-${sides[i]} ${upcoming ? "is-upcoming" : "is-past"}${cta ? " is-cta" : ""}" style="${place(k)}"><div class="river-mid"><span class="river-dot"></span>${lines}${nature(k)}</div>${card}</li>`
      );
    });
    // --n: the number of stops, so the river fills the text column whatever the number of highlights (site.css).
    return `<div class="river river-home" style="--n:${list.length}"><ol class="river-track">${items.join("")}</ol></div>`;
  });

  // Show every [TODO ...] marker as a visible highlight, so nothing missing is overlooked.
  eleventyConfig.addTransform("todoMarks", function (content) {
    const out = this.page && this.page.outputPath;
    if (!out || !out.endsWith(".html")) return content;
    return content.replace(/(<[^>]*>)|(\[TODO[^\]]*\])/g, (m, tag, todo) => (tag ? tag : `<mark class="todo-mark">${todo}</mark>`));
  });

  // Launch guard: at launch (empty "pincode" in site.json) no [TODO] may stay visible.
  // After the build, count the marks from the transform above in the pages that were written.
  // At launch `npm run build` fails with the list, so publiceer.command publishes nothing;
  // in the preview (PIN set) it only logs one line. The dev server only warns, so it keeps running.
  // To test the launch check without emptying the pincode: SYP_LAUNCH_CHECK=1 npx @11ty/eleventy --output=/tmp/syp-test
  // Skipped: the review page and the style guide, which only exist in the preview (relecture.11tydata.js, styleguide.11tydata.js); the style guide shows the markers on purpose.
  const PREVIEW_ONLY = ["/relecture/", "/styleguide/"];
  eleventyConfig.on("eleventy.after", ({ results, runMode }) => {
    const site = JSON.parse(fs.readFileSync(path.join(__dirname, "src/_data/site.json"), "utf8"));
    const launch = !String(site.pincode || "").trim() || process.env.SYP_LAUNCH_CHECK === "1";
    const pages = [];
    for (const r of results || []) {
      if (!r || !String(r.outputPath || "").endsWith(".html") || PREVIEW_ONLY.includes(r.url)) continue;
      // Plain text of each marker: no tags, the usual entities back as characters, first 80 characters.
      const marks = [...String(r.content).matchAll(/<mark class="todo-mark">([\s\S]*?)<\/mark>/g)].map((m) =>
        m[1]
          .replace(/<[^>]*>/g, "")
          .replace(/&(#39|quot|amp|lt|gt);/g, (e, name) => ({ "#39": "'", quot: '"', amp: "&", lt: "<", gt: ">" })[name])
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 80)
      );
      if (marks.length) pages.push({ url: r.url, marks });
    }
    // The candidate quotes (Youth voices) and the "Candidate quote, source" lines (exchange pages) are working notes,
    // not [TODO] markers: at launch they count as one marker until "showCandidateQuotes" in site.json is false.
    if (launch && site.showCandidateQuotes) {
      pages.push({ url: "src/_data/site.json", marks: ["showCandidateQuotes is still true: set it to false to hide the candidate quotes"] });
    }
    pages.sort((a, b) => a.url.localeCompare(b.url));
    const total = pages.reduce((t, p) => t + p.marks.length, 0);
    if (!total) return;
    const where = pages.map((p) => `${p.url} (${p.marks.length})`).join(", ");
    if (!launch) {
      console.log(`[TODO] ${total} visible markers on ${pages.length} pages, fine in the preview but not at launch: ${where}`);
      return;
    }
    const list = pages.map((p) => `  ${p.url} (${p.marks.length})\n` + p.marks.map((m) => `    - ${m}`).join("\n")).join("\n");
    const message = `Launch check: ${total} [TODO] markers are still visible on ${pages.length} pages. Remove them before the launch:\n${list}`;
    if (runMode !== "build") return void console.warn(message);
    // Eleventy prints a thrown error twice with its stack trace, so the long list goes out once here
    // and the error itself stays short.
    console.error(message);
    const error = new Error(`Launch check failed: ${total} [TODO] markers on ${pages.length} pages, see the list above.`);
    error.skipOriginalStack = true;
    throw error;
  });

  // On a French or Dutch page every link to a page of this site goes to that page in the same language (Tine, file 88),
  // also links typed in a text ("/timeline/" becomes "/fr/chronologie/"). The language switcher (hreflang) is left alone.
  eleventyConfig.addTransform("localLinks", function (content) {
    const out = this.page && this.page.outputPath;
    if (!out || !out.endsWith(".html")) return content;
    const lang = (String(this.page.url || "").match(/^\/(fr|nl)\//) || [])[1];
    if (!lang) return content;
    return content.replace(/<a\b[^>]*>/g, (tag) => (/\bhreflang=/.test(tag) ? tag
      : tag.replace(/\bhref="(\/(?!\/)[^"]*)"/, (m, url) => `href="${localUrl(url, lang)}"`)));
  });

  // French pages: the space before : ; ? ! » and after « becomes a non-breaking space, so the sign never starts a new line
  // (Tine, 6 November 2026). Only in the text between tags, never in tags, scripts or styles. The texts themselves stay
  // as they are, so a save in the editor never changes them.
  eleventyConfig.addTransform("frenchSpaces", function (content) {
    const out = this.page && this.page.outputPath;
    if (!out || !out.endsWith(".html") || !/^\/fr\//.test(String(this.page.url || ""))) return content;
    return content.replace(/(<(script|style|textarea)\b[\s\S]*?<\/\2>)|>([^<]+)</g, (m, skip, tag, text) => skip ? skip
      : ">" + text.replace(/ ([:;?!\u00bb])/g, "\u00a0$1").replace(/\u00ab /g, "\u00ab\u00a0") + "<");
  });

  // Make every root-relative link relative, so the site works on any domain, subdomain or folder.
  eleventyConfig.addTransform("relativeLinks", function (content) {
    const out = this.page && this.page.outputPath;
    if (!out || !out.endsWith(".html")) return content;
    // The 404 page is served at every missing address, so relative links would break there.
    if (this.page.url === "/404.html") return content;
    const url = this.page.url || "/";
    const parts = url.split("/").filter(Boolean);
    const depth = url.endsWith("/") ? parts.length : Math.max(parts.length - 1, 0);
    const prefix = depth ? "../".repeat(depth) : "./";
    const rel = (u) => (u === "/" ? prefix : prefix + u.slice(1));
    return content
      .replace(/\b(href|src|poster|action)="\/(?!\/)([^"]*)"/g, (m, attr, rest) => `${attr}="${rel("/" + rest)}"`)
      .replace(/\bsrcset="([^"]*)"/g, (m, list) => {
        const fixed = list
          .split(",")
          .map((s) => s.trim())
          .map((s) => (s.startsWith("/") && !s.startsWith("//") ? rel(s.split(/\s+/)[0]) + s.slice(s.split(/\s+/)[0].length) : s))
          .join(", ");
        return `srcset="${fixed}"`;
      });
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
