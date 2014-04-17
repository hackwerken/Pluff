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
      $lesLokaal = $les['lok'];
      $lesDocent = $les['doc'];

      // Klassen worden met een spatie + forward slash + spatie gescheiden.
      // We willen dit wat netter maken door hiervan een puntkomma te maken en spaties te verwijderen.
      $lesKlas = strtolower($les['klas']);
      $lesKlas = explode('/', $lesKlas);
      // Verwijder trailing en leading whitespaces
      $lesKlas = array_map('trim', $lesKlas);
      $lesKlas = implode(';', $lesKlas);

      // We gaan nu elk uur wat tussen het 'beginuur' en het 'einduur' zit doorloopen.
      // Voor elk uur hiertussen wordt een aparte rij in de db aangemaakt.
      // TODO: Efficiënter?
      for ($uurnrBeginFor = $uurnrBegin; $uurnrBeginFor < $uurnrEind; $uurnrBeginFor++) {
          $lesInput = array(
            'tijdstip_begin' => $tijdstipBegin,
            'tijdstip_eind' => $tijdstipEind,
            'uurnr_begin' => $uurnrBeginFor,
            'uurnr_eind' => $uurnrEind,
            'vak' => $lesVak,
            'klas' => $lesKlas,
            'lokaal' => $lesLokaal,
            'docent' => $lesDocent
          );

          Rooster::create($lesInput);

          // $lesQuery = Rooster::where('tijdstip_begin', '=', $tijdstipBegin)
          //   ->where('uurnr_begin', '=', $uurnrBeginFor)
          //   ->where('klas', '=', $lesKlas);
          // $lesZoeken = $lesQuery->first();

          // if ($lesZoeken === null)
          //   Rooster::create($lesInput);
          // else
          //   $lesQuery->update($lesInput);

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
    $ch = curl_init(Config::get('rooster.fetchUrl').urlencode($klas));
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

  /**
   * Verwijder alle lesuren die al een paar weken oud zijn
   * en ook alle lesuren van vandaag en in de toekomende tijd.
   *
   * @param string $tijdOud een geldig Engels datumformaat
   * @return void
   */
  public static function deleteOud($tijdOud = '-3 weeks') {
    // Converteer de datum die is opgegeven naar een DATETIME compitabel formaat
    $datumOud = date('Y-m-d H:i:s', strtotime($tijdOud));

    // Verwijder elke rij die ouder (= kleiner) is dan de ingevoerde datum
    Rooster::where('tijdstip_begin', '<', $datumOud)->delete();
    Rooster::where('tijdstip_begin', '>', date('Y-m-d H:i:s', strtotime('Today')))->delete();
  }
}
