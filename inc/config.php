<?php

$cDagen = [
  1 => 'Maandag',
  2 => 'Dinsdag',
  3 => 'Woensdag',
  4 => 'Donderdag',
  5 => 'Vrijdag'
];

$cTijden = [
  1 => '08:45',
  2 => '09:35',
  3 => '10:45',
  4 => '11:35',
  5 => '12:25',
  6 => '13:15',
  7 => '14:05',
  8 => '15:15',
  9 => '16:05',
  10 => '16:55',
  11 => '18:00',
  12 => '18:50',
  13 => '20:00',
  14 => '20:50',
  15 => '21:40'
];

$dbHost   = 'localhost';
$dbName   = 'rooster';
$dbUser   = 'root';
$dbPass   = 'password';

$db = new PDO('mysql:host='.$dbHost.';dbname='.$dbName.';charset=utf8', $dbUser, $dbPass, array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
