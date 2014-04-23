Pluff — Studentenrooster
========================

Een verbeterde versie van de goede roostersoftware van Fontys ICT.

De code is vrij snel geschreven en kan daardoor grote fouten bevatten. Alvast mijn diepste verontschuldigingen.

Tips / verbeteringen zijn altijd welkom.

**Helpen**? Dat mag altijd! Graag zelfs! Meer dan een warm gevoel, een gezellige crew en een incidenteel biertje in het schoolcafé kunnen we helaas niet bieden. Je levert uiteraard wel een zinnige bijdrage aan het leven van veel FHICT [en binnenkort Fontys] studenten.

Meehelpen kan op verschillende manieren:

- Door mee te helpen met de ontwikkeling. Voor vragen, open een issue of mail naar [info@webduck.nl](mailto:info@webduck.nl).
- Heb je ideeën hoe we Pluff nog beter kunnen maken, maar kan je zelf geen code schrijven? Open een nieuw issue hier op Github, of neem contact op met Jeroen, via [jeroen@laylo.nl](mailto:jeroen@laylo.nl).
- Is er in jouw ogen iets mis, of kan er iets verbeterd worden aan de servertechniek van [Pluff.nl](http://pluff.nl/)? Daarvoor is Jeroen het aanspreekpunt.
- Het design is gemaakt door Bram van der Sommen, van [Mashed](http://www.mashedcreative.nl). Voor feedback of tips hierover kun je een issue openen.

# Installatie
Dit project maakt gebruik van [Grunt](http://gruntjs.com/). Nog nooit Grunt gebruikt? Eens moet de eerste keer zijn :-). Installeer eerst [Node.js](http://nodejs.org/).

Ga via de terminal naar de root van het project. Type hier in `npm install && bower install` om de benodigde tools te installeren (dit is eenmalig). Type hierna `grunt`.

Grunt gaat nu Vagrant opstarten, die een *Virtual Machine* download en voor je configureert.

In de tussentijd kun je aan je *hosts* file al het volgende toevoegen:
`10.10.10.10 app.local`.

Als alles goed is gegaan opent Grunt nu de website [app.local](http://app.local) met het studentenrooster erop.

# Cronjob
`/usr/bin/php /var/www/artisan db:seed >> /var/www/app/storage/logs/cron.log`

# Servertechniek

De eerste tijd is er gebruik gemaakt van Apache, in combinatie met PHP en MySQL. Dat leverde helaas een tegenvallende performance. Nu wordt er gebruik gemaakt van nginx, PHP-FPM en MySQL, dat een behoorlijke performance boost gaf boven de oude configuratie. Wellicht iets om mee te nemen als je zelf Pluff zou willen hosten/mirroren.

# Credits
Voor het rooster systeem maken we gebruik van de volgende projecten:

- [Laravel](http://laravel.com/) - PHP framework
- [Vagrant](http://www.vagrantup.com/) - Virtual Machine management
- [Grunt](http://gruntjs.com/) - JS task runner
- [Bower](http://bower.io/) - Front-end package management
- [jQuery](http://jquery.com/) - JS framework (*duh*)
- [Foundation](http://foundation.zurb.com/) - CSS framework
- [SASS](http://sass-lang.com/) - *CSS with superpowers*
