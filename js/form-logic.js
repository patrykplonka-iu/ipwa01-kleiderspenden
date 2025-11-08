/* =========================================
   Datei: form-logic.js
   Autor: Patryk Płonka
   Projekt: IPWA01-01 – Kleiderspenden
   Version: v1.8 (2025-11-08)
   Beschreibung: Formular-Logik für die Seite "Kleiderspende registrieren"
   ========================================= */

(() => {
  const form = document.getElementById("donationForm");
  if (!form) return; // Seite ohne Formular

  const OFFICE_ZIP = "15236";
  const OFFICE_PREFIX = OFFICE_ZIP.slice(0, 2);

  const modeUebergabe = document.getElementById("mode_uebergabe");
  const modeAbholung  = document.getElementById("mode_abholung");
  const addressBlock  = document.getElementById("addressBlock");

  const clothes = document.getElementById("clothes");
  const region  = document.getElementById("region");
  const zip     = document.getElementById("zip");
  const city    = document.getElementById("city");
  const street  = document.getElementById("street");
  const hnr     = document.getElementById("hnr");
  const consent = document.getElementById("consent");

  const zipHint = document.getElementById("zipHint");

  const MSG = {
    clothes: "Bitte Kleidung angeben.",
    region:  "Bitte Krisengebiet wählen.",
    consent: "Bitte zustimmen.",
    street:  "Bitte Straße angeben.",
    hnr:     "Bitte Hausnummer angeben.",
    city:    "Bitte Ort angeben.",
    zipReq:  "Gültige PLZ (5 Ziffern) eingeben.",
    zipOK:   "PLZ im Abholgebiet.",
    zipOUT:  "PLZ außerhalb des Abholgebiets."
  };

  // Übergabe/Abholung umschalten
  function updateMode() {
    if (modeAbholung.checked) {
      addressBlock.classList.add("show");
    } else {
      addressBlock.classList.remove("show");
      setZipHint("");
    }
  }
  modeUebergabe.addEventListener("change", updateMode);
  modeAbholung.addEventListener("change", updateMode);
  updateMode();

  // Live-PLZ-Hinweis
  zip?.addEventListener("input", () => {
    const v = (zip.value || "").trim();
    if (!modeAbholung.checked) return setZipHint("");

    if (/^\d{5}$/.test(v)) {
      const near = v.slice(0, 2) === OFFICE_PREFIX;
      setZipHint(near ? MSG.zipOK : MSG.zipOUT, near ? "ok" : "warn");
    } else if (v.length) {
      setZipHint(MSG.zipReq, "warn");
    } else {
      setZipHint("");
    }
  });

  // Submit-Validierung
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
    form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));

    if (!clothes.value.trim()) { showError(clothes, MSG.clothes); valid = false; }
    if (!region.value)          { showError(region,  MSG.region);  valid = false; }
    if (!consent.checked)       { showError(consent, MSG.consent); valid = false; }

    if (modeAbholung.checked) {
      if (!street.value.trim()) { showError(street, MSG.street); valid = false; }
      if (!hnr.value.trim())    { showError(hnr,   MSG.hnr);    valid = false; }
      if (!city.value.trim())   { showError(city,  MSG.city);   valid = false; }

      const v = (zip.value || "").trim();
      if (!/^\d{5}$/.test(v)) {
        showError(zip, MSG.zipReq); valid = false;
      } else {
        const near = v.slice(0, 2) === OFFICE_PREFIX;
        setZipHint(near ? MSG.zipOK : MSG.zipOUT, near ? "ok" : "warn");
      }
    }

    if (!valid) return;
    alert("Gespeichert.");
  });

  // --- Helfer ---
  function showError(input, msg) {
    input.classList.add("is-invalid");
    const div = document.createElement("div");
    div.className = "invalid-feedback";
    div.textContent = msg;
    input.parentNode.appendChild(div);
  }

  function setZipHint(text, type) {
    if (!zipHint) return;
    zipHint.textContent = text || "";
    zipHint.classList.remove("ok", "warn");
    if (type) zipHint.classList.add(type);
  }
})();
