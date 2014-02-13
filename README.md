FHICT-Rooster
=============

Een verbeterde versie van de goede roostersoftware van Fontys ICT.

De code is vrij snel geschreven en kan daardoor grote fouten bevatten. Alvast mijn diepste verontschuldigingen.

Tips / verbeteringen zijn altijd welkom.

**Helpen**? Dat mag altijd! Lees de code vast even door om jezelf wegwijs te maken! Contact via info@webduck.nl

# Installatie
Om het roostersysteem op je eigen server te laten werken heb je 5.4+ met CURL ondersteuning nodig. Rechten om CRON taken toe te kunnen voegen & uitvoeren is nodig om het rooster up-to-date te houden. Tenzij je graag elke één/twee uur met de hand een PHP script uitvoert via de CLI.

Maak verder een folder genaamd `klassen` aan in de root van het project en chmod die naar `777`.

# To-Do

## Hoge prioriteit

- Mooi ontwerp (**!!**)
- Logo (simpel) (**!!**)
- Rooster 'ophaal methode' verbeteren; wordt nu nog per volledige dag opgehaald.
- Optimalisatie voor telefoon: automatisch huidige dag laten zien
- ~~Kijken of ook niet gevonden bestanden gecached kunnen worden (met een leeg JSON bestand), zodat de Fontys server niet overbodig belast wordt (en snellere respons).~~
- 1 uur cache: goed genoeg of langer?
- Push notificaties (*veel werk*); hiervoor moet de code op CRON-jobs geschreven worden en verschillen detecteren.

## Lage prioriteit

- Aparte kleuren per vak; voor meer overzicht
- Offline weergave (d.m.v. localStorage)
- Klassenlijst; hoewel klas intypen ook heel snel is. Misschien suggesties tijdens typen?
- Mogelijkheid tot inzien vorige weken (nu kun je alleen nog vandaag + 3 weken inzien)
- Grunt toevoegen om bestanden automatisch te verkleinen