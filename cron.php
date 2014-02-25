<?php
error_reporting(E_ALL);
// Check of dit bestand wordt aangeroepen via command line interface
define("IS_CLI_CALL", true);

// Als dat zo is, voer dan de code uit
if (IS_CLI_CALL) {
  $db = new PDO('mysql:host=localhost;dbname=rooster;charset=utf8', 'root', 'password', array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

  $tijden = [
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

  // Check of $string wel een geldige JSON array is en of er uberhaupt wel iets in de $string staat
  function is_json($string) {
    return !empty($string) && is_string($string) && is_array(json_decode($string, true)) && json_last_error() == 0;
  }

  // Haal het bestand van een klas op
  function getFile($klas) {
    global $db, $tijden;

    // Haal JSON op van Fontys website en sla in de $json variabele op
    $ch = curl_init('http://pinega.fontys.nl/roosterfeed/RoosterAsJSON.ashx?instituut=1&klas='.urlencode($klas));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Zet de response in een variabele
    $response = curl_exec($ch);

    // Pas als geverifieerd is dat de response JSON is, het bestand wegschrijven.
    // Dit om te voorkomen dat er hele HTML pagina's met foutmeldingen worden gedownload.
    if (is_json($response) === true) {
      $lessen = json_decode($response, true);

      foreach ($lessen as $les) {
        // Begin en eind tijden converteren naar een DATETIME
        $tijdstipBeginUnix = strtotime($les['dat'].' '.$les['start']);
        $tijdstipEindUnix = strtotime($les['dat'].' '.$les['eind']);

        $tijdstipBegin = date('Y-m-d H:i:s', $tijdstipBeginUnix);
        $tijdstipEind = date('Y-m-d H:i:s', $tijdstipEindUnix);

        // Juiste begin en eind uren verkrijgen (precieze tijden staan in array $tijden)
        $uurnrBegin = array_search($les['start'], $tijden);
        // 3000 = 50 minuten. TODO: round() is niet goede functie hier
        $uurnrEind = round(($tijdstipEindUnix - $tijdstipBeginUnix) / 3000) + $uurnrBegin;

        $lesVak = strtolower($les['vak']);
        $lesKlas = strtolower($les['klas']);
        $lesLokaal = $les['lok'];

        $db->exec("INSERT INTO rooster(tijdstip_begin, tijdstip_eind, uurnr_begin, uurnr_eind, vak, klas, lokaal)
          VALUES(
            '".$tijdstipBegin."',
            '".$tijdstipEind."',
            '".$uurnrBegin."',
            '".$uurnrEind."',
            '".$lesVak."',
            '".$lesKlas."',
            '".$lesLokaal."'
          )");
      }
    }
    else {
      // Bestand is geen JSON. Deze gebeurtenis loggen we.
      echo "Klas ".urldecode($klas)." gaf geen geldige JSON terug.<br>";
    }

  }

  // JSON ophalen waarin alle klassen staan die gedownload moeten worden.
  // $klas_whitelist_bestand = file_get_contents(__DIR__.'/klaswhitelist.json');
  // $klas_whitelist = json_decode($klas_whitelist_bestand, true);

  // foreach ($klas_whitelist as $klas) {
  //   getFile($klas);
  // }

  getFile('m32');
}

// Geef een foutmelding als het bestand niet via CLI opgeroepen is
else {
  echo 'Toegang geweigerd.';
}
