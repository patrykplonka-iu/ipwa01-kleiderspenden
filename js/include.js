document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll("[data-include]");
  targets.forEach(async (el) => {
    const url = el.getAttribute("data-include");
    try {
      const resp = await fetch(url, { cache: "no-cache" });
      if (!resp.ok) throw new Error(resp.status + " " + resp.statusText);
      const html = await resp.text();
      el.outerHTML = html;
    } catch (err) {
      console.error("Include fehlgeschlagen:", url, err);
      el.innerHTML = "<!-- Include fehlgeschlagen: " + url + " -->";
    }
  });
});
