Pluff — Studentenrooster
========================

[Pluff](https://pluff.nl) is een open-source roostersysteem, gemaakt door Fontys ICT studenten. Het is onze visie, hoe het eigenlijk zou moeten. Het systeem dat door Fontys ICT zelf aangeboden wordt, is in onze ogen verouderd, wij vinden het eruit zien en werken alsof het in de jaren '80 is gemaakt door een stelletje communisten. Kom op. Framesets, Comic Sans en zelfs GIF-jes met glitters. No joke.

Pluff is retesnel, overzichtelijk en werkt op al je favoriete apparaten. Zelfs op je **slimme koelkast**. Het past zich automatisch aan de schermgrootte aan, waardoor je in één oogopslag de planning kunt zien, alsmede de docent en het lokaal waar je moet zijn. Ook biedt Pluff een 'cheatsheet' en een overzicht van de aankomende vakanties. Mét een handige teller, zodat je ook kunt zien hoe lang dat nog duurt.

Uiteraard kan het altijd beter. Wij nemen tips, feedback en verbeteringen dan ook graag mee. Stuur een mailtje naar [Kees](mailto:info@webduck.nl) voor alles omtrent de ontwikkeling en naar [Jeroen](mailto:jeroen@laylo.nl) voor de achterliggende techniek, design of de communicatie. Of nóg beter, maak een issue aan op Github!

# Installatie

Dit project heeft de volgende systeemeisen:

- PHP 5.4+
    + CURL module
- PostgreSQL
- nginx (oké apache kan ook)

Na het clonen van dit project kun je in `app/config/app.php` o.a. de URL veranderen en in `app/config/database.php` de database settings aanpassen. Voer daarna `composer install` uit.

Om het rooster eenmalig binnen te halen kun je het volgende command gebruiken:
```shell
php artisan db:seed
```

# Cronjob

Op de Pluff site hebben we 3 cronjobs draaien die om `07:30`, `12:00` en `17:00` elke dag het rooster verversen. Dit ziet er zo uit:

```shell
30 7    * * *   www-data    /usr/bin/php /var/www/artisan db:seed >> /var/www/app/storage/logs/cron.log
00 12   * * *   www-data    /usr/bin/php /var/www/artisan db:seed >> /var/www/app/storage/logs/cron.log
00 17   * * *   www-data    /usr/bin/php /var/www/artisan db:seed >> /var/www/app/storage/logs/cron.log
```
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
