// Timeline page: the title of a small moment opens and closes its text.
// The text starts folded only when this script can run (the class js-fold is set at the top of the river).
document.addEventListener("click", (event) => {
  const button = event.target.closest(".river-toggle");
  if (!button) return;
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  button.closest(".river-item").classList.toggle("is-open", open);
});

// Arriving at one moment from the homepage river (/timeline/#2015-senate-plenary; Tine, file 62, October 2026): if it is a
// small moment, its text opens, so the page shows what the card promised. Opening only adds height below the title, so the
// moment stays where the browser scrolled it. Also when the address changes on the page (hashchange).
const openTimelineMoment = () => {
  let id = "";
  try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return; }
  const item = id && document.getElementById(id);
  const button = item && item.classList.contains("river-item") && item.querySelector(".river-toggle");
  if (!button) return;
  button.setAttribute("aria-expanded", "true");
  item.classList.add("is-open");
};
openTimelineMoment();
window.addEventListener("hashchange", openTimelineMoment);
