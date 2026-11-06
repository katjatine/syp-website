// Writes .pages.yml, the configuration of the browser editor Pages CMS (app.pagescms.org; Output Claude/28 and 77).
// Run with: npm run editor-config      Edit this file, not .pages.yml: that file is made from this one.
//
// What it does: it lists what colleagues may change in the editor, page by page, and with which fields. The site itself
// never reads it. Pages that are written as blocks (About, Join, Partners, Reports, Exchanges, News, Timeline,
// Go with the flow) get a "Blocks" list: editors add, move and remove blocks; each block keeps its look in
// src/_includes/page-blocks/<type>.njk. A new block type needs a file there and an entry in BLOCKS in scripts/pages-config.js.
//
// Rules for every field:
//   - Every key that a page uses must be a field here, also inside lists, even when it is only shown read-only:
//     Pages CMS may drop keys it does not know when it saves (settings.content.merge is only sure for the top level).
//   - Short texts may not contain "[TODO" or < >: after the launch a [TODO stops the publication, and < > could
//     break a page. Texts with Markdown (bold, links, lists) are rich-text fields, saved as Markdown.
//   - Photos are .jpg, .jpeg or .png (iPhone .heic cannot be converted). An upload lands in src/images/photos as one
//     large file; npm run images makes the web versions before every build on Netlify (scripts/images.js).
//   - Places on a map are text: "latitude, longitude", two places separated by ";" for a walk.
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const NO_TODO_NO_TAGS = { regex: "^(?![\\s\\S]*\\[TODO)[^<>]*$", message: 'No "[TODO" and no < or > please.' };
const NO_TODO = { regex: "^(?![\\s\\S]*\\[TODO)", message: 'No "[TODO" please: it stops the publication.' };
const URL = { regex: '^$|^/[^\\s<>"]*$|^#[^\\s<>"]*$|^https://[^\\s<>"]+$|^mailto:[^\\s<>"]+$', message: "Start with / for a page of this site, # for a place on this page, or https://" };
const PLACES = { regex: "^$|^-?[0-9]+(\\.[0-9]+)?, ?-?[0-9]+(\\.[0-9]+)?(; ?-?[0-9]+(\\.[0-9]+)?, ?-?[0-9]+(\\.[0-9]+)?)?$", message: 'Write it as "51.054, 3.722", or two places as "50.329, 3.395; 50.358, 3.523".' };

// Field helpers. Each returns one Pages CMS field.
const str = (name, label, extra = {}) => ({ name, label, type: "string", pattern: NO_TODO_NO_TAGS, ...extra });
const txt = (name, label, extra = {}) => ({ name, label, type: "text", pattern: NO_TODO_NO_TAGS, ...extra });
const md = (name, label, extra = {}) => ({ name, label, type: "rich-text", pattern: NO_TODO, options: { format: "markdown", media: false, switcher: false }, ...extra });
const url = (name, label, extra = {}) => ({ name, label, type: "string", pattern: URL, ...extra });
const photo = (name, label, extra = {}) => ({ name, label, type: "image", options: { media: "photos" }, ...extra });
const logo = (name, label, extra = {}) => ({ name, label, type: "image", options: { media: "logos" }, ...extra });
const bool = (name, label, extra = {}) => ({ name, label, type: "boolean", ...extra });
const num = (name, label, extra = {}) => ({ name, label, type: "number", ...extra });
const list = (field, extra = {}) => ({ ...field, list: true, ...extra });
const obj = (name, label, fields, extra = {}) => ({ name, label, type: "object", fields, ...extra });
const select = (name, label, values, extra = {}) => ({ name, label, type: "select", options: { values }, ...extra });

const LUCIDE = ["route", "landmark", "flag", "footprints", "sparkles", "megaphone", "handshake", "goodplanet-heart", "headphones", "sprout", "sailboat", "scroll-text", "user-plus", "laptop", "lightbulb", "search"];
const LINE = ["voice", "countries", "explore", "care", "sun", "skills", "people", "fish", "dam", "parkWater", "route", "megaphone", "video", "waves", "droplet", "scale"];
const TONES = ["lime", "orange", "pink", "green", "blue"];
const ACCENTS = ["orange", "green", "pink", "lime"];
const lucide = (name = "icon", label = "Icon") => select(name, label, LUCIDE);
const lineIcon = (name = "icon", label = "Icon") => select(name, label, LINE);

