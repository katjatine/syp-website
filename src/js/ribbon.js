// The photo ribbon (blocks/photo-ribbon.njk; About, "Come for the river, stay for the friends"; Tine, file 63, option A,
// October 2026): one strip of photos that slides slowly and endlessly to the left. site.css does the sliding; this script:
// - puts a copy of the photos after them, so the strip runs on without a seam. The copy is only there to look at: screen
//   readers and the Tab key skip it (aria-hidden, inert), and a click on a copied photo opens the original one large;
// - sets the speed to about 30 px a second, however many photos there are and however wide the screen is;
// - lets the strip rest while the mouse is on it (site.css), while the Tab key is in it, while a photo is open large,
//   while it is off screen, and after a click on the Pause button under it (WCAG 2.2.2, moving content can be stopped);
// - with the Tab key, brings the photo with the focus into view;
// - loads all photos once the strip comes near the screen, so none of them appears empty when it slides in.
// Without this script, and for people who ask for less motion, the strip stands still and can be swiped (site.css).
(function () {
  var SPEED = 30;   // px a second, as in the demo Tine chose: calm enough to look at every photo
  var ribbons = document.querySelectorAll("[data-ribbon]");
  if (!ribbons.length || !window.matchMedia) return;
  var lessMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  Array.prototype.forEach.call(ribbons, function (ribbon) {
    if (ribbon.hasAttribute("data-ribbon-ready")) return;   // every ribbon on a page loads this script: set each up once
    ribbon.setAttribute("data-ribbon-ready", "");
    setUp(ribbon);
  });

  function setUp(ribbon) {
    var view = ribbon.querySelector(".ribbon-window");
    var track = ribbon.querySelector(".ribbon-track");
    var list = ribbon.querySelector(".ribbon-list");
    var controls = ribbon.querySelector(".ribbon-controls");
    var button = ribbon.querySelector(".ribbon-toggle");
    var originals = list.querySelectorAll(".ribbon-link");
    var copies = [];       // the copied lists, after the original one
    var reasons = {};      // why the strip rests now: user, focus, photo, away
    var period = 0;        // the width of one set of photos, with the space after each one
    var shift = 0;         // how far the strip is moved to the left while the Tab key is in it, in px
    var moving = false;
    var near = false;      // the strip is close to the screen: every photo may load
    var byPointer = false; // the photo open large was opened with the mouse or a finger, not with the keyboard

    // Resting has several reasons at once; the strip moves again when none is left.
    function rest(reason, on) {
      if (on) reasons[reason] = true; else delete reasons[reason];
      ribbon.classList.toggle("is-paused", Object.keys(reasons).length > 0);
    }

    // Lazy photos in the hidden part of a moving strip would only load once they slide in, and show up empty.
    function loadAll(root) {
      Array.prototype.forEach.call(root.querySelectorAll('img[loading="lazy"]'), function (img) { img.loading = "eager"; });
    }

    // The space between the text column and the edge of the screen (site.css moves the ribbon out by exactly that much)
    function inset() { return -parseFloat(getComputedStyle(ribbon).marginLeft) || 0; }

    // How far the strip is moved to the left right now, in px
    function currentShift() {
      var transform = getComputedStyle(track).transform;
      if (!transform || transform === "none") return 0;
      var Matrix = window.DOMMatrixReadOnly || window.WebKitCSSMatrix;
      return Matrix ? -new Matrix(transform).m41 : -parseFloat(transform.split(",")[4]) || 0;
    }

    // Start the slide afresh at a given point. A new CSS animation begins where its (negative) delay says, so the strip
    // stays where it is, also when the speed changes after a resize.
    function startAt(px) {
      var at = ((px % period) + period) % period;
      track.style.setProperty("--ribbon-delay", (-at / SPEED).toFixed(3) + "s");
      track.style.animation = "none";
      void track.offsetWidth;   // let the browser drop the old animation before the new one starts
      track.style.animation = "";
    }

    // A copy of the photos: to look at only
    function addCopy() {
      var copy = list.cloneNode(true);
      copy.classList.add("ribbon-copy");
      copy.setAttribute("aria-hidden", "true");
      copy.setAttribute("inert", "");
      Array.prototype.forEach.call(copy.querySelectorAll("a"), function (a) {
        a.classList.remove("lightbox-link");   // lightbox.js binds the originals only; a click here opens the original
        a.setAttribute("tabindex", "-1");
      });
      if (near) loadAll(copy);
      track.appendChild(copy);
      copies.push(copy);
    }

    // Measure one set of photos, add copies until the strip is always full (one copy, unless the set is narrower than
    // the screen) and set the time one set takes to slide by.
    function measure() {
      period = list.offsetWidth;   // offsetWidth ignores the slide itself
      if (!period) return false;
      var needed = Math.max(1, Math.ceil(view.clientWidth / period));
      while (copies.length < needed) addCopy();
      while (copies.length > needed) track.removeChild(copies.pop());
      track.style.setProperty("--ribbon-copies", String(copies.length + 1));
      track.style.setProperty("--ribbon-duration", (period / SPEED).toFixed(3) + "s");
      return true;
    }

    function start() {
      if (moving || lessMotion.matches || !measure()) return;
      moving = true;
      // A computer with classic scrollbars shows one under the still strip; the sliding strip keeps its room, so the
      // page below does not move up when the slide begins
      ribbon.style.setProperty("--ribbon-bar", (view.offsetHeight - view.clientHeight) + "px");
      ribbon.classList.add("is-moving");
      // The first photo starts in line with the text above it; the end of the last one fills the margin on its left
      startAt(period - inset());
      controls.hidden = false;
    }

    function stop() {
      if (!moving) return;
      moving = false;
      ribbon.classList.remove("is-moving", "is-browsing");
      track.style.transform = "";
      track.style.animation = "";
      while (copies.length) track.removeChild(copies.pop());
      controls.hidden = true;
    }

    // Edit mode (js/edit.js, the pencil in the About footer; Tine, file 58) makes the captions editable: then the strip
    // stands still, as for less motion, so a caption does not slide away while someone types in it, and no copy is left
    // that could not be edited. edit.js marks the page with "syp-editing", possibly after this script has run.
    function editing() { return document.documentElement.classList.contains("syp-editing"); }
    function apply() { if (lessMotion.matches || editing()) stop(); else start(); }
    if ("MutationObserver" in window) new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // The words in the language of the page (Tine, file 88)
    var ribbonWords = { fr: ["Relancer les photos qui défilent", "Mettre en pause les photos qui défilent"], nl: ["De bewegende foto's hervatten", "De bewegende foto's pauzeren"] }[document.documentElement.lang] || ["Resume the moving photos", "Pause the moving photos"];
    // The Pause/Play button. Its name says what a click will do, as in the WAI-ARIA example of a moving carousel.
    button.addEventListener("click", function () {
      var paused = !reasons.user;
      rest("user", paused);
      button.classList.toggle("is-paused", paused);
      button.setAttribute("aria-label", paused ? ribbonWords[0] : ribbonWords[1]);
    });

    // A copied photo cannot be clicked itself (inert lets the click fall through to the strip): find the photo under
    // the pointer and open its original, with the same large photo and caption.
    function copiedPhotoAt(x, y) {
      for (var c = 0; c < copies.length; c++) {
        var links = copies[c].querySelectorAll(".ribbon-link");
        for (var i = 0; i < links.length; i++) {
          var box = links[i].getBoundingClientRect();
          if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return i;
        }
      }
      return -1;
    }
    track.addEventListener("click", function (event) {
      var index = -1;
      var link = event.target.closest && event.target.closest(".ribbon-copy .ribbon-link");
      if (link) index = Array.prototype.indexOf.call(link.closest(".ribbon-copy").querySelectorAll(".ribbon-link"), link);   // browsers without inert
      else if (event.target === track) index = copiedPhotoAt(event.clientX, event.clientY);
      if (index < 0 || !originals[index]) return;
      event.preventDefault();
      byPointer = true;   // only the mouse or a finger reaches a copy
      originals[index].click();
    });
    // The magnifying-glass pointer over the copied photos too, as over the originals
    track.addEventListener("mousemove", function (event) {
      track.style.cursor = event.target === track && copiedPhotoAt(event.clientX, event.clientY) >= 0 ? "zoom-in" : "";
    });

    // While a photo is open large (js/lightbox.js), the strip rests behind it.
    ribbon.addEventListener("click", function (event) {
      var link = event.target.closest && event.target.closest(".ribbon-link");
      if (!link || link.closest(".ribbon-copy")) return;
      if (event.detail > 0) byPointer = true;   // a real click; Enter on a focused photo gives 0
      setTimeout(function () {
        var dialog = document.querySelector("dialog.lightbox[open]");
        if (!dialog) return;
        rest("photo", true);
        dialog.addEventListener("close", function closed() {
          dialog.removeEventListener("close", closed);
          byPointer = false;
          rest("photo", false);
        });
      }, 0);
    });

    // The Tab key in the strip: it rests, and the photo with the focus slides into view. A click with the mouse does
    // not count (that focus is not visible), so the strip does not jump when you click a photo.
    function byKeyboard(element) {
      try { return element.matches(":focus-visible"); } catch (error) { return true; }
    }
    view.addEventListener("focusin", function (event) {
      var link = event.target.closest && event.target.closest(".ribbon-link");
      // js/lightbox.js gives the focus back to the photo when it closes. After a photo opened with the mouse (often a
      // copy, which then hands over to its original) that is no reason to stop and jump to the original: closing with
      // Escape would leave the strip standing still with a ring round a photo. Let it go and slide on.
      if (link && byPointer && reasons.photo) {
        byPointer = false;
        setTimeout(function () { if (document.activeElement === link) link.blur(); }, 0);
        return;
      }
      // A still strip (less motion, edit mode, no copies yet) leaves scrolling to the browser, which does not bring a
      // half-visible photo into view: do it for the Tab key, so the focused photo and its ring are seen whole.
      if (!moving) {
        if (link && byKeyboard(link)) link.closest(".ribbon-item").scrollIntoView({ block: "nearest", inline: "nearest" });
        return;
      }
      if (!link || !byKeyboard(link)) return;
      rest("focus", true);
      if (!ribbon.classList.contains("is-browsing")) {
        shift = currentShift();
        track.style.transform = "translateX(" + -shift + "px)";
        ribbon.classList.add("is-browsing");   // site.css: no animation, the strip follows the focus instead
        void track.offsetWidth;                // glide from here
      }
      var width = view.clientWidth;
      var left = link.closest(".ribbon-item").offsetLeft;
      var right = left + link.offsetWidth;
      var margin = Math.max(0, Math.min(inset(), (width - link.offsetWidth) / 2));
      var target = shift;
      if (left - margin < shift) target = left - margin;
      else if (right + margin > shift + width) target = right + margin - width;
      if (target === shift) return;
      // A short way glides; a long one (the photo's copy was in view, not the photo itself) jumps at once.
      if (Math.abs(target - shift) > width) {
        track.style.transition = "none";
        track.style.transform = "translateX(" + -target + "px)";
        void track.offsetWidth;
        track.style.transition = "";
      } else {
        track.style.transform = "translateX(" + -target + "px)";
      }
      shift = target;
    });
    view.addEventListener("focusout", function (event) {
      if (event.relatedTarget && view.contains(event.relatedTarget)) return;
      rest("focus", false);
      if (!ribbon.classList.contains("is-browsing")) return;
      ribbon.classList.remove("is-browsing");
      track.style.transform = "";
      startAt(shift);   // slide on from where the focus left it
    });

    // overflow: clip keeps the strip from being scrolled; older browsers only know overflow: hidden, which a focused
    // link could still scroll. Keep it at the start there, the slide does the moving.
    view.addEventListener("scroll", function () { if (moving && view.scrollLeft) view.scrollLeft = 0; });

    // Rest while off screen; load every photo when the strip is one screen away.
    if ("IntersectionObserver" in window) {
      rest("away", true);
      new IntersectionObserver(function (entries) {
        rest("away", !entries[entries.length - 1].isIntersecting);
      }).observe(view);
      new IntersectionObserver(function (entries, observer) {
        if (!entries[entries.length - 1].isIntersecting) return;
        near = true;
        loadAll(ribbon);
        observer.disconnect();
      }, { rootMargin: "100% 0px" }).observe(view);
    } else {
      near = true;
      loadAll(ribbon);
    }

    // A new width of the window can change the height of the photos (site.css): measure again, keep the place.
    var resizing = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizing);
      resizing = setTimeout(function () {
        if (!moving || ribbon.classList.contains("is-browsing")) return;
        var before = period, at = currentShift();
        if (measure()) startAt(at * period / before);
      }, 200);
    });

    // Less motion can be switched on or off while the page is open
    if (lessMotion.addEventListener) lessMotion.addEventListener("change", apply);
    else if (lessMotion.addListener) lessMotion.addListener(apply);
    apply();
  }
})();
