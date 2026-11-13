# Intervalle

Intervall-Timer mit Musik, als App für Handy und Computer.

**App öffnen:** https://leonyx23.github.io/Intervalle/

## Was die App kann

- **Takt:** Vorlauf, Aktiv, Pause und Runden einstellen
- **Musik:** ZIP-Dateien mit Songs öffnen (werden direkt auf dem Gerät entpackt) oder einzelne Songs hinzufügen
- **Playlist:** Titel antippen, entfernen, zufällige Reihenfolge
- **Musik in der Pause:** Lautstärke per Schieberegler von 0 bis 100 % (gilt auch im Vorlauf)
- **Signal:** fünf Töne (Glocke, Piep, Pfiff, Gong, Holz) mit „Probe hören“
- **Ansage:** „Los“ und „Stopp“ beim Wechsel, abschaltbar
- **Countdown-Ticken:** 3 oder 5 Sekunden vor jedem Wechsel
- **Offline:** läuft nach dem ersten Öffnen auch ohne Internet
- **Speichern:** Musik und Einstellungen bleiben auf dem Gerät, nichts wird hochgeladen

## Als App installieren

**iPhone / iPad:** Link in Safari öffnen → unten auf **Teilen** tippen → **Zum Home-Bildschirm**.

**Android:** Link in Chrome öffnen → **App installieren** (oder Menü ⋮ → **Zum Startbildschirm hinzufügen**).

**Computer (Chrome/Edge):** Link öffnen → Installieren-Symbol in der Adressleiste.

## Tipps

- Lass den Bildschirm an, sonst hält das Gerät Timer und Musik an.
- MP3 und M4A laufen auf dem iPhone am zuverlässigsten.
- ZIP-Dateien mit Passwort werden nicht unterstützt.

## Technik

Eine einzelne Seite (`index.html`) ohne Build-Schritt, mit `manifest.webmanifest` und Service Worker (`sw.js`) für den App- und Offline-Betrieb. ZIP-Dateien entpackt [zip.js](https://github.com/gildas-lormeau/zip.js) (BSD-3-Clause, siehe `lib/LICENSE-zip.js.txt`). Musik wird in IndexedDB gespeichert, Einstellungen in localStorage.

Nach Änderungen an den Dateien in `sw.js` die `VERSION` erhöhen, damit installierte Apps das Update laden.
