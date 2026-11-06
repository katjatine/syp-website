# Scheldt Youth Parliament website: how to keep it up to date

This is the website of the Scheldt Youth Parliament. It is a set of text files that a small program (Eleventy) turns into web pages. You do not need to know how websites work. You edit text files in `src/`, look at the result on your own computer if you like, and put the site online from a Mac with one double-click (`publiceer.command`, see "Put the site online"). Nothing goes online by itself: saving a file changes nothing on the live site until you publish.

## Where things are

| What | Where |
| --- | --- |
| One page of the site | one file in `src/`, for example `src/project.md` is the page About |
| News posts | one file per post in `src/news/` |
| Exchanges | one file per exchange in `src/exchanges/` |
| Photos, ready for the web | `src/images/photos/` (do not edit these by hand, see "Add a photo") |
| Original photos | `photos-original/` |
| The river timeline (homepage and Since 2008 page) | `src/_data/timeline.json`. On the Since 2008 page an entry can also have `"chapter"` (a large year number beside the river, for example `["2025", "and 2026"]`), `"weight": "milestone"` (larger) or `"minor"` (compact), `"figure"` (one key number) and `"nature"` (`"reeds"` or `"gulls"`). That page shows no photos. |
| Why join, in four points (the blue band at the top of the homepage and the join call at the bottom of most pages) | `src/_data/whyJoin.json`: per point an `icon` (a name from `lib/line-icons.js`), a short `title` and one line of `text`; the join call shows the titles only |
| The figures of the last group (Exchanges page) | `figures` and `figuresTitle` in `src/exchanges.md`. Any page can show such a band with these two lines. |
| Site-wide things: the menu (`nav`), the text links in the footer (`footerNav`), social links, contact e-mail, form link, footer sentence, PIN code, search engine switch, the site's address and the picture for link previews | `src/_data/site.json` |
| Colours, fonts and sizes | `src/css/site.css`, the `:root` block at the top (see "House style") |
| The Lato font files | `src/fonts/` (served from the site itself, no Google Fonts) |
| Logos (footer and Partners page) | `src/images/logos/`. To replace a logo, overwrite the file with the same name. A new file name must also be changed in `src/_includes/partials/footer.njk` (footer) or in the `logo:` line of `src/partners.md` (Partners page). |
| The game download | `src/downloads/` |
| The page about the river, The Scheldt | `src/the-scheldt.md`: the four figures, the seven places on the map (`stops`) and the three cards are in the block at the top. The map is drawn by `lib/scheldt-map.js` from the real course of the river. |
| The page of the water game Go with the flow | `src/go-with-the-flow.md`: the cards you can draw on the page, the steps and the list of what you need are in the block at the top |

Each page file starts with a block between two lines of `---`. That block holds the title, the intro sentence, the photo and other settings. Below it comes the text of the page, written in Markdown: a blank line between paragraphs, `## ` before a heading, `**bold**` for bold, `[link text](/join/)` for a link.

## Add a news post

1. Open the folder `src/news/`.
2. Copy an existing post, for example `2026-06-25-recommendations-international-scheldt-commission.md`, and give the copy a new name that starts with the date: `2027-03-01-my-title.md`.
3. Open the copy and change the lines at the top: `title`, `date` (written as 2027-03-01), `place`, `excerpt` (one or two sentences for the homepage), `photo` (the name of a photo in `src/images/photos/`, without the ending) and `alt` (what is on the photo, for people who cannot see it). Remove the `link` line if there is no page to link to. Remove the `photo` and `alt` lines if there is no photo.
4. Write the post itself below the second `---`: a few sentences are enough.
5. Save and publish (see "Put the site online"). The newest three posts appear automatically on the homepage under "Latest", all posts appear on the News page.

## Change a text

1. Find the page in `src/` (the file names match the menu and the footer links: `project.md` (About), `exchanges.md`, `youth-voices.md`, `partners.md`, `news.md`, `reports.md`, `join.md`, `timeline.md`, and `index.md` for the homepage).
2. Change the words. Keep the `---` lines and the names before the colons as they are; only change what comes after the colon.
3. Anything written as `[TODO ...]` shows up on the site as a highlighted note. Replace it with the real text when you have it, or delete it. See "[TODO] markers and the launch guard".
4. Save, then publish.

Most pages keep all their texts in the block at the top, under `blocks:`: one item per part of the page, each with a `type` (see "The browser editor" below). Change the words after the colons; the order of the items is the order on the page. Texts with bold or links are Markdown: `**bold**`, `[text](/page/)`. Nothing is written below the second `---` any more, except on news posts, exchange pages and Recommendations (the letter).

The story on an exchange page is below the `---` block of its file in `src/exchanges/`. The photo captions, the quote and the key facts are in the block at the top of the same file.

