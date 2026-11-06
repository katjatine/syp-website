// The page with the missing information (/relecture/): keep the answers in this browser and copy them as plain text.
// An item is a fieldset with data-rel-item: either choices (radio buttons named after the item, plus a box "<key>-note"),
// or only a box named after the item itself.
// A check (data-rel-kind="check") is a line we filled in ourselves: a "Not right" box (checkbox named after the item)
// opens a box "<key>-note" for the correction. Unticked checks count as fine, so only the questions are counted.
(function () {
  var form = document.getElementById("relecture");
  if (!form) return;
  var KEY = form.getAttribute("data-rel-store") || "syp-missing-info-v1";
  var items = Array.prototype.slice.call(form.querySelectorAll("[data-rel-item]"));
  var questions = items.filter(function (item) { return item.getAttribute("data-rel-kind") !== "check"; });
  var checks = items.filter(function (item) { return item.getAttribute("data-rel-kind") === "check"; });
  var progress = document.getElementById("rel-progress");
  var status = document.getElementById("rel-status");
  var output = document.getElementById("rel-output");
  var outputLabel = document.getElementById("rel-output-label");

  function load() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function save(data) {
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* works without saving */ }
  }
  function collect() {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === "radio" || el.type === "checkbox") { if (el.checked) data[el.name] = el.value; }
      else if ((el.tagName === "TEXTAREA" || el.type === "text") && el.value.trim()) { data[el.name] = el.value; }
    });
    return data;
  }
  function restore(data) {
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || !(el.name in data)) return;
      if (el.type === "radio" || el.type === "checkbox") el.checked = el.value === data[el.name];
      else if (el.tagName === "TEXTAREA" || el.type === "text") el.value = data[el.name];
    });
  }
  // A question counts as answered when a choice is made, or when its only box is filled in.
  function update() {
    var data = collect();
    var done = 0;
    questions.forEach(function (item) {
      var answered = !!data[item.getAttribute("data-rel-item")];
      item.classList.toggle("is-answered", answered);
      if (answered) done++;
    });
    checks.forEach(function (item) {
      item.classList.toggle("is-flagged", !!data[item.getAttribute("data-rel-item")]);
    });
    progress.textContent = done + " of " + questions.length + " questions answered";
    return data;
  }
  function today() {
    var d = new Date();
    function two(n) { return (n < 10 ? "0" : "") + n; }
    return two(d.getDate()) + "/" + two(d.getMonth() + 1) + "/" + d.getFullYear();
  }
  function oneLine(text) { return text.trim().replace(/\s*\n+\s*/g, " / "); }
  function summary() {
    var data = collect();
    var lines = ["Missing information for the SYP website, answers from " + (form.getAttribute("data-rel-who") || "?"), "Filled in on " + today(), ""];
    var n = 0;
    // Section by section, in the order of the page. A list of checks gives only the lines marked "Not right",
    // then one line for all the others; a question always gives its answer, or "no answer".
    Array.prototype.forEach.call(form.querySelectorAll(".rel-section"), function (section) {
      var inSection = items.filter(function (item) { return section.contains(item); });
      if (!inSection.length) return;
      lines.push(section.querySelector("h2").textContent.trim());
      lines.push("");
      var sectionChecks = inSection.filter(function (item) { return checks.indexOf(item) !== -1; });
      var flagged = sectionChecks.filter(function (item) { return !!data[item.getAttribute("data-rel-item")]; });
      flagged.forEach(function (item) {
        var key = item.getAttribute("data-rel-item");
        lines.push("Not right: " + item.getAttribute("data-rel-title"));
        lines.push("   Correction: " + (data[key + "-note"] ? oneLine(data[key + "-note"]) : "(none given)"));
      });
      if (sectionChecks.length) { lines.push(flagged.length ? "All the other lines: fine." : "All lines: fine."); lines.push(""); }
      inSection.filter(function (item) { return questions.indexOf(item) !== -1; }).forEach(function (item) {
        var key = item.getAttribute("data-rel-item");
        var path = item.getAttribute("data-rel-path");
        n++;
        lines.push(n + ". " + item.getAttribute("data-rel-title") + (path ? " (" + path + ")" : ""));
        if (item.querySelector("input[type=radio]")) {
          var checked = item.querySelector("input[type=radio]:checked");
          lines.push("   Answer: " + (checked ? checked.value : "no answer"));
          if (data[key + "-note"]) lines.push("   Remark: " + oneLine(data[key + "-note"]));
        } else {
          lines.push("   Answer: " + (data[key] ? oneLine(data[key]) : "no answer"));
        }
        lines.push("");
      });
    });
    lines.push("Anything else: " + (data.autre ? oneLine(data.autre) : "nothing"));
    return lines.join("\n");
  }


  restore(load());
  update();
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  form.addEventListener("change", function () { save(update()); });
  form.addEventListener("input", function () { save(update()); });

  document.getElementById("rel-copy").addEventListener("click", function () {
    var text = summary();
    output.value = text;
    output.hidden = false;
    outputLabel.hidden = false;
    function copied() { status.textContent = "Copied. You can paste your answers into an e-mail to Tine."; }
    function manual() { status.textContent = "Copying did not work. Select the text below and copy it yourself."; output.focus(); output.select(); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copied, manual);
    } else {
      manual();
    }
  });

  document.getElementById("rel-reset").addEventListener("click", function () {
    if (!window.confirm("Clear all your answers?")) return;
    form.reset();
    try { window.localStorage.removeItem(KEY); } catch (e) { /* nothing to remove */ }
    update();
    output.hidden = true;
    outputLabel.hidden = true;
    status.textContent = "Answers cleared.";
  });
})();