const arrowLink = (name = "link", label = "Link with an arrow (optional)") =>
  obj(name, label, [str("label", "Text of the link"), url("url", "Where it goes", { description: "A page of this site, for example /join/ or /join/#how-it-works, or a full address starting with https://" })]);
const quote = (name = "quote", label = "Quote (optional)") =>
  obj(name, label, [
    txt("text", "What they said"),
    str("name", "Name", { description: "First name only for participants; the full name for people with a public role or title." }),
    str("meta", "Under the name", { description: "Country and year, for example: Belgium, joined in 2010" }),
    select("accent", "Colour of the card", ACCENTS),
    str("source", "Where the quote comes from (not shown on the site)"),
  ]);
const heroFields = (extra = []) => [
  str("headline", "Title"),
  txt("lede", "Intro", { description: "The larger text under the title." }),
  photo("photo", "Photo at the top", { description: "A .jpg or .png, only with the consent of the people on it, and never one where a full name can be read." }),
  str("alt", "What is on that photo", { description: "One sentence for people who cannot see it." }),
  ...extra,
  txt("description", "Description for search engines", { description: "One or two sentences. Google shows it under the title, and it shows when someone shares the page." }),
];
const chips = list(obj("chips", "Labels at the top", [str("text", "Text"), lucide("icon", "Icon (optional: the label then stands out in lime)")]));

