<?php
// Check of dit bestand wordt aangeroepen via command line interface
// define("IS_CLI_CALL", true);

// Als dat zo is, voer dan de code uit
if (IS_CLI_CALL) {
  $script_dir = dirname(__FILE__);
  $cache_dir = $script_dir.'/klassen/';
  $log_file = $cache_dir.'fouten.log';

  $countErrors = 0;

  // Log file aan het begin van de cronjob een nieuw kopje geven
  $log = fopen($log_file, 'a');
  fwrite($log, "\n\n"."-- CRONjob van ".date("Y-m-d H:i:s")."\n");

  // Check of $string wel een geldige JSON array is en of er uberhaupt wel iets in de $string staat
  function is_json($string) {
    return !empty($string) && is_string($string) && is_array(json_decode($string, true)) && json_last_error() == 0;
  }

  // Haal het bestand van een klas op
  function getFile($klas) {
    global $cache_dir, $log_file, $log, $countErrors;

    // Haal JSON op van Fontys website en sla in de $json variabele op
    $ch = curl_init('http://pinega.fontys.nl/roosterfeed/RoosterAsJSON.ashx?instituut=1&klas='.urlencode($klas));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Zet de response in een variabele
    $response = curl_exec($ch);

    // Pas als geverifieerd is dat de response JSON is, het bestand wegschrijven.
    // Dit om te voorkomen dat er hele HTML pagina's met foutmeldingen worden gedownload.
    if (is_json($response) === true) {
      $json = $response;
      // Bestand wegschrijven
      $fh = fopen($cache_dir.$klas.'.json', 'w');
      fwrite($fh, $json);
      curl_close($ch);
    }
    else {
      // Bestand is geen JSON. Deze gebeurtenis loggen we.
      fwrite($log, "Klas ".urldecode($klas)." gaf geen geldige JSON terug.\n");

      // Error tellen
      $countErrors++;
    }

  }

  // Helemaal geen fouten tegengekomen
  if ($countErrors === 0) {
    fwrite($log, "Alle JSON succesvol opgeslagen.\n");
  }

  // JSON ophalen waarin alle klassen staan die gedownload moeten worden.
  $klas_whitelist_bestand = file_get_contents(__DIR__.'/klaswhitelist.json');
  $klas_whitelist = json_decode($klas_whitelist_bestand, true);

  foreach ($klas_whitelist as $klas) {
    getFile($klas);
  }

  // Log bestand sluiten
  fclose($log);
}

// Geef een foutmelding als het bestand niet via CLI opgeroepen is
else {
  echo 'Toegang geweigerd.';
}
