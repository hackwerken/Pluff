<?php
/*
 * Dit bestand haalt het daadwerkelijk rooster via JSON op en verwerkt het.
 */

$klas_whitelist_bestand = file_get_contents('klaswhitelist.json');
$klas_whitelist = json_decode($klas_whitelist_bestand, true);

// Accepteert array met klassen
function getFile($klas) {
  global $klas_whitelist;

  // Controleer of de ingevoerde klas(sen) in de toegestane lijst zitten, indien niet het geval helemaal niks doen.
  // Dit zit er in om zowel een 'DDoS' aan Fontys kant te voorkomen, maar ook aan onze kant.
  if (array_diff($klas, $klas_whitelist)) {
    return array();
    exit;
  }

  // Array weer samenvoegen met extra tekst ertussen. (array) voorkomt een foutmelding als er maar 1 klas is opgegeven.
  $url = '&klas='.implode('&klas=', (array)$klas);

  // Cache bestanden worden in de 'cache/' folder gemaakt en met md5 gehashed
  $cacheFile = 'cache' . DIRECTORY_SEPARATOR . md5($url);

  if (strlen($url) > 35)
    print('Te lang.');

  if (file_exists($cacheFile)) {
    $fh = fopen($cacheFile, 'r');
    $cacheTime = trim(fgets($fh));

    // Als de data minder dan 60 min geleden is gecached, de gecachte data returnen
    if ($cacheTime > strtotime('-60 minutes')) {
      $cachedFile = fread($fh, filesize($cacheFile));
      return json_decode($cachedFile, true);
    }

    // Verwijder het gecachte bestand indien > 60 min oud
    fclose($fh);
    unlink($cacheFile);
  }

  // Haal JSON op van Fontys website en sla in de $json variabele op
  $ch = curl_init('http://pinega.fontys.nl/roosterfeed/RoosterAsJSON.ashx?instituut=1&'.$url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  // Zet content in variabele
  $json = curl_exec($ch);

  // Tijd wegschrijven
  $fh = fopen($cacheFile, 'w');
  fwrite($fh, time() . "\n");
  fwrite($fh, $json);
  fclose($fh);

  return json_decode($json, true);

  curl_close($ch);
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