// The blocks. "fields" are the fields of each block; the template is src/_includes/page-blocks/<name>.njk.
const BLOCKS = {
  text: { label: "Text", fields: [str("heading", "Heading (optional)"), md("text", "Text", { description: "Bold, links and lists are fine." }), arrowLink()] },
  "photo-ribbon": { label: "Moving photo strip", fields: [list(obj("items", "Photos, oldest first", [photo("photo", "Photo", { required: true }), str("year", "Year (the sticker on the photo)", { required: true }), str("place", "Place (the caption, with the year)", { required: true }), str("alt", "What is on the photo", { required: true })]))] },
  "wide-photo": { label: "Wide photo with wavy edges", fields: [photo("photo", "Photo", { required: true }), str("alt", "What is on the photo", { required: true }), str("caption", "Caption (optional)")] },
  statement: { label: "Statement in large letters", fields: [str("text", "One sentence", { required: true })] },
  "map-and-text": { label: "Map of the Scheldt beside texts", fields: [list(obj("sections", "Texts beside the map", [str("heading", "Heading"), md("text", "Text"), arrowLink()]))] },
  "two-cards": { label: "Two colour cards", fields: [list(obj("cards", "Cards", [str("heading", "Heading"), bool("goodplanet", "GoodPlanet card (GoodPlanet's logo above, partner logos under the text)"), md("text", "Text"), arrowLink()]), { list: { min: 1, max: 2 } })] },
  "three-cards": { label: "Three colour cards", fields: [list(obj("cards", "Cards", [str("heading", "Heading"), md("text", "Text"), arrowLink()]), { list: { min: 1, max: 3 } })] },
  quote: { label: "Quote as a colour card", fields: [quote("quote", "Quote")] },
  logo: { label: "Logo", fields: [logo("logo", "Logo"), logo("logo2x", "Sharper logo for retina screens (optional)"), bool("wide", "Large, for a logo with small letters"), str("alt", "Name of the organisation")] },
  reasons: { label: "Reasons as colour cards", fields: [str("heading", "Heading"), list(obj("items", "Reasons", [str("title", "Title"), lineIcon(), txt("text", "Text"), photo("photo", "Photo (optional: the card becomes wide)"), str("alt", "What is on the photo")]))] },
  "trip-band": { label: "Centred call with a sailing boat", fields: [str("heading", "Heading", { description: "Two short sentences break nicely between them." }), md("text", "Text")] },
  "text-and-quote": {
    label: "Text with a quote beside it",
    fields: [str("heading", "Heading"), md("text", "Text"), arrowLink(), quote(), str("anchor", "Name for links to this block (optional)", { description: "Links to /page/#name jump here. Leave as it is." }), select("classes", "Spacing (leave as it is)", [{ name: "page-block join-who", label: "As on Join" }, { name: "split has-aside exchanges-before", label: "As on Exchanges" }]), bool("fullWidth", "Everything over the full width, one under the other")],
  },
  journey: {
    label: "Steps along a small river",
    fields: [str("heading", "Heading"), str("intro", "Intro (optional)"), list(obj("steps", "Steps", [str("title", "Title"), lucide("icon", "Icon (optional)"), select("nature", "Reeds or gulls beside the river (optional)", ["reeds", "gulls"]), txt("text", "Text")])), md("note", "Note under the river (optional)"), str("anchor", "Name for links to this block (optional)", { description: "Links to /page/#name jump here. Leave as it is." })],
  },
  "signup-band": {
    label: "Motto and sign-up",
    fields: [str("title", "Title"), txt("text", "Text when the form is open"), list(str("promises", "Labels when the form is open")), str("button", "Button to the form"), txt("waiting", "Text while there is no form yet"), str("waitingButton", "Mail button while there is no form yet")],
  },
  privacy: { label: "How we handle your details", fields: [md("note", "Short note under it (optional)")] },
  contact: { label: "Contact and social media", fields: [md("intro", "Greeting (optional)", { description: 'Leave empty for "Hi, salut, hoi. Questions? Write to us." The address is in Join details.' })] },
  "partner-list": { label: "Partner cards", fields: [str("heading", "Heading (optional)", { description: "The partners themselves are in the Partners list above." })] },
  funders: { label: "Funders with their logos", fields: [str("heading", "Heading"), md("text", "Text")] },
  "text-with-photo": { label: "Texts with a photo beside them", fields: [list(obj("sections", "Texts", [str("heading", "Heading"), md("text", "Text", { description: "Lists are fine." }), arrowLink()])), photo("photo", "Photo"), str("alt", "What is on the photo")] },
  "link-card": { label: "Dark card with a button", fields: [str("heading", "Heading"), md("text", "Text"), obj("button", "Button", [str("label", "Text on the button"), url("url", "Where it goes")]), str("anchor", "Name for links to this block (optional)")] },
  "exchange-list": { label: "All exchanges", fields: [str("heading", "Heading (optional)", { description: "The cards come from the exchange pages themselves." })] },
  "projects-list": { label: "All member projects", fields: [str("heading", "Heading (optional)", { description: "The projects are under Member projects." })] },
  "news-list": { label: "All news", fields: [str("heading", "Heading (optional)", { description: "The posts are under News posts." })] },
  "timeline-river": { label: "The river timeline", fields: [md("note", "Line beside the source of the river", { description: "The stops are under Timeline stops." })] },
  motto: { label: "Motto in three languages", fields: [str("caption", "Caption (optional)", { description: 'Leave empty for "Our motto since 2013".' })] },
  "game-piles": {
    label: "Piles of game cards",
    fields: [str("heading", "Heading"), str("intro", "Intro"), list(obj("piles", "Piles", [select("key", "Drawing on the back", [{ name: "rapids", label: "Rapids (arrows forward)" }, { name: "against", label: "Against the current (arrows back)" }, { name: "challenge", label: "Group challenge (three drops)" }]), str("name", "Name"), str("square", "Which square"), str("rule", "Rule"), list(txt("cards", "Cards"))]))],
  },
  checklist: { label: "List with tick boxes", fields: [str("heading", "Heading"), list(str("items", "Items"))] },
  "download-card": {
    label: "Download card",
    fields: [str("heading", "Heading"), md("text", "Text"), str("button", "Text on the button"), { name: "file", label: "File", type: "file", options: { media: "downloads" } }, str("fileNote", "What the file is", { description: "For example: PDF, 2.5 MB" }), md("note", "Note under the card (optional)"), str("anchor", "Name for links to this block (optional)")],
  },
};
const blocks = (names) => ({
  name: "blocks",
  label: "Blocks",
  description: "The parts of the page, from top to bottom. Add, move or remove them; the look stays in the house style.",
  type: "block",
  list: true,
  blockKey: "type",
  blocks: names.map((n) => ({ name: n, label: BLOCKS[n].label, fields: BLOCKS[n].fields })),
});

