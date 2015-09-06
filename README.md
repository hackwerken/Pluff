Pluff — Studentenrooster
========================

[Pluff](https://pluff.nl) is een open-source roostersysteem, gemaakt door Fontys ICT studenten. Het is onze visie, hoe het eigenlijk zou moeten. Het systeem dat door Fontys ICT zelf aangeboden wordt, is in onze ogen verouderd. We vinden het eruit zien en werken alsof het in de jaren '80 is gemaakt door een stelletje communisten. Kom op. Framesets, Comic Sans en zelfs GIF-jes met glitters. No joke.

Uiteraard kan het altijd beter. Wij zijn geïnteresseerd in je feedback! Aarzel niet om hiervoor een issue aan te maken. Meehelpen is ook zeer welkom.

## Development

Om Pluff lokaal te draaien heb je [node.js](http://nodejs.org/) en _node package manager_ (meestal meegeleverd bij node.js) nodig.

Clone deze repository en kopieer `.env.example` naar `.env`. Type (eenmalig) in je Pluff folder `npm install` om de benodigde dependencies te installeren. Daarna type je simpelweg `npm start` om de ‘server’ te starten. Ga nu naar `http://localhost:8080`, waar je als het goed is meteen een werkende Pluff ziet staan.

Houd je bij het ontwikkelen aan de  [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript). Check of je voldoet aan deze standaard met `npm run lint`. Ook wordt [EditorConfig](http://editorconfig.org/) gebruikt zodat iedereen dezelfde line endings etc. gebruikt. Deze kun je voor vrijwel elke editor installeren.

## Uploaden via FTP

Om Pluff op een website te plaatsen, kopieer je eerst `.env.example` naar `.env`. Vul vervolgens je FTP gegevens hier in en zet `PLUFF_DEBUG` op `false`. Daarna kun je de bestanden bouwen door `npm run build` uit te voeren, en vervolgens uploaden op de FTP server met `npm run deploy`.

Als je de recentste versie van Pluff wilt uploaden zonder handmatig deze repository te hoeven updaten, kun je ook `npm run deploy-auto` uitvoeren.

## Credits

De mensen achter Pluff:

- [Kees Kluskens](https://www.webduck.nl) - Ontwikkelaar en meesterbrein
- Tim van den Biggelaar - Ontwikkelaar
- Stephan van Rooij - API beheerder
- [Jeroen](https://www.laylo.nl) - Serverbeheer
- Jasper Stam - _Programmeer schildknaap_
- Rutger Schimmel - _Bugtester_ & kleurentovenaar

Voor het rooster systeem maken we gebruik van de volgende projecten:

- [Angular](https://angularjs.org/) - JS framework
- [Webpack](https://webpack.github.io/) - Module bundler
- [Sass](http://sass-lang.com/) - *CSS with superpowers*
