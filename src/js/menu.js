// Mobile menu: opens and closes the navigation. Nothing else runs on the site.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  // The words in the language of the page (Tine, file 88)
  var words = { fr: ["Fermer le menu", "Menu"], nl: ["Menu sluiten", "Menu"] }[document.documentElement.lang] || ["Close menu", "Menu"];
  function isOpen() {
    return nav.classList.contains("is-open");
  }
  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? words[0] : words[1]);
  }
  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  // The open menu lies over the page: close it when keyboard focus moves on past it,
  // so the focused link is never hidden behind the menu (WCAG 2.4.11).
  nav.addEventListener("focusout", function (e) {
    var to = e.relatedTarget;
    if (isOpen() && to && !nav.contains(to) && to !== toggle) setOpen(false);
  });
  // A tap or click outside the menu closes it as well.
  document.addEventListener("click", function (e) {
    if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
})();
