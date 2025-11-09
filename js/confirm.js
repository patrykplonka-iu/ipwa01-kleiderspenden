/* =========================================
   Datei: confirm.js
   Zweck: Bestätigungsseite für "Kleiderspende"
    Autor: Patryk Płonka
   Projekt: IPWA01-01 – Kleiderspenden
   ========================================= */

(() => {
  const modeBadge = document.getElementById("modeBadge");
  const summary   = document.getElementById("summary");
  const ts        = document.getElementById("timestamp");

  // --- Helpers ---
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );

  const row = (label, value) => `
    <dt class="col-5 col-sm-4 text-secondary">${esc(label)}</dt>
    <dd class="col-7 col-sm-8 mb-2">${esc(value)}</dd>
  `;

  const parseJSON = (raw) => {
    try { return JSON.parse(raw); } catch { return null; }
  };

  // --- 1) Daten laden (neu → alt) ---
  let data = parseJSON(sessionStorage.getItem("donationForm"));
  if (!data) data = parseJSON(sessionStorage.getItem("donation"));

  // --- 2) Kein Datensatz ---
  if (!data) {
    modeBadge.innerHTML = '<span class="badge text-bg-warning">Keine Daten gefunden</span>';
    summary.innerHTML   = '<div class="alert alert-warning mb-0">Bitte füllen Sie zuerst das Formular aus.</div>';
    ts.textContent = "Zeitstempel: " + new Date().toLocaleString("de-DE");
    return;
  }

  // --- 3) Schema-Normalisierung ---
  // mode
  const isAbholung = String(data.mode || "").toLowerCase() === "abholung";

  // clothes
  const clothes = data.clothes ?? "–";

  // region (może być string lub {label|value})
  let regionLabel = "–";
  if (typeof data.region === "string") {
    regionLabel = data.region || "–";
  } else if (data.region && (data.region.label || data.region.value)) {
    regionLabel = data.region.label || data.region.value || "–";
  }

  // address (opcjonalny w trybie Abholung)
  const addr = data.address && typeof data.address === "object" ? data.address : null;

  // PLZ-Hinweis: v2.0 daje officeZipPreview (tekst), stare może mieć nearOffice:boolean
  let plzHinweis = "";
  if (typeof data.officeZipPreview === "string" && data.officeZipPreview.trim()) {
    plzHinweis = data.officeZipPreview.trim();
  } else if (addr && typeof addr.nearOffice === "boolean") {
    plzHinweis = addr.nearOffice
      ? "Ihre PLZ liegt im Abholgebiet der Geschäftsstelle."
      : "Außerhalb des Abholgebiets – Übergabe an Geschäftsstelle empfohlen.";
  }

  // Zeitstempel: v2.0 -> timestamp (ISO), alt -> submittedAt
  const rawWhen = data.timestamp || data.submittedAt || null;
  const when = rawWhen ? new Date(rawWhen) : new Date();

  // --- 4) Badge / Header ---
  modeBadge.innerHTML = isAbholung
    ? '<span class="badge text-bg-info">Modus: Abholung</span>'
    : '<span class="badge text-bg-success">Modus: Übergabe an Geschäftsstelle</span>';

  // --- 5) Zusammenfassung bauen ---
  let html = "";
  html += row("Art der Kleidung", clothes);
  html += row("Krisengebiet", regionLabel);

  if (isAbholung && addr) {
    html += row("Straße",   addr.street ?? "–");
    html += row("Haus-Nr.", addr.hnr    ?? "–");
    html += row("PLZ",      addr.zip    ?? "–");
    html += row("Ort",      addr.city   ?? "–");
    if (plzHinweis) {
      html += row("PLZ-Hinweis", plzHinweis);
    }
  } else {
    html += row("Ort", "Geschäftsstelle");
  }

  summary.innerHTML = html;

  // --- 6) Zeitstempel anzeigen ---
  ts.textContent = "Zeitstempel: " + when.toLocaleString("de-DE");
})();