// Three languages in one file (Tine, file 88; lib/localize.js): after every text field its French and Dutch twin, with the
// same name plus _fr or _nl. Links, photos, choices and the years stay single: they are the same in every language.
// Empty twins show the English text. The English field says "· English" too, so the three read alike (Tine, 5 November).
// Every page and data file gets them (step 4 of the languages, 5 November 2026).
const LANG_NAMES = { en: "English", fr: "Français", nl: "Nederlands" };
const SINGLE = ["year", "classes", "nature", "homeNature", "key", "era", "weight", "tile", "anchor"];
const samePattern = (a, b) => a && b && (a === b || a.regex === b.regex);
const isText = (f) => ["string", "text", "rich-text"].includes(f.type) && !samePattern(f.pattern, URL) && !samePattern(f.pattern, PLACES) && !SINGLE.includes(f.name) && !/_(fr|nl)$/.test(f.name);
const threeLanguages = (fields) => fields.flatMap((f) => {
  if (f.type === "object") return [{ ...f, fields: threeLanguages(f.fields) }];
  if (f.type === "block") return [{ ...f, blocks: f.blocks.map((b) => ({ ...b, fields: threeLanguages(b.fields) })) }];
  if (!isText(f)) return [f];
  const { required, description, ...rest } = f;
  const twin = (code) => ({ ...rest, name: `${f.name}_${code}`, label: `${f.label} · ${LANG_NAMES[code]}` });
  return [{ ...f, label: `${f.label} · ${LANG_NAMES.en}` }, twin("fr"), twin("nl")];
});

// One page in one file. merge keeps keys that are not in the form (title, the page's own settings).
const page = (name, label, file, description, fields) => ({ name, label, description, type: "file", path: file, format: "yaml-frontmatter", operations: { create: false, rename: false, delete: false }, fields });