The small map of the Scheldt next to the key facts comes from `riverMap` in that same block: `riverMap: 51.054, 3.722` (latitude, longitude) puts a dot on the river at that place; two places separated by `;` (start and end of a walk) put the dot halfway. Leave `riverMap` out and the map disappears.

## Add a photo

1. Put the original photo in the folder `photos-original/`. Give it a clear name without spaces, for example `2027-05_Exchange5_Lille_01.jpg`. Phone photos are fine.
2. Run the photo step: open a terminal in this folder and type `npm run images` (the first time on a computer, type `npm install` before it). This makes small, fast web versions of every new photo in `src/images/photos/` and adds them to `src/_data/photos.json`. Photos that were already done are skipped; `npm run images -- --force` redoes them all.
3. In the page file, use the photo name without the ending: `photo: 2027-05_Exchange5_Lille_01`, and write an `alt` line that says what is on the photo.

Photos should not be used without the permission of the people on them. Never add photos of people who did not agree.

## Replace a photo on an exchange page

Each exchange file in `src/exchanges/` names its photos at the top: one under `hero:` (the big photo at the top of the page) and at most three under `gallery:`. Every photo has three lines: `photo` (the file name in `src/images/photos/`, without `.jpg`), `alt` (what is on the photo, for people who cannot see it) and `caption` (the short sentence shown when someone opens the photo large). To swap a photo, change those three lines. Spare photos wait in `photos-original/` with a name that starts with `reserve-`. They are not put online, so nobody can open them by guessing the address. To use one, remove `reserve-` from its file name, run the photo step (see "Add a photo") and then name it here. For a new photo, first follow "Add a photo" above. Captions under the gallery photos are hidden; set `"showPhotoCaptions": true` in `src/_data/site.json` to show them. If a frame cuts off the people in a photo, open `src/_data/photoCrop.json` and add a line with the photo name and `bottom` (or `top`, `left`, `right`): that part of the photo then stays visible and the cut happens on the other side. Never use a photo on which a full name can be read.

## Change the moving photos on About

The strip of photos that slides by on the About page ("Come for the river, stay for the friends") is the list `items:` of the block `type: photo-ribbon` at the top of `src/project.md`, oldest first. Every photo is one line between `{` and `}` with four parts: `photo` (the file name in `src/images/photos/`, without `.jpg`), `year`, `place` and `alt`. Copy an existing line to add a photo. Put quotes around a place or alt text that contains a comma, like `place: "Ghent, by bike"`: without them everything after the comma is lost, and the site does not warn you. Under each photo the site writes "place, year", and the year also hangs on it as a coloured label. About ten photos is a good number. Visitors can pause the strip with the round button under it; for people who asked their device for less motion it stands still and can be swiped.

## House style

The site follows GoodPlanet's house style (Huisstijlgids 2025): Lato, with Lora Italic for quotes only (Tine's choice, October 2026), GoodPlanet blue and GoodPlanet's secondary colours as accents. The waves and the river lines are the SYP's own and stay. GoodPlanet's logo is not in the header: with it the site looked like GoodPlanet's own website (Luc, 5 October 2026). GoodPlanet shows as the lead in the footer, on About and on Partners.

All colours, fonts and sizes are named tokens in the `:root` block at the top of `src/css/site.css`, each with a comment that says what it is for. Change a colour there and it changes everywhere. Two rules: the light secondary colours (lime, orange, pink, green) are for shapes only, never for small text, and every text colour must stay readable on its background (the comments give the contrast). The page `/styleguide/` shows all colours and building blocks together; it is hidden from search engines.

## [TODO] markers and the launch guard

Every `[TODO ...]` in a page or in `src/_data/site.json` shows up on the site as a highlighted note, so nothing missing is overlooked during the preview.

At the launch the PIN code is emptied (see "Launch"). From then on a guard applies: when the PIN code is empty, the build stops if any [TODO] is still visible. Nothing is published, and the window lists where the markers are. Fill them in or delete them, then publish again. While there is a PIN code, the build only prints one line with the number of markers left.

The guard also stops the build while `"showCandidateQuotes"` in `src/_data/site.json` is still `true`: the candidate quotes on Youth voices and the "Candidate quote, source" lines on the exchange pages are working notes, not [TODO] markers, so they would otherwise slip through.

## See the site on your own computer (optional)

With Node.js installed: `npm install` once, then `npm start`, and open http://localhost:8080. Every change you save shows up right away. `npm run build` makes the finished site in the folder `_site/`, which is what gets published.

## Put the site online

The site is hosted on Netlify (project **goodplanet-syp**). Netlify builds and publishes it by itself from the `main` branch of this GitHub repository: every change on `main`, also every save in Pages CMS, is online a few minutes later. The build command is in `netlify.toml`: first `npm run images`, then `npm run check-editor`, then `npm run build`. If one of them fails, nothing is published and the previous version stays online.

