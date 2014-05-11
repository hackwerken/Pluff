<?php

return array(
  'connections' => array(
    'pgsql' => array(
      'driver'   => 'pgsql',
      'host'     => getenv('DB_HOST'),
      'database' => getenv('DB_NAME'),
      'username' => getenv('DB_USER'),
      'password' => getenv('DB_PASSWORD'),
      'charset'  => 'utf8',
      'prefix'   => '',
      'schema'   => 'public',
    )
  )
);
