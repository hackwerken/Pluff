cd /var/www
chmod -R 777 app/storage # Niet zeker of dit nodig is
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
