sudo sed -i '/^;listen.owner/s/listen.owner.*=.*/listen.owner = vagrant/' /etc/php5/fpm/pool.d/www.conf
sudo sed -i '/^;listen.group/s/listen.group.*=.*/listen.group = vagrant/' /etc/php5/fpm/pool.d/www.conf
sudo sed -i '/^user/s/user.*/user vagrant;/' /etc/nginx/nginx.conf
sudo service nginx restart
sudo service php5-fpm restart
