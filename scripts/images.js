// Turns the originals in photos-original/ into web photos in src/images/photos/.
// Each photo becomes: name.webp and name.jpg (longest side 1600 px, under 200 KB)
// plus name-800.webp and name-800.jpg for small screens.
// Originals whose name starts with "reserve-" stay in photos-original/ and are not published.
// Photos uploaded in the browser editor (Pages CMS, Output Claude/77) land straight in src/images/photos/ as one large
// file. They are made into web photos the same way, in place: on Netlify, which runs this script before every build
// (netlify.toml), and on a laptop, where the upload is also copied to photos-original/ so it stays with the others.
// Run with: npm run images      (add --force to redo photos that already exist)
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "photos-original");
const OUT = path.join(ROOT, "src", "images", "photos");
const MANIFEST = path.join(ROOT, "src", "_data", "photos.json");
const MAX_WIDTH = 1600;
const SMALL_WIDTH = 800;
const MAX_BYTES = 200 * 1024;
const force = process.argv.includes("--force");

async function encode(input, width, format, quality) {
  const p = sharp(input).rotate().resize({ width, height: width, fit: "inside", withoutEnlargement: true });
  return format === "webp" ? p.webp({ quality, effort: 6 }).toBuffer() : p.jpeg({ quality, mozjpeg: true }).toBuffer();
}

// Finds a width and quality where both the JPEG and the WebP stay under the size limit.
async function encodePair(input, maxWidth) {
  let result = null;
  for (const width of [maxWidth, Math.round(maxWidth * 0.85), Math.round(maxWidth * 0.7), Math.round(maxWidth * 0.55)]) {
    let jpg = null, webp = null;
    for (let q = 80; q >= 34; q -= 6) {
      jpg = await encode(input, width, "jpeg", q);
      if (jpg.length <= MAX_BYTES) break;
    }
    for (let q = 82; q >= 34; q -= 6) {
      webp = await encode(input, width, "webp", q);
      if (webp.length <= MAX_BYTES) break;
    }
    result = { jpg, webp };
    if (jpg.length <= MAX_BYTES && webp.length <= MAX_BYTES) break;
  }
  return result;
}

// Writes the four web versions of one photo and returns its size for the manifest.
async function makeWebPhotos(input, slug) {
  const large = await encodePair(input, MAX_WIDTH);
  const small = await encodePair(input, SMALL_WIDTH);
  const big = large.jpg, bigWebp = large.webp;
  fs.writeFileSync(path.join(OUT, slug + ".jpg"), big);
  fs.writeFileSync(path.join(OUT, slug + ".webp"), bigWebp);
  fs.writeFileSync(path.join(OUT, slug + "-800.jpg"), small.jpg);
  fs.writeFileSync(path.join(OUT, slug + "-800.webp"), small.webp);
  const meta = await sharp(big).metadata();
  console.log("made   ", slug, `${meta.width}x${meta.height}`, `jpg ${Math.round(big.length / 1024)} KB`, `webp ${Math.round(bigWebp.length / 1024)} KB`);
  return { width: meta.width, height: meta.height };
}

// Photos uploaded in the browser editor: a .jpg, .jpeg or .png in src/images/photos/ that is not in the manifest yet and
// is not one of the small versions. A photo that cannot be read is left out with a warning, so one bad upload never
// stops the publication: the page then shows it as missing instead.
async function processUploads(manifest) {
  if (!fs.existsSync(OUT)) return;
  const uploads = fs.readdirSync(OUT).filter((f) => /\.(jpe?g|png)$/i.test(f) && !/-800\.jpe?g$/i.test(f) && !manifest[path.parse(f).name]);
  for (const file of uploads) {
    const input = path.join(OUT, file);
    const slug = path.parse(file).name;
    try {
      const original = fs.readFileSync(input);
      if (fs.existsSync(SRC)) fs.writeFileSync(path.join(SRC, file), original);
      manifest[slug] = await makeWebPhotos(original, slug);
      if (path.extname(file).toLowerCase() !== ".jpg") fs.unlinkSync(input);
    } catch (e) {
      console.warn("skipped", file, "(could not read this photo:", e.message + ")");
    }
  }
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch (e) {}
  await processUploads(manifest);
  if (!fs.existsSync(SRC)) {
    // On Netlify there is no photos-original/: only the uploads above are made, nothing is removed.
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
    console.log(`No photos-original/ folder. ${Object.keys(manifest).length} photos in the manifest.`);
    return;
  }

  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|tiff?|heic)$/i.test(f) && !f.startsWith("reserve-")).sort();
  for (const file of files) {
    const slug = path.parse(file).name.trim().replace(/\s+/g, "-");
    const input = path.join(SRC, file);
    const target = path.join(OUT, slug + ".jpg");
    const fresh = fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(input).mtimeMs;
    if (fresh && !force && manifest[slug]) {
      console.log("kept   ", slug);
      continue;
    }
    manifest[slug] = await makeWebPhotos(input, slug);
  }

  // Forget photos whose original is gone or has become a reserve.
  const slugs = new Set(files.map((f) => path.parse(f).name.trim().replace(/\s+/g, "-")));
  for (const slug of Object.keys(manifest)) {
    if (!slugs.has(slug)) {
      delete manifest[slug];
      for (const suffix of [".jpg", ".webp", "-800.jpg", "-800.webp"]) {
        const p = path.join(OUT, slug + suffix);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
      console.log("removed", slug);
    }
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Done. ${Object.keys(manifest).length} photos in the manifest.`);
}

run().catch((e) => { console.error(e); process.exit(1); });
