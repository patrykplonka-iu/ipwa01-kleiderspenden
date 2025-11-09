/* =========================================
   Datei: form-logic.js
   Autor: Patryk Płonka
   Projekt: IPWA01-01 – Kleiderspenden
   Version: v2.0 (2025-11-08)
   Beschreibung: Formular-Logik für "Kleiderspende registrieren"
   ========================================= */

(() => {
  // Formular-Root
  const form = document.getElementById("donationForm");
  if (!form) { console.warn("[form-logic] Kein Formular gefunden."); return; }

  // Geschäftsstellen-PLZ (Demo: Präfixvergleich)
  const OFFICE_ZIP = "15236";
  const OFFICE_PREFIX = OFFICE_ZIP.slice(0, 2);

  // Elemente
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

  // Kurze Meldungen
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

  // Übergabe/Abholung umschalten – robust (entfernt d-none, setzt .show)
  function updateMode() {
    if (!addressBlock || !modeAbholung) return;
    const on = !!modeAbholung.checked;

    // Falls irgendwo d-none blieb – sicherheitshalber entfernen
    addressBlock.classList.remove("d-none");

    // Sanftes Ein-/Ausblenden (CSS steuert die Animation)
    addressBlock.classList.toggle("show", on);

    // Fallback gegen kollidierende Styles
    addressBlock.style.display = on ? "block" : "";
    if (!on) setZipHint(""); // Slot leeren, Höhe bleibt stabil
  }

  modeUebergabe?.addEventListener("change", updateMode);
  modeAbholung ?.addEventListener("change", updateMode);
  updateMode(); // Initialzustand

  // Live-PLZ-Hinweis
  zip?.addEventListener("input", () => {
    if (!modeAbholung?.checked) return setZipHint("");
    const v = (zip.value || "").trim();

    if (/^\d{5}$/.test(v)) {
      const near = v.slice(0, 2) === OFFICE_PREFIX;
      setZipHint(near ? MSG.zipOK : MSG.zipOUT, near ? "ok" : "warn");
    } else if (v.length) {
      setZipHint(MSG.zipReq, "warn");
    } else {
      setZipHint("");
    }
  });
  
  // Eingaben bereinigen (gegen injizierten Code)
  function sanitizeInput(value) {
    return value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .trim();
  }

  function sanitizeFormInputs() {
    const fields = [clothes, region, street, hnr, city, zip];
    fields.forEach(f => {
      if (f && typeof f.value === "string") {
        f.value = sanitizeInput(f.value);
      }
    });
  }

  // Submit-Validierung + Weiterleitung zur Bestätigung
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sanitizeFormInputs();
    let valid = true;

    // Alte Fehler entfernen
    form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
    form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));

    // Pflichtfelder (immer)
    if (!clothes?.value?.trim()) { showError(clothes, MSG.clothes); valid = false; }
    if (!region ?.value)         { showError(region,  MSG.region ); valid = false; }
    if (!consent?.checked)       { showError(consent, MSG.consent); valid = false; }

    // Zusatz bei Abholung
    if (modeAbholung?.checked) {
      if (!street?.value?.trim()) { showError(street, MSG.street); valid = false; }
      if (!hnr   ?.value?.trim()) { showError(hnr,   MSG.hnr);    valid = false; }
      if (!city  ?.value?.trim()) { showError(city,  MSG.city);   valid = false; }

      const v = (zip?.value || "").trim();
      if (!/^\d{5}$/.test(v)) {
        showError(zip, MSG.zipReq); valid = false;
      } else {
        const near = v.slice(0, 2) === OFFICE_PREFIX;
        setZipHint(near ? MSG.zipOK : MSG.zipOUT, near ? "ok" : "warn");
      }
    }

    if (!valid) {
      console.warn("[submit] nicht gültig – Abbruch");
      return;
    }

    // Daten für Bestätigung
    const payload = {
      mode: modeAbholung?.checked ? "abholung" : "uebergabe",
      clothes: (clothes?.value || "").trim(),
      region:  (region ?.value || "").trim(),
      address: modeAbholung?.checked ? {
        street: (street?.value || "").trim(),
        hnr:    (hnr   ?.value || "").trim(),
        zip:    (zip   ?.value || "").trim(),
        city:   (city  ?.value || "").trim()
      } : null,
      officeZipPreview: (zipHint?.textContent || "").trim(),
      timestamp: new Date().toISOString()
    };

    try {
      sessionStorage.setItem("donationForm", JSON.stringify(payload));
      console.log("[submit] gespeichert:", payload);
    } catch (e) {
      console.error("[submit] sessionStorage fehlgeschlagen:", e);
    }

    // Weiter zur Bestätigungsseite
    location.href = "confirm.html";
  });

  /* ---------- Helfer ---------- */
  function showError(input, msg) {
    if (!input) return;
    input.classList.add("is-invalid");
    const div = document.createElement("div");
    div.className = "invalid-feedback";
    div.textContent = msg;
    (input.parentNode || form).appendChild(div);
  }

  // Hint-Text im reservierten Slot (ohne Layout-Sprung)
  function setZipHint(text, type) {
    if (!zipHint) return;
    zipHint.textContent = text || "";
    zipHint.classList.remove("ok", "warn");
    if (type) zipHint.classList.add(type);
  }
})();
