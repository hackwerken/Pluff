<?php
/*
 * Dit bestand haalt het daadwerkelijk rooster via JSON op en verwerkt het.
 */

function getUur($weekNummer, $dagNummer, $uurNummer, $klassen) {
  global $db;

  $uur = array();

  foreach ($klassen as $klas) {
    // Huidige jaar pakken met het ingevoerde week nummer.
    // Daarna daarbij het dagnummer optellen minus 1 (begint met maandag)
    $begintijd = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');
    $datum = date('Y-m-d', $begintijd);

    $query = $db->query("SELECT * FROM rooster WHERE klas LIKE '%".$klas."%' AND tijdstip_begin LIKE '%".$datum."%' AND uurnr_begin = '".$uurNummer."'");
    $fetch = $query->fetch(PDO::FETCH_ASSOC);

    // Als er een uur gevonden is, deze in de array zetten (zodat er meerdere lesuren in één uur kunnen zitten)
    if ($fetch)
      $uur[] = $fetch;
  }

  return $uur;
}

function huidigeDag($weekNummer, $dagNummer) {
  // Converteer het ingevoerde weeknummer + dagnummer van de week naar een UNIX timestamp
  $datum = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');
  // Pak dan het dagnummer van het jaar (0 - 365)
  $dagnrvanhetjaar = date('z', $datum);

  // En controleer of het de huidige dag is. Zoja, return true
  if (date('z') == $dagnrvanhetjaar) {
    return true;
  }
  return false;
}