Other branches get their own test address on Netlify when they are listed under branch deploys, for example `proofreading--goodplanet-syp.netlify.app` for the branch `proofreading`. Those test addresses keep search engines out by themselves (`src/_data/deploy.js`). Merge such a branch into `main` with a pull request to put it online.

Each publication costs Netlify credits, so gather changes and save once rather than after every word.

Until the launch the site asked for a PIN code first and kept search engines out. Since 12 October 2026 the PIN code is gone (`"pincode": ""`) and search engines are let in (`"noindex": false`, Raphaël's OK).

Search engines (file 81): every page names its one address (`<link rel="canonical">`), `sitemap.xml` lists all pages and `robots.txt` points to it, the homepage and the news posts carry structured data (schema.org: who we are, with the Dutch and French names from `"alternateNames"` in `site.json`; each news post as an article), and `goodplanet-syp.netlify.app` sends everyone on to goodplanet-syp.be (first rule in `src/redirects.njk`). A page with `noindex: true` in its front matter stays out of search engines and out of the sitemap. The PIN code is the line `"pincode"` in `src/_data/site.json`. The page `/relecture/`, where Raphaël fills in the missing information, only exists while there is a PIN code.

Link previews: when someone pastes a link in Teams, WhatsApp or LinkedIn, the card shows `"shareImage"` from `src/_data/site.json` (1200 x 630 px, the Ghent 2022 group). A news post or an exchange shows its own photo instead (`photo:` or `hero:`), cut to that size by the build. These previews need the site's full address, `"url"` in `site.json`: change it when the domain changes.

## The browser editor (Pages CMS)

Colleagues change the content of the site in the browser with Pages CMS (app.pagescms.org), without a laptop or code: every text, photo and list on every page. The house style stays fixed. Plans and choices: Output Claude/28 and 77 in the project folder. Pages CMS is installed on this repository; every save is a commit on GitHub.

- **What the editor shows** is set in `.pages.yml`, which is made by `npm run editor-config` from `scripts/pages-config.js` (and `scripts/pages-config-lists.yml` for news posts, timeline stops and join details). Edit those, not `.pages.yml`.
- **Pages as blocks.** About, Join, Partners, Reports, Exchanges, News, Timeline and Go with the flow have a `blocks` list in their front matter. Editors add, move and remove blocks. Each block type is one template in `src/_includes/page-blocks/`, drawn by `src/_includes/page-blocks.njk`. Home, The Scheldt, Recommendations and the exchange pages keep their own layout in `src/_includes/types/`; there every text, photo and list is a field.
- **Settings and notes** that editors should not change sit in a `.11tydata.js` file beside each page (address, lightbox, scripts), because the editor drops comments in the files it saves.
- **Photos** uploaded in the editor land in `src/images/photos/` as one large file. `npm run images` turns them into the four web versions; Netlify runs it before every build (`netlify.toml`).
- **Check** with `npm run check-editor` that every key in the pages is a field in the editor and every value passes its rules.

## The domain

The site's own address is **goodplanet-syp.be**. GoodPlanet (Luc) registered it at OVH and owns it. Two DNS records at OVH point it to Netlify:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` (the bare domain) | `75.2.60.5` |
| CNAME | `www` | `goodplanet-syp.netlify.app` |

In Netlify, goodplanet-syp.be is added under Domain management and set as the primary domain; Netlify makes the HTTPS certificate itself. The Netlify project was renamed from syp-preview to goodplanet-syp on 6 October 2026, so "preview" no longer shows after the launch; the old address syp-preview.netlify.app no longer works. If the project is ever renamed again, or moved to a new project with another name, the CNAME record for `www` must follow. The site uses relative links, so it works on any domain.

Status on 6 October 2026: the A record is set at OVH and goodplanet-syp.be is added in Netlify; the CNAME for `www` was asked of Luc. The site is also at https://goodplanet-syp.netlify.app.

## Launch

Three lines in `src/_data/site.json`, then publish:

1. `"pincode": ""` (empty): the PIN gate and the review pages disappear.
2. `"noindex": false`: search engines are let in (the meta tag, `robots.txt` and the `X-Robots-Tag` header follow automatically).
3. `"showCandidateQuotes": false`: the candidate quotes disappear.

If a [TODO] is still visible, the build stops and nothing is published (see the launch guard above).

## Source code and backups

The source is this GitHub repository; its history is the backup. Work on a laptop always starts with a pull and ends with a push, so nothing done in the editor gets lost.

## Rules for the texts

English only. Direct tone, as if you talk to a 17 year old: "you", "join", "we did". First names only for participants. No dash as punctuation, use a comma, a colon or a new sentence. No text in capitals. Never budget figures, phone numbers, e-mail addresses of participants or participant lists.
