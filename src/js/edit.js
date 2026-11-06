// Edit mode: lets Raphaël (and others) suggest changes to the texts, right on the site (Tine, file 58, October 2026).
// Started by the pencil in the footer of About, which adds #edit to the address. The loader at the end of
// layout.njk only fetches this file in edit mode, so ordinary visitors never load it.
// - Every text block can be typed in; changed text turns yellow. "Add note" pins a note on any part of a page.
// - Suggestions are kept in this browser (localStorage) while moving between pages, until they are sent.
// - "Send" posts them to Netlify Forms (form "edit-suggestions", defined in the footer of About) with a JSON file, and
//   then opens a mail to the site owner with the list already in it, which the sender sends from their own mail program.
//   Netlify's own mail per submission needs the Pro plan; this way the owner still gets a mail for free and the full
//   list and file stay safe in Netlify (Forms > edit-suggestions) even if the mail is never sent (Tine, file 68).
//   Nothing on the site itself changes.
(function () {
  if (window.SYPEdit) return;
  window.SYPEdit = true;

  // The words of edit mode in the language of the page (Tine, 5 November 2026: the pencil also on the French and Dutch
  // pages, so people without access to the browser editor can suggest changes there too). English is the fallback.
  var WORDS = {
    en: { photo: "photo", openLink: "Open link ↗", note: "Note", pick: "Click the part of the page your note is about. Esc to cancel.", yourNote: "Your note",
      notePlaceholder: "For example: replace this photo, this part can go, add the date…", deleteNote: "Delete note", cancel: "Cancel", saveNote: "Save note",
      editMode: "Edit mode", close: "Close", change: "change", changes: "changes", addNote: "Add note", undo: "Undo", myChanges: "My changes", send: "Send", exit: "Exit",
      nothingToUndo: "Nothing to undo.", undone: "Undone.", undoneOn: "Undone on ", text: "Text", under: "under", was: "was", now: "now", noteOn: "Note on ",
      noChanges: "No changes yet. Click any text to change it, or use Add note.", removeThis: "Remove this change", remove: "Remove", removeAll: "Remove all",
      confirmRemoveAll: "Remove all your changes on every page?", nothingToSend: "There is nothing to send yet.", yourName: "Your name", message: "Message (optional)",
      sendNote: "Your suggestions go to the website team. Nothing on the site changes until they are processed.",
      fullList: "The full list is saved on the website (Netlify, Forms > edit-suggestions).", sending: "Sending…", suggestion: "suggestion", suggestions: "suggestions",
      mailSubject: "SYP website: {n} from {name}", mailHello: "Hello,\n\nI sent {n} for the SYP website with the edit mode. The list is also saved on the website, with the file {file}.",
      saved: "Saved, one last step", thanks: "Thank you, {name}. Saved: {n}.",
      mailOpened: "An email to the website team has opened with your list in it: press send in your email program. Nothing opened?", openMail: "Open the email to ",
      downloadCopy: "Download a copy", forYourself: " for yourself.", keepEditing: "Keep editing", exitEditMode: "Exit edit mode",
      failSubject: "Edit suggestions for the SYP website ({name})", failAttached: "The file {file} is attached.", failed: "Sending failed",
      stillSaved: "Your changes are still saved in this browser. ", byEmail: "Send them by email instead:", asFile: "Save them as a file instead:",
      downloadFile: "Download the file", writeEmail: "Write an email to ", attach: " and attach the file." },
    fr: { photo: "photo", openLink: "Ouvrir le lien ↗", note: "Note", pick: "Clique sur la partie de la page que concerne ta note. Échap pour annuler.", yourNote: "Ta note",
      notePlaceholder: "Par exemple : remplacer cette photo, cette partie peut partir, ajouter la date…", deleteNote: "Supprimer la note", cancel: "Annuler", saveNote: "Enregistrer la note",
      editMode: "Mode édition", close: "Fermer", change: "modification", changes: "modifications", addNote: "Ajouter une note", undo: "Annuler la dernière", myChanges: "Mes modifications", send: "Envoyer", exit: "Quitter",
      nothingToUndo: "Rien à annuler.", undone: "Annulé.", undoneOn: "Annulé sur ", text: "Texte", under: "sous", was: "avant", now: "après", noteOn: "Note sur ",
      noChanges: "Pas encore de modifications. Clique sur un texte pour le changer, ou utilise Ajouter une note.", removeThis: "Retirer cette modification", remove: "Retirer", removeAll: "Tout retirer",
      confirmRemoveAll: "Retirer toutes tes modifications sur toutes les pages ?", nothingToSend: "Il n'y a encore rien à envoyer.", yourName: "Ton nom", message: "Message (facultatif)",
      sendNote: "Tes suggestions vont à l'équipe du site. Rien ne change sur le site tant qu'elles ne sont pas traitées.",
      fullList: "La liste complète est enregistrée sur le site (Netlify, Forms > edit-suggestions).", sending: "Envoi…", suggestion: "suggestion", suggestions: "suggestions",
      mailSubject: "Site SYP : {n} de {name}", mailHello: "Bonjour,\n\nJ'ai envoyé {n} pour le site SYP avec le mode édition. La liste est aussi enregistrée sur le site, avec le fichier {file}.",
      saved: "Enregistré, encore une étape", thanks: "Merci, {name}. Enregistré : {n}.",
      mailOpened: "Un e-mail à l'équipe du site s'est ouvert avec ta liste : clique sur envoyer dans ton programme de messagerie. Rien ne s'est ouvert ?", openMail: "Ouvrir l'e-mail à ",
      downloadCopy: "Télécharger une copie", forYourself: " pour toi.", keepEditing: "Continuer", exitEditMode: "Quitter le mode édition",
      failSubject: "Suggestions pour le site SYP ({name})", failAttached: "Le fichier {file} est joint.", failed: "L'envoi a échoué",
      stillSaved: "Tes modifications restent enregistrées dans ce navigateur. ", byEmail: "Envoie-les plutôt par e-mail :", asFile: "Enregistre-les plutôt dans un fichier :",
      downloadFile: "Télécharger le fichier", writeEmail: "Écrire un e-mail à ", attach: " et joindre le fichier." },
    nl: { photo: "foto", openLink: "Link openen ↗", note: "Notitie", pick: "Klik op het deel van de pagina waar je notitie over gaat. Esc om te annuleren.", yourNote: "Je notitie",
      notePlaceholder: "Bijvoorbeeld: vervang deze foto, dit stuk mag weg, voeg de datum toe…", deleteNote: "Notitie verwijderen", cancel: "Annuleren", saveNote: "Notitie bewaren",
      editMode: "Bewerkmodus", close: "Sluiten", change: "wijziging", changes: "wijzigingen", addNote: "Notitie toevoegen", undo: "Ongedaan maken", myChanges: "Mijn wijzigingen", send: "Versturen", exit: "Stoppen",
      nothingToUndo: "Niets om ongedaan te maken.", undone: "Ongedaan gemaakt.", undoneOn: "Ongedaan gemaakt op ", text: "Tekst", under: "onder", was: "was", now: "nu", noteOn: "Notitie bij ",
      noChanges: "Nog geen wijzigingen. Klik op een tekst om hem te veranderen, of gebruik Notitie toevoegen.", removeThis: "Deze wijziging weghalen", remove: "Weghalen", removeAll: "Alles weghalen",
      confirmRemoveAll: "Al je wijzigingen op alle pagina's weghalen?", nothingToSend: "Er is nog niets om te versturen.", yourName: "Je naam", message: "Bericht (niet verplicht)",
      sendNote: "Je voorstellen gaan naar het websiteteam. Op de site verandert niets tot ze verwerkt zijn.",
      fullList: "De volledige lijst staat op de website (Netlify, Forms > edit-suggestions).", sending: "Versturen…", suggestion: "voorstel", suggestions: "voorstellen",
      mailSubject: "SYP-website: {n} van {name}", mailHello: "Hallo,\n\nIk heb {n} voor de SYP-website verstuurd met de bewerkmodus. De lijst staat ook op de website, met het bestand {file}.",
      saved: "Bewaard, nog één stap", thanks: "Bedankt, {name}. Bewaard: {n}.",
      mailOpened: "Er is een mail aan het websiteteam geopend met je lijst erin: druk op versturen in je mailprogramma. Ging er niets open?", openMail: "Open de mail aan ",
      downloadCopy: "Download een kopie", forYourself: " voor jezelf.", keepEditing: "Verder bewerken", exitEditMode: "Bewerkmodus verlaten",
      failSubject: "Voorstellen voor de SYP-website ({name})", failAttached: "Het bestand {file} zit in de bijlage.", failed: "Versturen lukte niet",
      stillSaved: "Je wijzigingen staan nog in deze browser. ", byEmail: "Stuur ze in de plaats per mail:", asFile: "Bewaar ze in de plaats als bestand:",
      downloadFile: "Download het bestand", writeEmail: "Schrijf een mail aan ", attach: " en voeg het bestand toe." },
  };
  var W = WORDS[document.documentElement.lang] || WORDS.en;
  function fill(s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k]; }); }
  function count(n, one, many) { return n + " " + (n === 1 ? W[one] : W[many]); }

  var FLAG = "syp-edit", STORE = "syp-edit-changes", NAME = "syp-edit-name";
  var cfg = document.getElementById("syp-edit-loader") || {};
  var EMAIL = (cfg.dataset && cfg.dataset.email) || "";
  var PATH = location.pathname;
  var TEXT = "h1, h2, h3, h4, h5, p, li, blockquote, figcaption, dt, dd, th, td, .btn, .label, .eyebrow";
  var SKIP = "#syp-edit-ui, .syp-edit-pin, button, input, select, textarea, label, script, style, svg, [data-no-edit]";
  var pencil = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>';

  function get(key, fallback) { try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }
  function put(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  function changes() { return get(STORE, []); }
  function saveChanges(list) { put(STORE, list); updateCount(); }
  function clean(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  put(FLAG, "on");
  if (location.hash !== "#edit" && !location.hash) history.replaceState(null, "", PATH + location.search + "#edit");

  var css = document.createElement("link");
  css.rel = "stylesheet"; css.href = "/css/edit.css";
  document.head.appendChild(css);
  document.documentElement.classList.add("syp-editing");

  // ---------- Where on the page: a path for us, and the nearest heading for people ----------
  var scope = Array.prototype.slice.call(document.querySelectorAll("main, .footer-disclaimer"));
  function inScope(el) { return scope.some(function (s) { return s.contains(el); }); }
  function cssPath(el) {
    var parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      var tag = el.tagName.toLowerCase(), i = 1, sib = el;
      while ((sib = sib.previousElementSibling)) if (sib.tagName === el.tagName) i++;
      parts.unshift(tag + ":nth-of-type(" + i + ")");
      if (tag === "main" || tag === "footer") break;
      el = el.parentElement;
    }
    return parts.join(" > ");
  }
  function nearestHeading(el) {
    var all = Array.prototype.slice.call(document.querySelectorAll("main h1, main h2, main h3"));
    var found = "";
    all.forEach(function (h) { if (h === el || (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) found = clean(h.textContent); });
    return found;
  }
  function describe(el) {
    if (el.tagName === "IMG") return W.photo + ": " + (el.getAttribute("alt") || el.getAttribute("src"));
    var img = el.querySelector && el.querySelector("img");
    var t = clean(el.textContent);
    if (!t && img) return W.photo + ": " + (img.getAttribute("alt") || img.getAttribute("src"));
    return el.tagName.toLowerCase() + ": " + (t.length > 90 ? t.slice(0, 90) + "…" : t);
  }

  // ---------- Text blocks to type in: the innermost text blocks of the page ----------
  var blocks = [];
  document.querySelectorAll("main, .footer-disclaimer").forEach(function (root) {
    var cands = Array.prototype.slice.call(root.querySelectorAll(TEXT));
    if (root.matches(TEXT)) cands.unshift(root);
    cands.forEach(function (el) {
      if (el.closest(SKIP) || !clean(el.textContent)) return;
      if (el.querySelector(TEXT)) return;
      blocks.push(el);
    });
  });
  blocks.forEach(function (el, i) {
    el.dataset.sypI = i;
    el.dataset.sypOrig = el.innerHTML;
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "true");
    el.classList.add("syp-editable");
  });

  // Put back what was typed earlier on this page.
  changes().forEach(function (c) {
    if (c.kind !== "text" || c.path !== PATH) return;
    var el = blocks[c.index];
    if (!el || clean(el.textContent) !== c.old) el = blocks.filter(function (b) { return clean(b.textContent) === c.old; })[0];
    if (!el) return;
    el.innerHTML = c.html;
    el.classList.add("syp-edited");
    el.dataset.sypId = c.id;
  });

  function record(el) {
    var list = changes();
    var oldText = clean(textOf(el.dataset.sypOrig)), newText = clean(el.textContent);
    var id = el.dataset.sypId;
    list = list.filter(function (c) { return c.id !== id; });
    if (newText !== oldText) {
      id = id || uid();
      el.dataset.sypId = id;
      list.push({ id: id, kind: "text", path: PATH, page: document.title, index: Number(el.dataset.sypI), where: cssPath(el),
        section: nearestHeading(el), old: oldText, new: newText, html: el.innerHTML, time: new Date().toISOString() });
      el.classList.add("syp-edited");
    } else {
      delete el.dataset.sypId;
      el.classList.remove("syp-edited");
    }
    saveChanges(list);
  }
  function textOf(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

  document.addEventListener("focusout", function (e) { if (e.target.classList && e.target.classList.contains("syp-editable")) record(e.target); });
  document.addEventListener("keydown", function (e) {
    var el = e.target;
    if (!el.classList || !el.classList.contains("syp-editable")) return;
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); el.blur(); }
    if (e.key === "Escape") { el.innerHTML = el.dataset.sypId ? (changes().filter(function (c) { return c.id === el.dataset.sypId; })[0] || {}).html || el.dataset.sypOrig : el.dataset.sypOrig; el.blur(); }
  });
  // Paste as plain text, so no outside styling comes along.
  document.addEventListener("paste", function (e) {
    if (!e.target.closest || !e.target.closest(".syp-editable")) return;
    e.preventDefault();
    var t = (e.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, t.replace(/\s*\n\s*/g, " "));
  });

  // ---------- Links: links in text are typed in, not followed; a chip offers to open them ----------
  function withEdit(href) {
    try {
      var u = new URL(href, location.href);
      if (u.origin === location.origin && !u.hash) u.hash = "edit";
      return u.href;
    } catch (e) { return href; }
  }
  var chip = document.createElement("a");
  chip.className = "syp-edit-chip"; chip.hidden = true;
  document.body.appendChild(chip);
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (picking || !a || a === chip || a.closest("#syp-edit-ui")) return;
    var editable = a.closest(".syp-editable") || a.querySelector(".syp-editable") || (e.target.closest && e.target.closest(".syp-editable"));
    if (editable) {
      e.preventDefault();
      var r = a.getBoundingClientRect();
      chip.href = withEdit(a.href);
      chip.textContent = W.openLink;
      chip.style.top = (window.scrollY + r.bottom + 6) + "px";
      chip.style.left = Math.max(8, Math.min(window.scrollX + r.left, document.documentElement.clientWidth - 140)) + "px";
      chip.hidden = false;
      return;
    }
    chip.hidden = true;
    // Other internal links (menu, footer) keep #edit in the address.
    var u = new URL(a.href, location.href);
    if (u.origin === location.origin && !u.hash && !a.target) { e.preventDefault(); location.href = withEdit(a.href); }
  }, true);

  // ---------- Notes ----------
  var pins = document.createElement("div");
  pins.className = "syp-edit-pins";
  document.body.appendChild(pins);
  function findTarget(c) {
    try { var el = document.querySelector(c.where); if (el) return el; } catch (e) {}
    return null;
  }
  function drawPins() {
    pins.innerHTML = "";
    document.querySelectorAll(".syp-noted").forEach(function (el) { el.classList.remove("syp-noted"); });
    changes().forEach(function (c) {
      if (c.kind !== "note" || c.path !== PATH) return;
      var el = findTarget(c);
      if (!el) return;
      el.classList.add("syp-noted");
      var r = el.getBoundingClientRect();
      var p = document.createElement("button");
      p.type = "button"; p.className = "syp-edit-pin";
      p.innerHTML = pencil + "<span>" + W.note + "</span>";
      p.title = c.note;
      p.style.top = (window.scrollY + r.top - 12) + "px";
      p.style.left = (window.scrollX + Math.max(4, r.right - 70)) + "px";
      p.addEventListener("click", function () { openNote(el, c); });
      pins.appendChild(p);
    });
  }
  window.addEventListener("resize", drawPins);
  window.addEventListener("load", drawPins);

  var picking = false;
  function setPicking(on) {
    picking = on;
    document.documentElement.classList.toggle("syp-picking", on);
    ui.querySelector("[data-act=note]").setAttribute("aria-pressed", on ? "true" : "false");
    status(on ? W.pick : "");
  }
  var hoverEl = null;
  document.addEventListener("mouseover", function (e) {
    if (!picking) return;
    if (hoverEl) hoverEl.classList.remove("syp-hover");
    hoverEl = e.target.closest("main *, footer *, header *");
    if (hoverEl && hoverEl.closest("#syp-edit-ui")) hoverEl = null;
    if (hoverEl) hoverEl.classList.add("syp-hover");
  });
  document.addEventListener("click", function (e) {
    if (!picking || e.target.closest("#syp-edit-ui")) return;
    var el = e.target.closest("img, figure, picture, " + TEXT + ", section, main *, footer *, header *");
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    if (hoverEl) hoverEl.classList.remove("syp-hover");
    if (el.tagName === "PICTURE" || el.tagName === "IMG") el = el.closest("figure") || el;
    setPicking(false);
    openNote(el, null);
  }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && picking) setPicking(false); });

  function openNote(el, existing) {
    var list = changes();
    showPanel(W.note, '<p class="syp-edit-about">' + esc(describe(el)) + '</p>' +
      '<label for="syp-note-text">' + W.yourNote + '</label><textarea id="syp-note-text" rows="4" placeholder="' + esc(W.notePlaceholder) + '"></textarea>' +
      '<div class="syp-edit-row">' + (existing ? '<button type="button" data-p="delete" class="syp-quiet">' + W.deleteNote + '</button>' : "") +
      '<button type="button" data-p="cancel" class="syp-quiet">' + W.cancel + '</button><button type="button" data-p="save">' + W.saveNote + '</button></div>');
    var ta = panel.querySelector("textarea");
    ta.value = existing ? existing.note : "";
    ta.focus();
    panel.onclick = function (e) {
      var act = e.target.dataset && e.target.dataset.p;
      if (!act) return;
      list = changes().filter(function (c) { return !existing || c.id !== existing.id; });
      if (act === "save" && clean(ta.value)) {
        list.push({ id: existing ? existing.id : uid(), kind: "note", path: PATH, page: document.title, where: cssPath(el),
          section: nearestHeading(el), about: describe(el), note: ta.value.trim(), time: new Date().toISOString() });
      }
      if (act === "save" || act === "delete") saveChanges(list);
      closePanel();
      drawPins();
    };
  }

  // ---------- The toolbar ----------
  var ui = document.createElement("div");
  ui.id = "syp-edit-ui";
  ui.setAttribute("role", "region");
  ui.setAttribute("aria-label", W.editMode);
  ui.innerHTML =
    '<div class="syp-edit-panel" hidden><div class="syp-edit-panel-head"><strong></strong><button type="button" class="syp-edit-x" aria-label="' + W.close + '">×</button></div><div class="syp-edit-panel-body"></div></div>' +
    '<div class="syp-edit-bar">' +
      '<span class="syp-edit-title">' + pencil + W.editMode + ' <span class="syp-edit-count">0</span> <span class="syp-edit-count-word">' + W.changes + '</span></span>' +
      '<button type="button" data-act="note" aria-pressed="false">' + W.addNote + '</button>' +
      '<button type="button" data-act="undo">' + W.undo + '</button>' +
      '<button type="button" data-act="list">' + W.myChanges + '</button>' +
      '<button type="button" data-act="send" class="syp-edit-send">' + W.send + '</button>' +
      '<button type="button" data-act="stop">' + W.exit + '</button>' +
      '<span class="syp-edit-status" role="status" aria-live="polite"></span>' +
    '</div>';
  document.body.appendChild(ui);
  var panel = ui.querySelector(".syp-edit-panel-body"), panelBox = ui.querySelector(".syp-edit-panel");
  function showPanel(title, html) {
    panelBox.querySelector("strong").textContent = title;
    panel.innerHTML = html;
    panel.onclick = null;
    panelBox.hidden = false;
  }
  function closePanel() { panelBox.hidden = true; panel.innerHTML = ""; }
  ui.querySelector(".syp-edit-x").addEventListener("click", closePanel);
  function status(t) { ui.querySelector(".syp-edit-status").textContent = t; }
  function updateCount() {
    var n = changes().length;
    ui.querySelector(".syp-edit-count").textContent = n;
    ui.querySelector(".syp-edit-count-word").textContent = n === 1 ? W.change : W.changes;
  }
  updateCount();
  drawPins();

  ui.querySelector(".syp-edit-bar").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var act = b.dataset.act;
    if (act === "note") { closePanel(); setPicking(!picking); }
    if (act === "undo") undo();
    if (act === "list") showList();
    if (act === "send") showSend();
    if (act === "stop") stop();
  });

  function undo() {
    var list = changes();
    if (!list.length) { status(W.nothingToUndo); return; }
    list.sort(function (a, b) { return a.time < b.time ? -1 : 1; });
    var last = list.pop();
    saveChanges(list);
    if (last.path === PATH && last.kind === "text") {
      var el = document.querySelector('[data-syp-id="' + last.id + '"]');
      if (el) { el.innerHTML = el.dataset.sypOrig; el.classList.remove("syp-edited"); delete el.dataset.sypId; }
    }
    drawPins();
    status(last.path === PATH ? W.undone : W.undoneOn + last.page + ".");
  }

  function summary(list) {
    var pages = {};
    list.forEach(function (c) { (pages[c.path] = pages[c.path] || []).push(c); });
    return Object.keys(pages).map(function (p) {
      return p + "\n" + pages[p].map(function (c) {
        return c.kind === "text"
          ? "  - " + W.text + (c.section ? " (" + W.under + " \"" + c.section + "\")" : "") + "\n    " + W.was + ": " + c.old + "\n    " + W.now + ": " + c.new
          : "  - " + W.noteOn + c.about + (c.section ? " (" + W.under + " \"" + c.section + "\")" : "") + "\n    " + c.note;
      }).join("\n");
    }).join("\n\n");
  }

  function showList() {
    var list = changes();
    if (!list.length) { showPanel(W.myChanges, "<p>" + W.noChanges + "</p>"); return; }
    var pages = {};
    list.forEach(function (c) { (pages[c.path] = pages[c.path] || { title: c.page, items: [] }).items.push(c); });
    var html = Object.keys(pages).map(function (p) {
      return '<h3><a href="' + esc(p) + '#edit">' + esc(pages[p].title.replace(/ \| .*$/, "")) + "</a></h3><ul>" + pages[p].items.map(function (c) {
        return "<li>" + (c.kind === "text"
          ? '<del>' + esc(c.old) + '</del><ins>' + esc(c.new) + '</ins>'
          : '<span class="syp-edit-about">' + W.noteOn + esc(c.about) + '</span>' + esc(c.note)) +
          ' <button type="button" class="syp-quiet" data-del="' + c.id + '" aria-label="' + W.removeThis + '">' + W.remove + '</button></li>';
      }).join("") + "</ul>";
    }).join("");
    showPanel(W.myChanges + " (" + list.length + ")", html + '<div class="syp-edit-row"><button type="button" data-clear class="syp-quiet">' + W.removeAll + '</button></div>');
    panel.onclick = function (e) {
      var id = e.target.dataset && e.target.dataset.del;
      if (id) {
        var el = document.querySelector('[data-syp-id="' + id + '"]');
        if (el) { el.innerHTML = el.dataset.sypOrig; el.classList.remove("syp-edited"); delete el.dataset.sypId; }
        saveChanges(changes().filter(function (c) { return c.id !== id; }));
        drawPins(); showList();
      }
      if (e.target.hasAttribute && e.target.hasAttribute("data-clear") && confirm(W.confirmRemoveAll)) {
        saveChanges([]);
        document.querySelectorAll(".syp-edited").forEach(function (el) { el.innerHTML = el.dataset.sypOrig; el.classList.remove("syp-edited"); delete el.dataset.sypId; });
        drawPins(); showList();
      }
    };
  }

  function showSend() {
    var list = changes();
    if (!list.length) { showPanel(W.send, "<p>" + W.nothingToSend + "</p>"); return; }
    showPanel(W.send + ": " + count(list.length, "change", "changes"),
      '<label for="syp-send-name">' + W.yourName + '</label><input id="syp-send-name" type="text" autocomplete="name" required>' +
      '<label for="syp-send-msg">' + W.message + '</label><textarea id="syp-send-msg" rows="3"></textarea>' +
      '<p class="syp-edit-small">' + W.sendNote + '</p>' +
      '<div class="syp-edit-row"><button type="button" data-p="cancel" class="syp-quiet">' + W.cancel + '</button><button type="button" data-p="go">' + W.send + '</button></div>');
    var nameInput = panel.querySelector("#syp-send-name");
    nameInput.value = get(NAME, "");
    nameInput.focus();
    panel.onclick = function (e) {
      var act = e.target.dataset && e.target.dataset.p;
      if (act === "cancel") closePanel();
      if (act !== "go") return;
      var name = clean(nameInput.value);
      if (!name) { nameInput.focus(); nameInput.setAttribute("aria-invalid", "true"); return; }
      put(NAME, name);
      send(name, panel.querySelector("#syp-send-msg").value.trim(), e.target);
    };
  }

  // A mailto link, with the body cut so the whole link stays under about 1,900 characters: longer links get cut off or
  // refused by some mail programs. The full list is in Netlify, so the mail says so when it is shortened.
  function mailTo(subject, intro, body) {
    var head = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=";
    var full = intro + body;
    if ((head + encodeURIComponent(full)).length <= 1900) return head + encodeURIComponent(full);
    var more = "\n\n[…] " + W.fullList;
    var keep = body.length;
    while (keep > 0 && (head + encodeURIComponent(intro + body.slice(0, keep) + more)).length > 1900) keep -= 50;
    return head + encodeURIComponent(intro + body.slice(0, Math.max(0, keep)) + more);
  }

  function send(name, message, button) {
    var list = changes();
    var now = new Date();
    var data = { site: location.origin, sentAt: now.toISOString(), name: name, message: message, count: list.length,
      changes: list.map(function (c) { var o = {}; for (var k in c) if (k !== "html") o[k] = c[k]; return o; }) };
    var json = JSON.stringify(data, null, 2);
    var stamp = now.toISOString().slice(0, 16).replace(/[-:]/g, "").replace("T", "-");
    var fileName = "syp-edits-" + stamp + ".json";
    var fd = new FormData();
    fd.append("form-name", "edit-suggestions");
    fd.append("name", name);
    fd.append("message", message);
    fd.append("count", String(list.length));
    fd.append("summary", summary(list));
    fd.append("file", new Blob([json], { type: "application/json" }), fileName);
    button.disabled = true;
    button.textContent = W.sending;
    // Netlify Forms only exists on the published site; a local test server answers "OK" to anything.
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    (local ? Promise.reject(new Error("local")) : fetch("/", { method: "POST", body: fd })).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      // Keep a copy of what was sent, so it can still be downloaded if a mail goes astray.
      put("syp-edit-last-sent", { name: fileName, json: json });
      saveChanges([]);
      document.querySelectorAll(".syp-edited").forEach(function (el) { el.classList.remove("syp-edited"); el.dataset.sypOrig = el.innerHTML; delete el.dataset.sypId; });
      drawPins();
      var copy = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      var n = count(list.length, "suggestion", "suggestions");
      var mail = EMAIL ? mailTo(fill(W.mailSubject, { n: n, name: name }),
        fill(W.mailHello, { n: n, file: fileName }) + "\n\n" + (message ? message + "\n\n" : ""),
        summary(list) + "\n\n" + name) : "";
      showPanel(W.saved, "<p>" + fill(W.thanks, { name: esc(name), n: n }) + "</p>" +
        (mail ? "<p>" + W.mailOpened + "</p>" +
          '<div class="syp-edit-row" style="justify-content:flex-start;margin-top:0"><a class="syp-edit-mail" href="' + mail + '">' + W.openMail + esc(EMAIL) + "</a></div>" : "") +
        '<p class="syp-edit-small"><a href="' + copy + '" download="' + fileName + '">' + W.downloadCopy + '</a>' + W.forYourself + '</p>' +
        '<div class="syp-edit-row"><button type="button" data-p="more" class="syp-quiet">' + W.keepEditing + '</button><button type="button" data-p="stop">' + W.exitEditMode + '</button></div>');
      // Open the mail right away while the click on Send still counts as the visitor's own action (browsers only let a
      // page open a mail program straight after a click); otherwise the button above does it.
      if (mail && (!navigator.userActivation || navigator.userActivation.isActive)) location.href = mail;
      panel.onclick = function (e) { var a = e.target.dataset && e.target.dataset.p; if (a === "more") closePanel(); if (a === "stop") stop(); };
    }).catch(function () {
      // No connection, or the form is not set up: offer the file and a mail instead, so nothing is lost.
      var url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      var mail = mailTo(fill(W.failSubject, { name: name }), fill(W.failAttached, { file: fileName }) + "\n\n" + (message ? message + "\n\n" : ""), summary(list));
      showPanel(W.failed,
        "<p>" + W.stillSaved + (EMAIL ? W.byEmail : W.asFile) + "</p><ol><li><a href=\"" + url + "\" download=\"" + fileName + "\">" + W.downloadFile + "</a></li>" +
        (EMAIL ? "<li><a href=\"" + mail + "\">" + W.writeEmail + esc(EMAIL) + "</a>" + W.attach + "</li>" : "") + "</ol>");
    });
  }

  function stop() {
    put(FLAG, "off");
    try { localStorage.removeItem(FLAG); } catch (e) {}
    location.replace(PATH + location.search);
  }
})();
