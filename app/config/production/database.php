<?php

return array(
  'connections' => array(
    'pgsql' => array(
      'driver'   => 'pgsql',
      'host'     => 'localhost',
      'database' => 'pluff',
      'username' => 'pluff',
      'password' => getenv('DB_PASSWORD'),
      'charset'  => 'utf8',
      'prefix'   => '',
      'schema'   => 'public',
    )
  )
);
