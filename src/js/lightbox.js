// Opens a photo large, over the page, when someone clicks a photo link (class "lightbox-link").
// Closes with the Close button, the Escape key or a click next to the photo.
// Without JavaScript the link simply opens the photo file, so nothing breaks.
(function () {
  var links = document.querySelectorAll("a.lightbox-link");
  if (!links.length || typeof HTMLDialogElement !== "function") return;

  // The words in the language of the page (Tine, file 88)
  var words = { fr: ["Photo", "Fermer"], nl: ["Foto", "Sluiten"] }[document.documentElement.lang] || ["Photo", "Close"];
  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", words[0]);
  dialog.innerHTML =
    '<button type="button" class="lightbox-close">' + words[1] + '</button>' +
    '<figure class="lightbox-figure"><img class="lightbox-img" alt=""><figcaption class="lightbox-caption"></figcaption></figure>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector(".lightbox-img");
  var caption = dialog.querySelector(".lightbox-caption");
  var closeButton = dialog.querySelector(".lightbox-close");
  var opener = null;

  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      opener = link;
      var thumb = link.querySelector("img");
      img.src = link.getAttribute("href");
      dialog.classList.toggle("is-pan", link.classList.contains("hero-zoom"));
      img.alt = thumb ? thumb.alt : "";
      var text = link.getAttribute("data-caption") || "";
      caption.textContent = text;
      caption.hidden = !text;
      dialog.showModal();
      closeButton.focus();
      // A panned photo starts in the middle (once it has a size)
      if (dialog.classList.contains("is-pan")) {
        var centre = function () { var f = img.parentNode; f.scrollLeft = (f.scrollWidth - f.clientWidth) / 2; };
        if (img.complete) centre(); else img.addEventListener("load", centre, { once: true });
      }
    });
  });

  closeButton.addEventListener("click", function () { dialog.close(); });
  // Escape closes the photo. Browsers usually do this themselves for a dialog; this makes sure.
  document.addEventListener("keydown", function (event) {
    if ((event.key === "Escape" || event.key === "Esc") && dialog.open) {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog || event.target.classList.contains("lightbox-figure")) dialog.close();
  });
  dialog.addEventListener("close", function () {
    img.removeAttribute("src");
    if (opener) opener.focus();
  });
})();
