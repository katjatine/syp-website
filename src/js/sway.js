// Every swaying wave on a page ({% wave %} and {% swayWave %}): above the blue band on the homepage (Tine, file 62,
// October 2026), on The Scheldt (file 63, point 10), and since 5 October 2026 every wave between sections and the one
// above the footer (Tine: "everywhere there is such a wavy band"). Loaded on every page (layout.njk).
// site.css moves each wave on its own; this script makes the motion less mechanical and lighter:
// - every wave gets its own speed per visit, 15.4 to 18.5 s across and 4.6 to 5.4 s up or down (30% faster since 5 October 2026), so the two never settle into one rhythm;
// - each wave rests while it is off screen, and starts again from another point of its slide and breath there,
//   where nobody sees it jump.
// Without this script the waves sway at the speeds in site.css; with less motion asked for they stand still anyway.
// The colour cards' band sways in CSS only (site.css, .colour-card::before).
(function () {
  function between(a, b) { return a + Math.random() * (b - a); }
  var watch = "IntersectionObserver" in window;
  Array.prototype.forEach.call(document.querySelectorAll(".wave-sway"), function (wave) {
    var seconds = { "wave-sway-drift": between(15.4, 18.5), "wave-sway-breathe": between(4.6, 5.4) };
    function swaying() { return wave.getAnimations ? wave.getAnimations({ subtree: true }) : []; }
    // updatePlaybackRate changes the speed from where the wave is now, so it does not jump while you look at it.
    swaying().forEach(function (a) {
      var s = seconds[a.animationName];
      if (s) a.updatePlaybackRate(a.effect.getComputedTiming().duration / 1000 / s);
    });
    if (!watch) return;
    // One observer per wave, so each one rests and wakes on its own.
    new IntersectionObserver(function (entries) {
      var away = !entries[entries.length - 1].isIntersecting;
      wave.classList.toggle("is-resting", away);
      if (away) swaying().forEach(function (a) { a.currentTime = Math.random() * 2 * a.effect.getComputedTiming().duration; });
    }).observe(wave);
  });
})();
