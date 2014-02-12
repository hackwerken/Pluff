<?php
/*
 * Dit bestand haalt het daadwerkelijk rooster via JSON op en verwerkt het.
 */

$cache_dir = 'klassen/';

// Accepteert array met klassen
function getFile($klassen) {
  global $klas_whitelist, $cache_dir;

  $json_klassen = array();

  foreach ($klassen as $klas) {
    // Pad naar bestand
    $json_file_name = $cache_dir.$klas.'.json';

    if (file_exists($json_file_name)) {
      $json_file = fopen($json_file_name, 'r');

      $json_read = fread($json_file, filesize($json_file_name));
      $json_array = json_decode($json_read, true);
      $json_klassen = array_merge($json_klassen, $json_array);
      fclose($json_file);
    }
  }

  return $json_klassen;
}

function getDag($weekNummer, $dagNummer, $klas) {
  $remote = getFile($klas);

  // Dag is gevonden
  if ($remote) {
    $huidigeTijd = date('H:i');

    foreach ($remote as $event) {
      $starttijd = strtotime($event['dat'].' '.$event['start']); // Starttijd geconverteerd naar UNIX timestamp
      $eindtijd  = strtotime($event['dat'].' '.$event['eind']); // Eindtijd geconverteerd naar UNIX timestamp
      $starttijdHuman = date('H:i', $starttijd);
      $eindtijdHuman  = date('H:i', $eindtijd);

      // Alleen de huidige week weergeven
      if (date('W', $starttijd) === $weekNummer AND date('N', $starttijd) == $dagNummer) {
        // Controleer of de les nu bezig is door het dagnummer te vergelijken en de tijd
        if (date('z', $starttijd) === date('z', time()) && $huidigeTijd > $starttijdHuman && $huidigeTijd < $eindtijdHuman) {
          echo '<span style="color:red">';
        }
        echo "<b>".$starttijdHuman." - ";
        echo $eindtijdHuman."</b><br/>";
        echo $event['vak']." - ".$event['doc']."<br/>";
        echo "<small>".$event['lok']." - ".$event['klas']."</small><br/>";
        echo "<hr/>";
        if (date('z', $starttijd) === date('z', time()) && $huidigeTijd > $starttijdHuman && $huidigeTijd < $eindtijdHuman) {
          echo '</span>';
        }
      }
    }
  }
  else {
    echo 'Leeg.';
  }
}