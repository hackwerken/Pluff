<?php
require 'inc/config.php';

$startTime = microtime(TRUE);

// Check of $string wel een geldige JSON array is en of er uberhaupt wel iets in de $string staat
function is_json($string) {
  return !empty($string) && is_string($string) && is_array(json_decode($string, true)) && json_last_error() == 0;
}

// Haal het bestand van een klas op
function setLessen($lessen) {
  global $db, $cTijden;

  foreach ($lessen as $les) {
    // Begin en eind tijden converteren naar een DATETIME
    $tijdstipBeginUnix = strtotime($les['dat'].' '.$les['start']);
    $tijdstipEindUnix = strtotime($les['dat'].' '.$les['eind']);

    $tijdstipBegin = date('Y-m-d H:i:s', $tijdstipBeginUnix);
    $tijdstipEind = date('Y-m-d H:i:s', $tijdstipEindUnix);

    // Juiste begin en eind uren verkrijgen (precieze tijden staan in array $cTijden)
    $uurnrBegin = array_search($les['start'], $cTijden);
    // 3000 = 50 minuten. TODO: Checken welke afrondmethode te gebruiken; round() of floor()
    $uurnrEind = round(($tijdstipEindUnix - $tijdstipBeginUnix) / 3000) + $uurnrBegin;

    $lesVak = strtolower($les['vak']);
    $lesKlas = strtolower($les['klas']);
    $lesLokaal = $les['lok'];
    $lesDocent = $les['doc'];

    // Check of uurnr_begin, uurnr_eind en klas (klas met een LIKE) al bestaan
    $db->exec("INSERT INTO rooster(tijdstip_begin, tijdstip_eind, uurnr_begin, uurnr_eind, vak, klas, lokaal, docent)
      VALUES(
        '".$tijdstipBegin."',
        '".$tijdstipEind."',
        '".$uurnrBegin."',
        '".$uurnrEind."',
        '".$lesVak."',
        '".$lesKlas."',
        '".$lesLokaal."',
        '".$lesDocent."'
      )");
  }
}

function getFile($klas) {
  // Haal JSON op van Fontys website en sla in de $json variabele op
  $ch = curl_init('http://iplanner.fontys.nl/RoosterHandler.ashx?soort=JSON&instituut=1&klas='.urlencode($klas));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  // Zet de response in een variabele
  $response = curl_exec($ch);

  // Pas als geverifieerd is dat de response JSON is, het bestand wegschrijven.
  // Dit om te voorkomen dat er hele HTML pagina's met foutmeldingen worden gedownload.
  if (is_json($response) === true) {
    $lessen = json_decode($response, true);
    // Geef alle lessen in een array door aan de setLessen() functie
    setLessen($lessen);
  }
  else {
    // Bestand is geen JSON. Deze gebeurtenis loggen we.
    echo "Klas ".urldecode($klas)." gaf geen geldige JSON terug.<br>";
  }
}

// JSON ophalen waarin alle klassen staan die gedownload moeten worden.
$klas_whitelist_bestand = file_get_contents(__DIR__.'/klaswhitelist.json');
$klas_whitelist = json_decode($klas_whitelist_bestand, true);

foreach ($klas_whitelist as $klas) {
  getFile($klas);
}

// getFile('m32');


$endTime = microtime(TRUE);

echo ($endTime - $startTime).' seconden.';
