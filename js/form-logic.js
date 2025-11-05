// Einfaches Formular-Handling für die Kleiderspenden-Registrierung

(() => {
  const OFFICE_ZIP = "12345"; 
  const form = document.getElementById("donationForm");
  const addressBlock = document.getElementById("addressBlock");

  const modeUebergabe = document.getElementById("mode_uebergabe");
  const modeAbholung  = document.getElementById("mode_abholung");

  const clothes = document.getElementById("clothes");
  const region  = document.getElementById("region");
  const street  = document.getElementById("street");
  const hnr     = document.getElementById("hnr");
  const zip     = document.getElementById("zip");
  const city    = document.getElementById("city");
  const consent = document.getElementById("consent");

  // Anzeige/Verbergen des Adressblocks
  function updateAddressVisibility() {
    if (modeAbholung.checked) {
      addressBlock.classList.remove("d-none");
      // Adressfelder als required markieren
      street.required = true;
      hnr.required = true;
      zip.required = true;
      city.required = true;
    } else {
      addressBlock.classList.add("d-none");
      street.required = false;
      hnr.required = false;
      zip.required = false;
      city.required = false;
    }
  }

  modeUebergabe.addEventListener("change", updateAddressVisibility);
  modeAbholung.addEventListener("change", updateAddressVisibility);
  updateAddressVisibility();

  // Validierung der PLZ (einfach)
  function isValidZip(value) {
    return /^\d{5}$/.test(value);
  }

  // 3) Submit
  form.addEventListener("submit", (e) => {
    // kontrolle
    if (!clothes.value.trim()) {
      e.preventDefault();
      alert("Bitte geben Sie die Art der Kleidung an.");
      clothes.focus();
      return;
    }
    if (!region.value) {
      e.preventDefault();
      alert("Bitte wählen Sie ein Krisengebiet.");
      region.focus();
      return;
    }
    if (!consent.checked) {
      e.preventDefault();
      alert("Bitte stimmen Sie den Bedingungen zu.");
      consent.focus();
      return;
    }

    if (modeAbholung.checked) {
      if (!street.value.trim() || !hnr.value.trim() || !zip.value.trim() || !city.value.trim()) {
        e.preventDefault();
        alert("Bitte füllen Sie die Adressfelder aus.");
        return;
      }
      if (!isValidZip(zip.value.trim())) {
        e.preventDefault();
        alert("Bitte geben Sie eine gültige PLZ (5 Ziffern) ein.");
        zip.focus();
        return;
      }
    }

    // Datenübertragung
    const payload = {
      mode: modeAbholung.checked ? "abholung" : "uebergabe",
      clothes: clothes.value.trim(),
      region: region.value,
      address: modeAbholung.checked ? {
        street: street.value.trim(),
        hnr: hnr.value.trim(),
        zip: zip.value.trim(),
        city: city.value.trim()
      } : null,
      timestamp: new Date().toISOString(),
      officeZipPreview: OFFICE_ZIP // später Nähe-Check
    };

    sessionStorage.setItem("donationForm", JSON.stringify(payload));
    // Umleitung
    window.location.href = "confirm.html";
  });
})();
