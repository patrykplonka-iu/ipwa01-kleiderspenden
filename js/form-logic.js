/* =========================================
   Datei: form-logic.js
   Autor: Patryk Płonka
   Projekt: IPWA01-01 – Kleiderspenden
   Version: v1.7 – Validierung + Nähe-Check
   ========================================= */

(() => {
  const form = document.getElementById("donationForm");
  if (!form) return; // Seite ohne Formular

  // Geschäftsstellen-PLZ (Demo) – anpassen, wenn nötig
  const OFFICE_ZIP = "15236";
  const OFFICE_PREFIX = OFFICE_ZIP.slice(0, 2);

  // Elemente
  const modeUebergabe = document.getElementById("mode_uebergabe");
  const modeAbholung  = document.getElementById("mode_abholung");
  const addressBlock  = document.getElementById("addressBlock");

  const clothes = document.getElementById("clothes");
  const region  = document.getElementById("region");
  const zip     = document.getElementById("zip");
  const consent = document.getElementById("consent");

  // Initial: Adressblock je nach Auswahl anzeigen/verstecken
  const toggleAddressBlock = () => {
    addressBlock.classList.toggle("d-none", !modeAbholung.checked);
    // Nähe-Hinweis zurücksetzen, wenn Übergabe gewählt
    if (!modeAbholung.checked) clearZipProximityHint();
  };
  modeUebergabe.addEventListener("change", toggleAddressBlock);
  modeAbholung.addEventListener("change", toggleAddressBlock);
  toggleAddressBlock(); // Initialzustand

  // Live: PLZ-Änderungen auswerten (nur bei Abholung)
  zip?.addEventListener("input", () => {
    if (!modeAbholung.checked) return clearZipProximityHint();
    const v = zip.value.trim();
    if (/^\d{5}$/.test(v)) {
      setZipProximityHint(isNear(v));
    } else {
      clearZipProximityHint();
    }
  });

  // Formularvalidierung + Nähe-Check (Hinweis)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Vorherige Fehler/Hinweise entfernen
    form.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

    // Pflichtfelder
    if (clothes.value.trim() === "") {
      showError(clothes, "Bitte die Art der Kleidung angeben.");
      valid = false;
    }
    if (region.value === "") {
      showError(region, "Bitte ein Krisengebiet auswählen.");
      valid = false;
    }
    if (!consent.checked) {
      showError(consent, "Bitte Zustimmung erteilen.");
      valid = false;
    }

    // Zusatz bei Abholung: Adresse + PLZ
    if (modeAbholung.checked) {
      const street = document.getElementById("street");
      const hnr    = document.getElementById("hnr");
      const city   = document.getElementById("city");

      if (street.value.trim() === "") { showError(street, "Bitte Straße angeben."); valid = false; }
      if (hnr.value.trim()    === "") { showError(hnr,   "Bitte Hausnummer angeben."); valid = false; }
      if (city.value.trim()   === "") { showError(city,  "Bitte Ort angeben."); valid = false; }

      if (zip.value.trim() === "" || !/^\d{5}$/.test(zip.value)) {
        showError(zip, "Bitte eine gültige PLZ (5 Ziffern) angeben.");
        valid = false;
      } else {
        // Nähe-Hinweis setzen (blockiert nicht)
        setZipProximityHint(isNear(zip.value.trim()));
      }
    }

    if (valid) {
      console.log("✅ Formular validiert");
      alert("Erfolgreich gespeichert!");    }
  });

  /* ---------- Hilfsfunktionen ---------- */

  function showError(input, msg) {
    input.classList.add("is-invalid");
    const div = document.createElement("div");
    div.className = "invalid-feedback";
    div.textContent = msg;
    input.parentNode.appendChild(div);
  }

  function isNear(zipStr) {
    return zipStr.slice(0, 2) === OFFICE_PREFIX; // Vergleich erste 2 Ziffern
  }

  // Hinweis unter dem PLZ-Feld anzeigen (grün/gelb)
  function setZipProximityHint(near) {
    clearZipProximityHint();
    const hint = document.createElement("div");
    hint.className = "form-text mt-1 " + (near ? "text-success" : "text-warning");
    hint.id = "zipProximityHint";
    hint.textContent = near
      ? "Ihre PLZ liegt im Abholgebiet der Geschäftsstelle."
      : "Hinweis: Ihre PLZ liegt außerhalb des Abholgebiets. Übergabe an die Geschäftsstelle empfohlen.";
    zip.parentNode.appendChild(hint);
  }

  function clearZipProximityHint() {
    const old = document.getElementById("zipProximityHint");
    if (old) old.remove();
  }
})();
