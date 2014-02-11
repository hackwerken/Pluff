<?php
function getFile($url) {
  // // cache files are created like cache/abcdef123456...
  // $cacheFile = 'cache' . DIRECTORY_SEPARATOR . md5($url);

  // if (file_exists($cacheFile)) {
  //     $fh = fopen($cacheFile, 'r');
  //     $cacheTime = trim(fgets($fh));

  //     // if data was cached recently, return cached data
  //     if ($cacheTime > strtotime('-60 minutes')) {
  //       return fread($fh);
  //     }

  //     // else delete cache file
  //     fclose($fh);
  //     unlink($cacheFile);
  // }

  $cal = new CalFileParser();
  $json = $cal->parse('http://pinega.fontys.nl/studenten/ical.aspx?instituut=1&'.$url);

  // $fh = fopen($cacheFile, 'w');
  // fwrite($fh, time() . "\n");
  // fwrite($fh, $json);
  // fclose($fh);

  return $json;
}

function getDag($weekNummer, $dagNummer, $klas) {
  $remote = getFile('&klas='.$klas);

  $huidigeTijd = date('H:i');

  foreach ($remote as $event) {
    $starttijd = strtotime($event['dtstart;tzid=europe/amsterdam']); // Starttijd geconverteerd naar UNIX timestamp
    $eindtijd  = strtotime($event['dtend;tzid=europe/amsterdam']); // Eindtijd geconverteerd naar UNIX timestamp
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
      echo $event['summary']."<br/>";
      echo "<small>".$event['description']."</small><br/>";
      echo "<hr/>";
      if (date('z', $starttijd) === date('z', time()) && $huidigeTijd > $starttijdHuman && $huidigeTijd < $eindtijdHuman) {
        echo '</span>';
      }
    }
  }
}