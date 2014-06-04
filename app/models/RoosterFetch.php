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
      $tijdstipBegin = new Carbon($les['dat'].' '.$les['start']);
      $tijdstipEind = new Carbon($les['dat'].' '.$les['eind']);

      // Juiste begin en eind uren verkrijgen (precieze tijden staan in array $cTijden)
      $uurnrBegin = explode(':', $les['start']);
      $uurnrBegin = (float) $uurnrBegin[0] + ($uurnrBegin[1] / 60);
      $uurnrBegin = Bereken::getArrayKeyDichtstBij($uurnrBegin, Config::get('rooster.tijden'));
      // 3000 = 50 minuten. TODO: Checken welke afrondmethode te gebruiken; round() of floor()
      $uurnrEind = round(($tijdstipEind->diffInSeconds($tijdstipBegin)) / 3000) + $uurnrBegin;

      $lesVak = strtolower($les['vak']);
      $lesLokaal = Bereken::SpecialeCharsNaarStreepje($les['lok']);
      $lesDocent = Bereken::SpecialeCharsNaarStreepje($les['doc']);

      // Klassen worden met een spatie + forward slash + spatie gescheiden.
      // We willen dit wat netter maken door hiervan een puntkomma te maken en spaties te verwijderen.
      $lesKlas = strtolower($les['klas']);
      $lesKlas = explode('/', $lesKlas);
      // Verwijder trailing en leading whitespaces
      $lesKlas = array_map('trim', $lesKlas);
      $lesKlas = ';'.implode(';', $lesKlas).';';
      $lesKlas = Bereken::SpecialeCharsNaarStreepje($lesKlas);

      // We gaan nu elk uur wat tussen het 'beginuur' en het 'einduur' zit doorloopen.
      // Voor elk uur hiertussen wordt een aparte rij in de db aangemaakt.
      // TODO: Efficiënter?
      for ($uurnrBeginFor = $uurnrBegin; $uurnrBeginFor < $uurnrEind; $uurnrBeginFor++) {
          $lesInput = array(
            'tijdstip_begin' => $tijdstipBegin->toDateTimeString(),
            'tijdstip_eind' => $tijdstipEind->toDateTimeString(),
            'uurnr_begin' => $uurnrBeginFor,
            'uurnr_eind' => $uurnrEind,
            'vak' => $lesVak,
            'klas' => $lesKlas,
            'lokaal' => $lesLokaal,
            'docent' => $lesDocent
          );

          Rooster::create($lesInput);

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
  public static function getFile($klas, $simple = false) {
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
      if ($simple === false)
        RoosterFetch::setLessen($lessen);
      else
        return true;
    }
    else {
      // Bestand is geen JSON. Deze gebeurtenis loggen we.
      if ($simple === false)
        echo "Klas ".urldecode($klas)." gaf geen geldige JSON terug.\n";
      else
        return false;
    }
  }


  /**
   * Verwijder alle lesuren van een klas van vandaag en verder in de toekomst.
   *
   * @param string $klas Een klas die in public/klaswhitelist.json staat
   * @return void
   */
  public static function deleteHuidig($klas) {
    $klas = Bereken::SpecialeCharsNaarStreepje($klas);
    $vandaag = Carbon::today()->toDateTimeString();

    Rooster::klasLike($klas)->where('tijdstip_begin', '>', $vandaag)->delete();
  }

  /**
   * Verwijder alle lesuren die al een paar weken oud zijn.
   * Haalt ook eventueel verdwenen klassen uit de database.
   *
   * @param int $tijdOud Aantal weken
   * @return void
   */
  public static function deleteOud($tijdOud = 3) {
    $oud = Carbon::today()->subWeeks($tijdOud)->toDateTimeString();

    // Verwijder elke rij die ouder (= kleiner) is dan de ingevoerde datum
    Rooster::where('tijdstip_begin', '<', $oud)->delete();
  }
}
