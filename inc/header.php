<?php

if (!empty($_GET['klas']) && preg_match('/^[A-Za-z0-9;]+$/i', $_GET['klas'])) {
  // Indien meerdere klassen er een array van maken
  $klasOrig = $_GET['klas'];
  $klasArray = explode(';', $_GET['klas']);
  $klasHuman = implode(', ', (array)$klasArray);
  // Array weer samenvoegen met extra tekst ertussen. (array) voorkomt een foutmelding als er maar 1 klas is opgegeven.
  $klasArray = implode('&klas=', (array)$klasArray);
  $klas = $klasArray;
}

// Standaard week
if (date('N') == 5 && date('H') > 18 OR date('N') == 6 OR date('N') == 7) {
  $weeknr = date('W') + 1;
}
else {
  $weeknr = date('W');
}

if (!empty($_GET['week']) && is_numeric($_GET['week'])) {
  $weeknr = $_GET['week'];
}

$weeknr = sprintf("%02s", $weeknr);

// Vorige en volgende weeknr's :)
$weeknr_vorige = sprintf("%02s", $weeknr - 1);
$weeknr_volgende = sprintf("%02s", $weeknr + 1);
if ($weeknr_volgende == 53)
  $weeknr_volgende = '01';
if ($weeknr_vorige == 00)
  $weeknr_vorige = 52;
$weeknr_huidig = sprintf("%02s", date('W'));