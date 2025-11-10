document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll("[data-include]");
  targets.forEach(async (el) => {
    const url = el.getAttribute("data-include");
    try {
      const resp = await fetch(url, { cache: "no-cache" });
      if (!resp.ok) throw new Error(resp.status + " " + resp.statusText);
      const html = await resp.text();

      const wrap = document.createElement("div");
      wrap.innerHTML = html;
      normalizeRoot(wrap); 

      el.replaceWith(...wrap.childNodes);
    } catch (err) {
      console.error("Include fehlgeschlagen:", url, err);
      el.innerHTML = "<!-- Include fehlgeschlagen: " + url + " -->";
    }
  });
});

const REPO_ROOT = "/ipwa01-kleiderspenden";
const APP_ROOT = location.hostname.endsWith("github.io") ? REPO_ROOT : "";

function normalizeRoot(scope = document) {
  scope.querySelectorAll('[href^="~/"]').forEach((el) => {
    el.setAttribute("href", APP_ROOT + el.getAttribute("href").slice(1));
  });
  scope.querySelectorAll('[src^="~/"]').forEach((el) => {
    el.setAttribute("src", APP_ROOT + el.getAttribute("src").slice(1));
  });
}
