# Kleiderspenden Registrierung

**Fallstudie:** IPWA01-01 – Programmierung von Webanwendungsoberflächen  
**Hochschule:** IU Internationale Hochschule  
**Studiengang:** B.Sc. Softwareentwicklung  
**Autor:** Patryk Płonka  

---

## Projektbeschreibung

Diese Webanwendung wurde im Rahmen der Fallstudie entwickelt.  
Ziel ist ein Online-Portal zur Registrierung von Kleiderspenden.  
Spendende Personen können wählen, ob die Spende an der Geschäftsstelle übergeben oder von einem Sammelfahrzeug abgeholt werden soll.  
Außerdem kann ein aktuelles Krisengebiet ausgewählt werden, in das die Spende gesendet werden soll.

---

## Hauptfunktionen

- Responsives Layout (Desktop, Tablet, Smartphone)  
- Formular zur Registrierung von Kleiderspenden  
- Zwei Optionen: Übergabe an der Geschäftsstelle oder Abholung  
- PLZ-Prüfung (erste zwei Ziffern müssen übereinstimmen)  
- Bestätigungsseite mit allen Angaben  
- Sichere Eingabefelder (Schutz vor Code Injection)  
- Strukturierte Benutzeroberfläche mit Header, Navigation und Footer  
- Umsetzung mit **HTML5**, **CSS3 (Bootstrap 5)** und **JavaScript**

---

## Bezug zur Aufgabenstellung

Die Anwendung erfüllt die Anforderungen der Fallstudie:

- Titel und Logo vorhanden  
- Responsives Design  
- Formular mit Validierung  
- Auswahlmöglichkeit zwischen Abholung und Übergabe  
- Bestätigungsseite mit Daten  
- Schutz vor manipulierten Eingaben  

---

## Lizenz

Dieses Projekt wurde ausschließlich zu Studienzwecken im Rahmen der IU Internationale Hochschule erstellt.  
Keine kommerzielle Nutzung vorgesehen.

### Datenfluss (Form → Validation → Storage → Confirmation)

1. **Register (HTML/JS)**: Pflichtfelder + Validierung (Bootstrap-Klassen, eigene Logik).
2. **Nähe-Check**: Live-Hinweis zur PLZ (ersten 2 Ziffern vs. Geschäftsstelle).
3. **Speicherung**: `sessionStorage.setItem("donationForm", JSON.stringify(data))`.
4. **Weiterleitung**: `confirm.html`.
5. **Bestätigung**: `js/confirm.js` liest `donationForm`, normalisiert Schema, rendert Zusammenfassung.
6. **Print**: Druckansicht via Browser (angepasstes Print-CSS).
