# Stretch Trainer

Minimalistischer Stretching-Timer als Web-App (PWA). Schwarz, ohne Schnickschnack:
Routine wählen, Start drücken, Piktogramm + Countdown.

**App:** https://realvibecoderr.github.io/stretch-trainer/

## Ablauf

- 5 s Vorlauf, dann jede Übung 40 s halten
- Glocke am Ende jeder Übung, danach 3 s Wechselzeit mit Vorschau der nächsten Übung
- Pause / Weiter, vor und zurück springen, Bildschirm bleibt an (Wake Lock)

## Aufs Handy

iPhone: Seite in Safari öffnen → Teilen → „Zum Home-Bildschirm“.
Android: Chrome → Menü → „App installieren“.

Hinweis iPhone: Im Lautlos-Modus ist die Glocke stumm. Dafür blitzt der Bildschirm bei jedem Wechsel kurz auf.

## Neue Routine anlegen

In `routines.js` ein weiteres Objekt in `ROUTINES` eintragen (Name, Zeiten, Übungen).
Jede Übung verweist mit `picto` auf eine Figur in `pictograms.js`.
Nach Änderungen in `sw.js` die Cache-Version (`stretch-v1`) hochzählen.
