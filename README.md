FHICT-Rooster
=============

Een verbeterde versie van de goede roostersoftware van Fontys ICT.

De code is vrij snel geschreven en kan daardoor grote fouten bevatten. Alvast mijn diepste verontschuldigingen.

Tips / verbeteringen zijn altijd welkom.

**Helpen**? Dat mag altijd! Lees de code vast even door om jezelf wegwijs te maken! Contact via info@webduck.nl

# Installatie
Om het roostersysteem op je eigen server te laten werken heb je PHP 5.4+ met CURL ondersteuning nodig. Rechten om CRON taken toe te kunnen voegen & uitvoeren is nodig om het rooster up-to-date te houden. Tenzij je graag elke één/twee uur met de hand een PHP script uitvoert via de CLI.

Dit project maakt gebruik van [Grunt](http://gruntjs.com/). Dit zorgt ervoor dat je met één command in de terminal een simpele php server kan draaien, livereload en verkleint CSS en JavaScript automatisch.

Nog nooit Grunt gebruikt? Eens moet de eerste keer zijn :). Installeer eerst [Node.js](http://nodejs.org/).

Ga via de terminal naar de root van het project. Type hier in `npm install && bower install` om de benodigde tools te installeren (is eenmalig). Type hierna `grunt`. Als het goed is opent de browser nu de website en kun je er aan werken.

## Tijdelijk
0. zet in je /etc/hosts het volgende: '10.10.10.10   app.local'
1. Type in de folder 'grunt'. Dit duurt vrij lang, hij maakt nu een VM aan.
2. Als 'ie klaar is, open een nieuwe tab en doe 'vagrant ssh'.
3. `cd /vagrant; composer install; php artisan migrate --seed`

Maak verder een folder genaamd `klassen` aan in de root van het project en chmod die naar `777`.
