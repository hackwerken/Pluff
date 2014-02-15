<?php
/*
 * Dit bestand voert wat berekeningen uit over de standaard dagen.
 * En controleert of er al variabelen zijn ingevuld.
 */

$klasOrig = '';

if (!empty($_GET['klas']) && preg_match('/^[A-Za-z0-9;-]+$/i', $_GET['klas'])) {
  // Indien meerdere klassen er een array van maken
  $klasOrig = $_GET['klas'];
  $klasArray = explode(';', $klasOrig);
  $klasHuman = implode(', ', (array)$klasArray);
  $klas = $klasArray;
}

// Standaard week
if (date('N') == 5 && date('H') > 18 OR date('N') == 6 OR date('N') == 7) {
  $weeknr = date('W') + 1;
  $weeknr_huidig = date('W') + 1;
}
else {
  $weeknr = date('W');
  $weeknr_huidig = date('W');
}

if (!empty($_GET['week']) && is_numeric($_GET['week'])) {
  $weeknr = $_GET['week'];
}

// Voeg een 0 toe aan getallen < 10
$weeknr = sprintf("%02s", $weeknr);

// Vorige en volgende weeknr's :)
$weeknr_vorige = $weeknr - 1;
$weeknr_volgende = $weeknr + 1;
if ($weeknr_volgende == 53)
  $weeknr_volgende = '01';
if ($weeknr_vorige == 00)
  $weeknr_vorige = 52;