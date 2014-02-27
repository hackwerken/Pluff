<?php
/*
 * Dit bestand haalt het daadwerkelijk rooster via JSON op en verwerkt het.
 */

// Accepteert array met klassen
function getFile($klassen) {
  global $klas_whitelist, $cache_dir;


}

function getUur($weekNummer, $dagNummer, $uurNummer, $klassen) {
  global $db;

  foreach ($klassen as $klas) {
    // Huidige jaar pakken met het ingevoerde week nummer.
    // Daarna daarbij het dagnummer optellen minus 1 (begint met maandag)
    $begintijd = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');
    $datum = date('Y-m-d', $begintijd);

    $query = $db->query("SELECT * FROM rooster WHERE klas LIKE '%".$klas."%' AND tijdstip_begin LIKE '%".$datum."%' AND uurnr_begin = '".$uurNummer."'");
    $uur = $query->fetch(PDO::FETCH_ASSOC);
  }

  return print_r($uur);
}

function huidigeDag($dagNummer) {
  if (date('N') == $dagNummer) {
    return true;
  }
  return false;
}
