FHICT-Rooster
=============

Een verbeterde versie van de goede roostersoftware van Fontys ICT.

De code is vrij snel geschreven en kan daardoor grote fouten bevatten. Alvast mijn diepste verontschuldigingen.

Tips / verbeteringen zijn altijd welkom.

**Helpen**? Dat mag altijd! Lees de code vast even door om jezelf wegwijs te maken! Contact via info@webduck.nl

# Installatie
Dit project maakt gebruik van [Grunt](http://gruntjs.com/). Dit zorgt ervoor dat je met één command in de terminal een simpele php server kan draaien, livereload en verkleint CSS en JavaScript automatisch.

Nog nooit Grunt gebruikt? Eens moet de eerste keer zijn :). Installeer eerst [Node.js](http://nodejs.org/).

Ga via de terminal naar de root van het project. Type hier in `npm install && bower install` om de benodigde tools te installeren (dit is eenmalig). Type hierna `grunt`.

Grunt gaat nu Vagrant opstarten, die een *Virtual Machine* download en voor je configureert.

In de tussentijd kun je aan je *hosts* file al het volgende toevoegen:
`10.10.10.10 app.local`.

Als Vagrant is opgestart en Grunt als het goed is de pagina geopend heeft, moet je nog even het volgende invoeren in je terminal (`cd` wel eerst naar de goede folder): `vagrant ssh -c "cd /vagrant; composer install; php artisan migrate --seed"`.

Het command hierboven zorgt ervoor dat Laravel goed werkt en de database gevuld wordt met het actuele rooster. Hierna ben je klaar!

# Cronjob
`/usr/bin/php /vagrant/artisan db:seed >> /vagrant/app/storage/logs/cron.log`

# Credits
Voor het rooster systeem maken we gebruik van de volgende projecten:

- [Laravel](http://laravel.com/) - PHP framework
- [Vagrant](http://www.vagrantup.com/) - Virtual Machine management
- [Grunt](http://gruntjs.com/) - JS task runner
- [Bower](http://bower.io/) - Front-end package management
- [jQuery](http://jquery.com/) - JS framework (*duh*)
- [Foundation](http://foundation.zurb.com/) - CSS framework
- [SASS](http://sass-lang.com/) - *CSS with superpowers*
