export function highlightPreviewScript(quote: string) {
  const safe = JSON.stringify(quote).replace(/</g, "\\u003c");
  return `<script>
(function () {
  var q = ${safe};
  if (!q) return;

  function norm(s) {
    return String(s || "")
      .replace(/[\\u200e\\u200f\\u00a0\\u200b]/g, " ")
      .replace(/\\s+/g, " ")
      .trim()
      .toLowerCase();
  }
  function loose(s) {
    return norm(s).replace(/[^\\u0590-\\u05ffa-z0-9\\s]/gi, "");
  }

  function variants(text) {
    var n = norm(text);
    var l = loose(text);
    var out = [];
    function add(v) { if (v && v.length >= 8 && out.indexOf(v) < 0) out.push(v); }
    add(n);
    add(l);
    if (n.length > 48) add(n.slice(0, 48));
    if (n.length > 28) add(n.slice(0, 28));
    if (l.length > 36) add(l.slice(0, 36));
    var words = n.split(" ").filter(function (w) { return w.length > 2; });
    if (words.length >= 5) add(words.slice(0, 6).join(" "));
    if (words.length >= 8) add(words.slice(2, 8).join(" "));
    return out;
  }

  function smallestMatch(needles) {
    var nodes = document.body.querySelectorAll("p, li, td, th, span, a, strong, em, small, label, h1, h2, h3, h4, h5, div, section, article, blockquote, figcaption");
    var best = null;
    var bestLen = Infinity;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el || !el.textContent) continue;
      if (el.closest("script, style, noscript, svg, textarea")) continue;
      var t = norm(el.textContent);
      var tl = loose(el.textContent);
      if (!t || t.length > 2000) continue;
      for (var n = 0; n < needles.length; n++) {
        var needle = needles[n];
        if ((t.indexOf(needle) >= 0 || tl.indexOf(loose(needle)) >= 0) && t.length < bestLen) {
          best = el;
          bestLen = t.length;
          break;
        }
      }
    }
    return best;
  }

  function wrapTextNode(el, needles) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var raw = node.textContent || "";
      var lowered = norm(raw);
      for (var i = 0; i < needles.length; i++) {
        var needle = needles[i];
        var idx = lowered.indexOf(needle);
        if (idx < 0) continue;
        try {
          var start = Math.max(0, raw.toLowerCase().indexOf(needle.slice(0, Math.min(12, needle.length))));
          if (start < 0) start = 0;
          var end = Math.min(raw.length, start + Math.min(raw.length - start, Math.max(needle.length, 24)));
          var range = document.createRange();
          range.setStart(node, start);
          range.setEnd(node, end);
          var mark = document.createElement("mark");
          mark.setAttribute("data-clarity", "1");
          range.surroundContents(mark);
          return mark;
        } catch (e) {}
      }
    }
    return null;
  }

  function scrollToEl(el) {
    if (!el) return false;
    try {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.documentElement.style.height = "auto";
      document.body.style.height = "auto";
    } catch (e) {}
    el.scrollIntoView({ block: "center", inline: "nearest" });
    var parent = el.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      var style = window.getComputedStyle(parent);
      if (/(auto|scroll)/.test(style.overflowY) || parent.scrollHeight > parent.clientHeight + 40) {
        var rect = el.getBoundingClientRect();
        var prect = parent.getBoundingClientRect();
        parent.scrollTop += rect.top - prect.top - prect.height / 2 + rect.height / 2;
      }
      parent = parent.parentElement;
    }
    var top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
    window.scrollTo(0, Math.max(0, top));
    return true;
  }

  function paint(el, needles) {
    el.classList.add("clarity-hit");
    el.setAttribute("data-clarity-block", "1");
    var mark = wrapTextNode(el, needles) || el;
    scrollToEl(mark);
    setTimeout(function () { scrollToEl(mark); }, 200);
    setTimeout(function () { scrollToEl(mark); }, 700);
    setTimeout(function () { scrollToEl(mark); }, 1400);
    try { window.parent.postMessage({ type: "clarity-found" }, "*"); } catch (e) {}
    return true;
  }

  function banner(ok) {
    if (document.getElementById("clarity-find-banner")) return;
    var bar = document.createElement("div");
    bar.id = "clarity-find-banner";
    bar.textContent = ok
      ? "המקום המדויק מסומן בצהוב"
      : "לא מצאנו את המשפט המדויק בעמוד החי — בדקו את הציטוט למעלה";
    bar.setAttribute("dir", "rtl");
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function hit() {
    return document.querySelector("mark[data-clarity], .clarity-hit");
  }

  function run() {
    if (!document.body) return false;
    var done = hit();
    if (done) {
      scrollToEl(done);
      banner(true);
      return true;
    }
    var needles = variants(q);
    var el = smallestMatch(needles);
    if (!el) {
      banner(false);
      try { window.parent.postMessage({ type: "clarity-miss" }, "*"); } catch (e) {}
      return false;
    }
    paint(el, needles);
    banner(true);
    return true;
  }

  window.__clarityScrollToHit = function () {
    var el = hit();
    if (el) return scrollToEl(el);
    return run();
  };

  function start() {
    if (run()) return;
    setTimeout(run, 250);
    setTimeout(run, 900);
    setTimeout(run, 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
</script>`;
}

export function previewStyles() {
  return `<style>
  html, body {
    overflow: auto !important;
    height: auto !important;
    max-height: none !important;
  }
  body { padding-bottom: 45vh !important; }
  mark[data-clarity], .clarity-hit {
    background: #fff3bf !important;
    outline: 3px solid #1d6fee !important;
    outline-offset: 3px;
    box-shadow: 0 0 0 10px rgba(29,111,238,.16);
    scroll-margin: 30vh;
  }
  mark[data-clarity] { padding: 0 .12em; }
  #clarity-find-banner {
    position: sticky; top: 0; z-index: 2147483647;
    background: #1d6fee; color: #fff;
    font: 600 13px/1.4 system-ui, sans-serif;
    padding: 10px 14px; text-align: center;
  }
</style>`;
}
