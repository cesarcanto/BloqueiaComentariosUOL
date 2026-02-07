const HIDE_ATTR = "data-uol-comments-hidden";

const SELECTORS = [
  "[id*='comment' i]",
  "[class*='comment' i]",
  "[id*='coment' i]",
  "[class*='coment' i]",
  "[id*='disqus' i]",
  "[class*='disqus' i]",
  "[id*='facebook' i]",
  "[class*='facebook' i]",
  "[data-component*='comment' i]",
  "[data-section*='comment' i]",
  "[data-comments]",
  "[data-testid*='comment' i]",
  "[data-qa*='comment' i]",
  "[aria-label*='comment' i]",
  "[aria-label*='coment' i]",
  "iframe[src*='comment' i]",
  "iframe[src*='coment' i]",
  "iframe[src*='disqus' i]",
  "iframe[src*='facebook' i]"
];

function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function looksLikeCommentArea(el) {
  if (!el || el.nodeType !== 1) return false;

  const id = el.getAttribute("id") || "";
  const cls = el.getAttribute("class") || "";
  const aria = el.getAttribute("aria-label") || "";
  const sample = (el.textContent || "").slice(0, 2000);

  const hay = normalizeText(`${id} ${cls} ${aria} ${sample}`);

  if (hay.includes("coment") || hay.includes("comment")) return true;
  if (el.querySelector("textarea, [contenteditable='true']")) return true;
  return false;
}

function hideElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.hasAttribute(HIDE_ATTR)) return false;
  el.setAttribute(HIDE_ATTR, "1");
  el.style.setProperty("display", "none", "important");
  return true;
}

function findByHeadings() {
  const results = new Set();
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((h) => {
    const text = normalizeText(h.textContent);
    if (!text.includes("coment")) return;
    const container = h.closest("section, article, div, aside, main");
    if (container) results.add(container);
    const next = h.nextElementSibling;
    if (next) results.add(next);
  });
  return results;
}

function hideComments() {
  let hidden = 0;
  const candidates = new Set();

  SELECTORS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => candidates.add(el));
  });

  findByHeadings().forEach((el) => candidates.add(el));

  candidates.forEach((el) => {
    if (looksLikeCommentArea(el)) {
      if (hideElement(el)) hidden += 1;
    }
  });

  if (hidden > 0) {
    console.log("UOL comments hidden:", hidden);
    return true;
  }
  return false;
}

let scheduled = false;
function scheduleHide() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    hideComments();
  });
}

// Tenta imediatamente e depois observa mudanças
scheduleHide();

const observer = new MutationObserver(scheduleHide);
observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});