const content = [
  page("home", "Home", "src/index.md", "The homepage. The four points in the blue band are under Why join, the news under News posts, the river under Timeline stops.", [
    obj("hero", "Top of the page", [str("headline", "Title"), txt("lede", "Text under the title"), str("forWho", "Bold line above the buttons"), obj("button1", "First button", [str("label", "Text"), url("url", "Where it goes")]), obj("button2", "Second button", [str("label", "Text"), url("url", "Where it goes")]), str("visualAlt", "What is on the round picture")]),
    str("whatTitle", "Title of Who we are", { description: "Two short sentences break nicely between them." }),
    list(obj("whatPoints", "Who we are, in points", [lucide(), md("lead", "Bold start", { description: "A link is fine." }), txt("text", "Rest of the point"), select("tone", "Colour of the icon (optional)", TONES)])),
    arrowLink("whatLink", "Link under the points"),
    obj("whatPhoto", "Wide photo under Who we are", [photo("photo", "Photo"), str("alt", "What is on the photo"), str("note", "Caption (optional)")]),
    obj("madeBy", "Made by members", [
      str("title", "Title"),
      str("subtitle", "Line under the title"),
      str("link", "Link to all projects", { description: "The three newest projects show here. All projects are under Member projects." }),
    ]),
    str("latestTitle", "Title above the news"),
    str("latestLink", "Link to all news"),
    str("riverTitle", "Title above the river"),
    txt("description", "Description for search engines"),
  ]),
  page("about", "About", "src/project.md", "The About page, in English, French and Dutch: under every English text its French (Français) and Dutch (Nederlands) twin. An empty twin shows the English text.", [str("title", "Name in the browser tab"), ...heroFields(), blocks(["text", "photo-ribbon", "wide-photo", "statement", "map-and-text", "three-cards", "two-cards"])]),
  page("join", "Join", "src/join.md", "The Join page. The form link and contact address are under Join details.", [...heroFields([chips, str("caption", "Caption when the photo opens large")]), blocks(["reasons", "trip-band", "text-and-quote", "journey", "signup-band", "privacy", "contact"])]),
  page("exchanges", "Exchanges overview", "src/exchanges.md", "The page with all exchanges. Each exchange is under Exchange pages.", [
    txt("lede", "Intro"), photo("photo", "Photo at the top"), str("alt", "What is on that photo"),
    str("figuresTitle", "Title of the figures"), list(obj("figures", "Figures in the blue band", [str("number", "Number"), str("label", "Words after the number")])),
    txt("description", "Description for search engines"),
    blocks(["exchange-list", "text-and-quote", "text"]),
  ]),
  {
    name: "exchange-pages", label: "Exchange pages", description: "One page per exchange, with its card on the Exchanges page.", type: "collection", path: "src/exchanges", format: "yaml-frontmatter",
    filename: "{primary}.md", exclude: ["exchanges.11tydata.js"], operations: { rename: false },
    view: { primary: "title", fields: ["title", "dateLabel"], sort: ["date", "title"], default: { sort: "date", order: "desc" } },
    fields: [
      str("title", "Title", { required: true }), str("shortTitle", "Shorter title for the browser tab (optional)"),
      { name: "date", label: "Date", description: "The first day. Puts the exchanges in order.", type: "date", required: true, options: { format: "yyyy-MM-dd" } },
      str("dateLabel", "Date as shown", { description: "For example: 8 to 10 May 2026" }), str("number", "Sticker on the card", { description: "For example: Exchange 4" }),
      str("country", "Country"), str("place", "Place, with the country"), str("linkName", "Short name", { description: 'For the sticker and "Read about ..." , for example Ghent.' }),
      str("riverMap", "Place on the small map", { pattern: PLACES, description: 'Latitude and longitude, for example "51.054, 3.722"; for a walk two places: "50.329, 3.395; 50.358, 3.523". Look them up on a map site.' }),
      txt("lede", "Intro"), txt("teaser", "Text on the card on the Exchanges page"),
      list(obj("facts", "Facts beside the title", [str("label", "Label", { description: 'When, Where, Who, Cost, Theme or Result. "Where" shows the small map.' }), str("text", "Text")])),
      obj("hero", "Photo at the top", [photo("photo", "Photo"), str("alt", "What is on the photo"), str("caption", "Caption when it opens large")]),
      quote(),
      list(obj("gallery", "Photo gallery", [photo("photo", "Photo"), str("alt", "What is on the photo"), str("caption", "Caption")])),
      obj("cta", "Own call at the bottom (optional)", [str("title", "Title"), txt("text", "Text"), str("label", "Text on the button"), url("url", "Where it goes")]),
      md("body", "What we did", { required: true }),
    ],
  },
  page("recommendations", "Recommendations", "src/youth-voices.md", "The letter and the recommendations.", [
    str("headline", "Title"), list(str("headlineLines", "Title, one sentence per line")), txt("lede", "Intro"), photo("photo", "Photo at the top"), str("alt", "What is on that photo"), str("caption", "Caption when it opens large"),
    obj("letter", "Around the letter", [str("title", "Title"), txt("intro", "Intro"), str("from", "From"), str("to", "To"), str("date", "Place and date"), str("subject", "Subject"), txt("note", "Line under the letter")]),
    md("body", "The letter", { description: 'A quotation ("> ...") becomes the large key sentence.' }),
    obj("recommendations", "Recommendations", [str("title", "Title"), txt("intro", "Intro"), str("moreLabel", "Text of the fold-out"), list(obj("groups", "Groups", [str("title", "Title"), lineIcon(), photo("detail", "Detail of the poster"), str("detailAlt", "What is on that detail"), txt("ask", 'We ask ...'), txt("text", "Their conclusion (shown when there is no ask)"), txt("more", "What they looked at (folded)")]))]),
    obj("posters", "Posters", [str("title", "Title"), txt("text", "Text"), list(obj("moments", "Photos of the groups", [photo("photo", "Photo"), str("alt", "What is on the photo"), str("caption", "Caption")])), str("originalsLabel", "Text of the fold-out"), txt("originalsText", "Text in the fold-out"), list(obj("gallery", "The original posters", [photo("photo", "Photo"), str("alt", "What is on the photo"), str("caption", "Caption")]))]),
    obj("path", "From the riverbank to the commission", [str("title", "Title"), txt("intro", "Intro"), list(obj("steps", "Steps", [str("label", "Date and place"), lucide(), select("tone", "Colour", TONES), str("title", "Title"), txt("text", "Text")])), photo("photo", "Photo"), str("alt", "What is on the photo"), str("caption", "Caption"), str("label", "Text on the button"), url("url", "Where the button goes")]),
    obj("testimonials", "Quote at the bottom", [quote("quote", "Quote"), quote("commissionQuote", "Second quote, beside it (optional)"), str("candidatesTitle", "Title of the candidate quotes (only shown while checking)"), txt("candidatesIntro", "Intro of the candidate quotes"), list(obj("candidates", "Candidate quotes", [str("source", "Source"), txt("text", "Text"), txt("todo", "Still to check (optional)")]))]),
    txt("description", "Description for search engines"),
  ]),
  page("the-scheldt", "The Scheldt", "src/the-scheldt.md", "The page about the river.", [
    ...heroFields(),
    list(obj("figures", "Figures in the blue band", [str("number", "Number"), str("label", "Words after the number")])),
    obj("journey", "Down the river", [
      str("title", "Title"), txt("intro", "Intro"), str("mapLabel", "What a screen reader hears instead of the map"),
      list(obj("borders", "Borders on the map", [str("place", "Where the river crosses", { pattern: PLACES }), str("above", "Country above"), str("below", "Country below")])),
      list(obj("stops", "Places, from source to sea", [str("name", "Name on the map"), str("places", "Place on the map", { pattern: PLACES, description: 'Latitude and longitude, for example "51.054, 3.722"; for a walk two places separated by ";".' }), str("country", "Country"), str("title", "Title"), txt("text", "Text"), str("we", "We were here (optional)"), url("url", "Link under it"), select("anchor", "Name left or centred on the map (optional)", ["end", "middle"]), num("dx", "Move the name sideways (optional)"), num("dy", "Move the name up or down (optional)")])),
    ]),
    obj("stakes", "Why the river needs you", [str("title", "Title"), txt("intro", "Intro"), list(obj("cards", "Cards", [str("label", "Label"), lineIcon(), str("title", "Title"), txt("text", "Text"), str("linkLabel", "Text of the link"), url("url", "Where it goes")]))]),
    md("sources", "Sources at the bottom", { description: "Links are fine." }),
  ]),
  page("timeline-page", "Timeline page", "src/timeline.md", "The Timeline page. The stops on the river are under Timeline stops.", [str("title", "Title"), ...heroFields().filter((f) => f.name !== "headline"), blocks(["timeline-river", "motto", "text"])]),
  page("projects-page", "Member projects page", "src/projects.md", "The page with all projects of members. The projects themselves are under Member projects.", [str("title", "Title"), str("lede", "Line under the title"), txt("description", "Description for search engines"), blocks(["projects-list", "text"])]),
  page("news-page", "News page", "src/news.md", "The page with all news. The posts themselves are under News posts.", [txt("description", "Description for search engines"), blocks(["news-list", "text"])]),
  page("partners", "Partners", "src/partners.md", "The Partners page. The partner with a lead line (GoodPlanet) stands at the top.", [
    txt("lede", "Intro"),
    obj("heroAside", "Photo at the top", [photo("photo", "Photo"), str("alt", "What is on the photo")]),
    list(obj("partners", "Partners", [str("name", "Name"), str("lead", "Lead line (only for the lead partner)"), logo("logo", "Logo"), logo("logo2x", "Sharper logo for retina screens (optional)"), bool("logoWide", "Logo on its own wide row"), bool("textOnly", "No logo: the name as text"), bool("featured", "The full width"), txt("text", "Text"), url("story", "This partner's own page (optional)", { description: "For example /partners/hz-university-of-applied-sciences/" }), str("storyLabel", "Text of that link (optional)", { description: "Empty: Read our story" }), url("url", "Website"), str("linkLabel", "Text of the link, for example hz.nl")])),
    txt("description", "Description for search engines"),
    blocks(["partner-list", "funders", "text"]),
  ]),
  {
    name: "partner-pages", label: "Partner pages", description: "A partner's own page, under All partners. Link to it from its card on Partners.", type: "collection", path: "src/partners", format: "yaml-frontmatter",
    filename: "{primary}.md", exclude: ["partners.11tydata.js"], operations: { rename: false },
    view: { primary: "title", fields: ["title"] },
    fields: [str("title", "Name of the partner", { required: true }), txt("lede", "Intro"), photo("photo", "Photo at the top"), str("alt", "What is on that photo"), txt("description", "Description for search engines"), blocks(["logo", "text", "quote"])],
  },
  page("reports", "Reports", "src/reports.md", "The Reports page.", [txt("lede", "Intro"), txt("description", "Description for search engines"), blocks(["text-with-photo", "link-card", "text"])]),
  page("game", "Go with the flow", "src/go-with-the-flow.md", "The page of the water game.", [
    txt("lede", "Intro"), chips, list(obj("actions", "Buttons at the top", [str("label", "Text"), url("url", "Where it goes")])), photo("photo", "Photo at the top"), str("alt", "What is on that photo"),
    txt("description", "Description for search engines"),
    blocks(["game-piles", "journey", "checklist", "download-card", "text"]),
  ]),
];

