// Settings of the Recommendations page (src/youth-voices.md) that stay out of the browser editor (Output Claude/77).
// The texts and photos are in src/youth-voices.md ("Recommendations" in the editor), which drops comments when it saves,
// so the notes are here. The letter is the Markdown text of that file; a quotation in it ("> ...") becomes the large
// key sentence of the brief (class brief-key, added by src/_includes/types/voices.njk).
// The quote at the bottom (testimonials.quote) is Shérazade's, said to the commission (Tine, file 64); approved by
// Raphaël on 2 October 2026, first names only. Bart is on Join (Who can join), Ana on Exchanges (Before 2025).
//
// The Recommendations page (was "Youth voices"), after reviewer feedback (Tine, file 64, October 2026):
// a political title, no "On this page", the letter as a policy brief, "We ask" on the three recommendations,
// the path from Ghent to Tournai, one quote. The old address /youth-voices/ sends visitors here (src/redirects.njk).
// One sentence per line in the big title (Tine, file 64)
// A young person speaking at the commission's plenary: "your voice is heard" (Tine's choice B, file 37)
// The letter, shown as a policy brief (Tine, file 64, design B). The letter itself is the text below the three dashes.
// Everything around it (sender, date, addressee, subject, the note) is ours: the three handwritten pages have no title,
// date or signature. The subject is made of two sentences of the letter. No topic list, and a letter-like head (Tine, 5 Oct 2026).
// Checked against the three handwritten pages in annex 2 of the Ghent report (October 2026): the closing "must be..." is theirs,
// the crossed-out words are left out. Lightly edited: one sentence smoothed, "Mayor Phillip" written out, "Death threats"
// without the capital and the second comma after "the water engineer" (Tine, file 64). "Mobilizing" stays as they wrote it.
// A detail of the group's own poster, in the card (Tine, 2 Oct: crops instead of whole sheets)
// "ask" is shown after a bold "We ask" (Tine, file 64); "text" is their conclusion in our words, kept for the record;
// "more" is how they got there, folded away (shorter page, 2 Oct). Checked against the posters and the Ghent report.
// From Ghent to Tournai in four steps; the Tournai block is part of it (Tine, file 64, 4c B).
// Facts from the Ghent and ISC reports, the 2026 agenda and the Tournai photos. Officials keep their full name; participants a first name.
// No claim that the letter went to Tournai, and no reply from the commission: neither is documented.
// One quote stays here, the one said to the commission (Tine, file 64). The quotes live in src/_data/quotes.json:
// Bart is on Join (Who can join), Ana on Exchanges (Before 2025).
// A summary of several anonymous notes, not one person's sentence: use only as a paraphrase.
// Tine, 2 Oct: show the young people presenting, not the sheets of paper; the posters themselves stay available, folded away below
// The three posters, from annex 1 of the Ghent exchange report (no names on them), in the order of the three groups above
// testimonials.commissionQuote: a voice from the other side of the table (brochure '10 jaar', 2017; Tine, file 85).
// In English, French and Dutch (Tine, file 88): lib/languages.js makes one page per language.
const { inLanguages } = require("../lib/languages");
module.exports = inLanguages({
  permalink: "/recommendations/",
  type: "voices",
});
