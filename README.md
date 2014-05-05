Pluff — Studentenrooster
========================

# Inleiding

Pluff is een open-source roostersysteem, gemaakt door Fontys ICT studenten. Het is onze visie, hoe het eigenlijk zou moeten. Het systeem dat door Fontys ICT zelf aangeboden wordt, is in onze ogen verouderd, wij vinden het eruit zien en werken alsof het in de jaren '80 is gemaakt door een stelletje communisten. Kom op. Framesets, Comic Sans en zelfs GIF-jes met glitters. No joke.

Pluff is retesnel, overzichtelijk en werkt op al je favoriete apparaten. Zelfs op je **slimme koelkast**. Het past zich automatisch aan de schermgrootte aan, waardoor je in één oogopslag de planning kunt zien, alsmede de docent en het lokaal waar je moet zijn. Ook biedt Pluff een 'cheatsheet' en een overzicht van de aankomende vakanties. Mét een handige teller, zodat je ook kunt zien hoe lang dat nog duurt.

Uiteraard kan het altijd beter. Wij nemen tips, feedback en verbeteringen dan ook graag mee. Stuur een mailtje naar [Kees](mailto:info@webduck.nl) voor alles omtrent de ontwikkeling en naar [Jeroen](mailto:jeroen@laylo.nl) voor de achterliggende techniek, design of de communicatie. Of nóg beter, maak een issue aan op Github!

# Installatie

Uit ervaring kunnen we nginx 1.4, PHP 5.5, MySQL 5.6 en Memcached aanraden qua servertechniek. Apache is gewoonweg te lomp om Pluff fatsoenlijk (lees: snel) te kunnen serveren. Memcached biedt een betere performance dan 'flat file caching'. Mocht je geen memcached kunnen gebruiken, pas dat dan even aan in app/config/cache.php.

Om Pluff te kunnen installeren heb je [Node.js](http://nodejs.org/) en [Grunt](http://gruntjs.com/) nodig. Voer de volgende commando's uit in de root van het project:

npm install && bower install && grunt && echo 10.10.10.10 app.local >> /etc/hosts

# Cronjob

De volgende regel [voor Cron] kun je instellen om het rooster automatisch van Fontys op te halen. Pas /var/www aan naar de projectroot:

/usr/bin/php /var/www/artisan db:seed >> /var/www/app/storage/logs/cron.log

# Credits

De mensen achter Pluff:

- [Kees](https://www.webduck.nl) - Ontwikkelaar en meesterbrein
- [Jeroen](https://www.laylo.nl) - Serverbeheer en woordvoerder
- [Bram](http://www.mashed-creative.nl) - Ontwerp front-end

Voor het rooster systeem maken we gebruik van de volgende projecten:

- [Laravel](http://laravel.com/) - PHP framework
- [Vagrant](http://www.vagrantup.com/) - Virtual Machine management
- [Grunt](http://gruntjs.com/) - JS task runner
- [Bower](http://bower.io/) - Front-end package management
- [jQuery](http://jquery.com/) - JS framework (*duh*)
- [Foundation](http://foundation.zurb.com/) - CSS framework
- [SASS](http://sass-lang.com/) - *CSS with superpowers*