// The editor entries for news posts, timeline stops and join details were written by hand on 1 October 2026
// (plan 28) and are kept as they are: they come from the old .pages.yml, saved in scripts/pages-config-lists.yml.
const lists = yaml.load(fs.readFileSync(path.join(__dirname, "pages-config-lists.yml"), "utf8"));

const shared = [
  {
    name: "member-projects", label: "Member projects", description: "Projects that members started themselves. Newest first by year: the three newest on Home, all of them on the page Member projects. Add a project with the + button.",
    type: "file", path: "src/_data/memberProjects.json", format: "json", operations: { create: false, rename: false, delete: false },
    fields: [list(obj("items", "Projects", [str("year", "Year", { required: true, description: "For example 2024, or 2022-2023. The newest come first." }), str("title", "Title"), select("kind", "Kind (optional)", [{ name: "podcast", label: "Podcast: play button on the photo" }]), txt("text", "Text"), photo("photo", "Photo"), str("alt", "What is on the photo"), str("badge", "Label on the photo (podcast)"), str("platform", "Where it plays (podcast), for example YouTube"), list(obj("episodes", "Episodes (podcast)", [str("label", "Text on the button"), url("url", "Link")])), list(obj("links", "Links (optional)", [str("label", "Text"), url("url", "Link")]))]))],
  },
  {
    name: "why-join", label: "Why join (four points)", description: "The four points in the blue band on Home and, as titles only, in the call at the bottom of most pages.",
    type: "file", path: "src/_data/whyJoin.json", format: "json", operations: { create: false, rename: false, delete: false },
    fields: [list(obj("items", "Points", [lineIcon(), str("title", "Title"), str("text", "One line")]), { list: { min: 1, max: 4 } })],
  },
  {
    name: "join-call", label: "Join call", description: "The call at the bottom of most pages. An exchange page can have its own.",
    type: "file", path: "src/_data/joinCall.json", format: "json", operations: { create: false, rename: false, delete: false },
    fields: [str("title", "Title"), str("button", "Text on the button"), str("who", "Line under the button")],
  },
];

