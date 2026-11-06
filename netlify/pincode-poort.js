// Pincodepoort voor de voorvertoning van de SYP-website, naar het model van appeltje-eitje.
//
// Dit is het SJABLOON. Bij elke bouw (npm run build, dus ook publiceer.command) vult
// eleventy.config.js de pincode in uit src/_data/site.json (sleutel "pincode") en schrijft
// het resultaat naar netlify/edge-functions/pincode.js. Dat bestand gaat mee naar Netlify
// en draait daar als edge function. Staat de pincode leeg, dan wordt die map weggehaald
// en is er geen poort meer.
//
// Werking: elke aanvraag komt eerst hier langs. Zonder geldig koekje krijgt de bezoeker
// het pincodescherm. Klopt de ingetikte code, dan zetten we een koekje voor dertig dagen
// en sturen we de bezoeker door naar de pagina die hij vroeg. Het koekje bevat niet de
// code zelf maar een afgeleide sleutel, dus een andere pincode kiezen maakt alle oude
// koekjes meteen ongeldig.

const PINCODE = "__PINCODE__";
const KOEKJE = "syp_poort";
const DAGEN = 30;

export default async (request, context) => {
  if (!PINCODE) return context.next();

  const sleutel = await sleutelVoor(PINCODE);
  if (gelijk(koekjeWaarde(request, KOEKJE), sleutel)) return context.next();

  const url = new URL(request.url);

  if (request.method === "POST") {
    let ingevoerd = "";
    try {
      const form = await request.formData();
      ingevoerd = String(form.get("pincode") || "").replace(/\s+/g, "");
    } catch (_) {
      ingevoerd = "";
    }
    if (ingevoerd && gelijk(await sleutelVoor(ingevoerd), sleutel)) {
      return new Response(null, {
        status: 303,
        headers: {
          "Location": url.href,
          "Set-Cookie": KOEKJE + "=" + sleutel + "; Path=/; Max-Age=" + (DAGEN * 86400) + "; HttpOnly; Secure; SameSite=Lax",
          "Cache-Control": "no-store",
        },
      });
    }
    // Een seconde wachten maakt codes gokken onaantrekkelijk.
    await new Promise((klaar) => setTimeout(klaar, 1000));
    return poortpagina(true);
  }

  return poortpagina(false);
};

export const config = {
  path: "/*",
  // Vrij bereikbaar: robots.txt (zoekmachines blijven geweerd), en wat het
  // pincodescherm zelf nodig heeft: de lettertypes, het webicoon en de key visual.
  excludedPath: ["/robots.txt", "/fonts/*", "/css/fonts.css", "/images/brand/*"],
};

async function sleutelVoor(code) {
  const bytes = new TextEncoder().encode("syp-poort:" + code);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 40);
}

function koekjeWaarde(request, naam) {
  const kop = request.headers.get("cookie") || "";
  for (const stuk of kop.split(";")) {
    const [k, ...rest] = stuk.trim().split("=");
    if (k === naam) return rest.join("=");
  }
  return "";
}

function gelijk(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let verschil = 0;
  for (let i = 0; i < a.length; i++) verschil |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return verschil === 0;
}

function poortpagina(fout) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Scheldt Youth Parliament | PIN code</title>
<link rel="icon" type="image/png" href="/images/brand/favicon-32.png">
<link rel="stylesheet" href="/css/fonts.css">
<style>
  body { margin: 0; background: #EDF7FB; color: #2E2B26; font-family: Lato, Calibri, system-ui, sans-serif; font-size: 17px; line-height: 1.55; }
  main { min-height: 100vh; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: 28px 20px; text-align: center; }
  .wrap { width: 100%; max-width: 30em; }
  .visual { width: clamp(150px, 24vh, 220px); height: auto; margin: 0 auto 8px; display: block; }
  .brand { font-family: Lato, Calibri, sans-serif; font-weight: 700; font-size: 18px; color: #494132; margin: 0 0 20px; }
  h1 { font-family: Lato, Calibri, sans-serif; font-weight: 700; font-size: clamp(24px, 3.2vw, 32px); line-height: 1.15; color: #494132; margin: 0 0 12px; }
  p { margin: 0 0 18px; }
  form { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin: 0 0 18px; }
  .hidden { position: absolute; left: -9999px; }
  input { font: inherit; font-size: 22px; letter-spacing: 0.25em; text-align: center; width: 10em; max-width: 100%; box-sizing: border-box; padding: 12px 14px; border: 2px solid #1376A7; border-radius: 999px; background: #fff; color: #2E2B26; }
  input:focus { outline: 3px solid #1895D3; outline-offset: 3px; }
  button { font: inherit; font-weight: 700; font-size: 17px; padding: 14px 28px; background: #1376A7; color: #fff; border: 0; border-radius: 999px; cursor: pointer; }
  button:hover { background: #0D5173; }
  button:focus-visible { outline: 3px solid #1895D3; outline-offset: 3px; }
  .error { color: #8a1c1c; font-weight: 700; }
  .note { font-size: 15px; color: #675F55; }
  a { color: #1376A7; }
</style>
</head>
<body>
<main>
  <div class="wrap">
    <picture><source type="image/webp" srcset="/images/brand/keyvisual.webp"><img class="visual" src="/images/brand/keyvisual.png" alt="" width="900" height="900"></picture>
    <p class="brand">Scheldt Youth Parliament</p>
    <h1>This site is not public yet</h1>
    <p>Did you get a PIN code? Enter it below to have a look at the preview.</p>
${fout ? '    <p class="error" id="pin-error" role="alert">That PIN code is not right. Try again.</p>\n' : ""}    <form method="post">
      <label class="hidden" for="pincode">PIN code</label>
      <input id="pincode" name="pincode" type="password" inputmode="numeric" autocomplete="off" autofocus required${fout ? ' aria-invalid="true" aria-describedby="pin-error"' : ""}>
      <button type="submit">Continue</button>
    </form>
    <p class="note">No PIN code? Ask Raphaël at GoodPlanet Belgium.</p>
  </div>
</main>
</body>
</html>
`;
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
