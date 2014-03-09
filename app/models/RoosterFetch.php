<?php
class RoosterFetch {

  /**
   * Controleer of de input een geldig JSON formaat heeft en of er wel iets in staat.
   *
   * @param string $string JSON
   * @return boolean
   */
  public static function is_json($string) {
    return !empty($string) && is_string($string) && is_array(json_decode($string, true)) && json_last_error() == 0;
  }

  /**
   * Zet alle gevonden lessen van één klas in de database.
   *
   * @param array $lessen
   * @return bool
   */
  public static function setLessen($lessen) {

    foreach ($lessen as $les) {
      // Begin en eind tijden converteren naar een DATETIME
      $tijdstipBeginUnix = strtotime($les['dat'].' '.$les['start']);
      $tijdstipEindUnix = strtotime($les['dat'].' '.$les['eind']);

      $tijdstipBegin = date('Y-m-d H:i:s', $tijdstipBeginUnix);
      $tijdstipEind = date('Y-m-d H:i:s', $tijdstipEindUnix);

      // Juiste begin en eind uren verkrijgen (precieze tijden staan in array $cTijden)
      $uurnrBegin = array_search($les['start'], Config::get('rooster.tijden'));
      // 3000 = 50 minuten. TODO: Checken welke afrondmethode te gebruiken; round() of floor()
      $uurnrEind = round(($tijdstipEindUnix - $tijdstipBeginUnix) / 3000) + $uurnrBegin;

      $lesVak = strtolower($les['vak']);
      $lesKlas = strtolower($les['klas']);
      $lesLokaal = $les['lok'];
      $lesDocent = $les['doc'];

      for ($uurnrBeginFor = $uurnrBegin; $uurnrBeginFor < $uurnrEind; $uurnrBeginFor++) {
        $rooster = new Rooster;

        $rooster->tijdstip_begin = $tijdstipBegin;
        $rooster->tijdstip_eind = $tijdstipEind;
        $rooster->uurnr_begin = $uurnrBeginFor;
        $rooster->uurnr_eind = $uurnrEind;
        $rooster->vak = $lesVak;
        $rooster->klas = $lesKlas;
        $rooster->lokaal = $lesLokaal;
        $rooster->docent = $lesDocent;

        $rooster->save();
      }
    }
  }

  /**
   * Haal de JSON van een klas op en indien geldige JSON,
   * geef de output dan door aan setLessen
   *
   * @param string $klas Een klas die in public/klaswhitelist.json staat
   * @return bool
   */
  public static function getFile($klas) {
    // Haal JSON op van Fontys website en sla in de $json variabele op
    $ch = curl_init('http://iplanner.fontys.nl/RoosterHandler.ashx?soort=JSON&instituut=1&klas='.urlencode($klas));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Zet de response in een variabele
    $response = curl_exec($ch);

    // Pas als geverifieerd is dat de response JSON is, het bestand wegschrijven.
    // Dit om te voorkomen dat er hele HTML pagina's met foutmeldingen worden gedownload.
    if (RoosterFetch::is_json($response) === true) {
      $lessen = json_decode($response, true);
      // Geef alle lessen in een array door aan de setLessen() functie
      RoosterFetch::setLessen($lessen);
    }
    else {
      // Bestand is geen JSON. Deze gebeurtenis loggen we.
      echo "Klas ".urldecode($klas)." gaf geen geldige JSON terug.\n";
    }
  }
}