const config = {
  // commit.identity user: each save carries the name and mail address of the colleague who made it.
  settings: { content: { merge: true }, commit: { identity: "user" } },
  media: [
    { name: "photos", label: "Photos", input: "src/images/photos", output: "/images/photos", extensions: ["jpg", "jpeg", "png"], rename: "safe" },
    { name: "logos", label: "Logos", input: "src/images/logos", output: "/images/logos", extensions: ["svg", "png", "jpg"], rename: "safe" },
    { name: "downloads", label: "Downloads", input: "src/downloads", output: "/downloads", extensions: ["pdf"], rename: "safe" },
  ],
  content: [...content, ...lists.content, ...shared].map((e) => ({ ...e, fields: threeLanguages(e.fields) })),
};

const header = fs.readFileSync(__filename, "utf8").split("\nconst fs")[0].replace(/^\/\/ ?/gm, "# ");
const out = header.replace("# Writes .pages.yml, the configuration", "# .pages.yml: the configuration").replace("Edit this file, not .pages.yml: that file is made from this one.", "Do not edit this file: it is made by scripts/pages-config.js.") + "\n\n" + yaml.dump(config, { lineWidth: -1, noRefs: true });
fs.writeFileSync(path.join(__dirname, "..", ".pages.yml"), out);
console.log(`Wrote .pages.yml: ${config.content.length} entries.`);
