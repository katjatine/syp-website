// Go with the flow page: draw a card from one of the three piles.
// The cards come from the "piles" list in src/go-with-the-flow.md. Without JavaScript the page shows an example card instead.
(function () {
  var source = document.getElementById("game-cards");
  if (!source) return;
  var piles = {};
  JSON.parse(source.textContent).forEach(function (p) { piles[p.key] = p.cards || []; });
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("game-ready");

  document.querySelectorAll("[data-pile]").forEach(function (pile) {
    var cards = piles[pile.getAttribute("data-pile")] || [];
    if (!cards.length) return;
    var card = pile.querySelector(".game-card");
    var text = pile.querySelector(".game-front-text");
    var button = pile.querySelector(".game-draw");
    var live = pile.querySelector(".game-live");
    var order = [];
    var last = -1;

    // Every card comes once before the pile is shuffled again, and never the same card twice in a row.
    function next() {
      if (!order.length) {
        order = cards.map(function (_, i) { return i; });
        for (var i = order.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = order[i]; order[i] = order[j]; order[j] = t;
        }
        if (order[0] === last && order.length > 1) order.push(order.shift());
      }
      last = order.shift();
      return cards[last];
    }

    function show() {
      var drawn = next();
      text.textContent = drawn;
      live.textContent = drawn;
      card.classList.add("is-flipped");
      // In the language of the page (Tine, file 88)
      button.textContent = { fr: "Tire une autre carte", nl: "Trek nog een kaart" }[document.documentElement.lang] || "Draw another card";
    }

    function draw() {
      if (card.classList.contains("is-flipped")) {
        // Turn the card back first, then show the next one.
        card.classList.remove("is-flipped");
        window.setTimeout(show, calm ? 0 : 320);
      } else {
        show();
      }
    }

    // A click on the card only turns it over, like a real card (Tine, 6 November 2026): front, back, front, the same card.
    // Drawing a new card is what the button under it is for.
    function turn() {
      card.classList.toggle("is-flipped");
    }

    button.addEventListener("click", draw);
    card.addEventListener("click", turn);
  });
})();
