<?php
class Bereken {

  /**
   * Kijk welke klas(sen) er zijn ingevuld, of ze geldig zijn en maak er o.a. een array van.
   *
   * @param string|null $klasInput Puntkomma-gescheiden klassen
   * @return array Bevat alle informatie over de ingevoerde klas
   */
  public static function getKlasInfo($klasInput = null)
  {
    $klasInput = trim($klasInput, ';');

    if (!empty($klasInput) && preg_match('/^[A-Za-z0-9;_\-.]+$/i', $klasInput)) {
      // Indien meerdere klassen er een array van maken
      $klasOutput['orig'] = $klasInput;
      $klasOutput['array'] = explode(';', $klasOutput['orig']);
      $klasOutput['human'] = implode(', ', (array)$klasOutput['array']);

      return $klasOutput;
    }
    else {
      return [
        'orig' => null,
        'array' => null,
        'human' => null
      ];
    }
  }

  /**
   * Kijk of er een weeknummer is ingevuld en voer hier een aantal berekeningen mee uit.
   * Indien geen weeknummer is ingevuld het huidige weeknummer pakken.
   *
   * @param int|null $weekInput Nummer moet tussen 1 - 52 zitten.
   * @return array Bevat de volgende, vorige, huidige en ingevoerd weeknummer
   */
  public static function getWeekInfo($weekInput = null)
  {
    $weekOutput = [];

    $dt = Carbon::now();

    // Standaard week
    if ($dt->dayOfWeek === Carbon::FRIDAY && $dt->hour > 18 OR $dt->isWeekend()) {
      $weekOutput['gebruikt'] = $dt->addWeek()->weekOfYear;
      $weekOutput['huidig'] = $dt->weekOfYear;
    }
    else {
      $weekOutput['gebruikt'] = $dt->weekOfYear;
      $weekOutput['huidig'] = $dt->weekOfYear;
    }

    if (!empty($weekInput) && is_numeric($weekInput)) {
      $weekOutput['gebruikt'] = $weekInput;
    }

    // Voeg een 0 toe aan getallen < 10
    $weekOutput['gebruikt'] = sprintf("%02s", $weekOutput['gebruikt']);

    // Vorige en volgende weeknr's :)
    $weekOutput['vorige'] = $weekOutput['gebruikt'] - 1;
    $weekOutput['volgende'] = $weekOutput['gebruikt'] + 1;
    if ($weekOutput['volgende'] == 53)
      $weekOutput['volgende'] = '01';
    if ($weekOutput['vorige'] == 00)
      $weekOutput['vorige'] = 52;

    return $weekOutput;
  }

  /**
   * Vervang de karakters '&', ' ' en '/' door streepjes.
   *
   * @param string $input
   * @return string Waarin de speciale karakters zijn verplaatst door streepjes
   */
  public static function SpecialeCharsNaarStreepje($input) {
    return str_replace(array('&', ' ', '/'), '-', $input);
  }

  /**
   * Zoek de UNIX timestamp van de input op en controleer of de datum overeenkomt met de huidige datum.
   *
   * @param int $weekNummer Nummer moet tussen 0 - 52 zitten
   * @param int $dagNummer Nummer moet tussen 0 - 365 zitten
   * @return boolean
   */
  public static function getTimestampVanWeeknrDagnr($weekNummer, $dagNummer)
  {
    // Converteer het ingevoerde weeknummer + dagnummer van de week naar een UNIX timestamp
    $datum = new Carbon('2014W'.$weekNummer.' '.($dagNummer - 1).' day');

    return $datum;
  }

  /**
   * Zoek de UNIX timestamp van de input op en controleer of de datum overeenkomt met de huidige datum.
   *
   * @param int $weekNummer Nummer moet tussen 0 - 52 zitten
   * @param int $dagNummer Nummer moet tussen 0 - 365 zitten
   * @return boolean
   */
  public static function getHuidigeDag($weekNummer, $dagNummer)
  {
    $nu = Carbon::now();
    $dt = self::getTimestampVanWeeknrDagnr($weekNummer, $dagNummer);

    // En controleer of het de huidige dag is. Zoja, return true
    if ($nu->dayOfYear === $dt->dayOfYear)
      return true;

    return false;
  }

  /**
   * Verkrijg het huidige dagnr van de werkdag of, in het week-end, dagnr 1.
   *
   * @return integer Zit tussen 1 - 5
   */
  public static function getAankomendeDagnr()
  {
    $dt = Carbon::now();

    if ($dt->dayOfWeek === Carbon::FRIDAY && $dt->hour > 18 OR $dt->isWeekend())
      return 1;

    return $dt->dayOfWeek;
  }

  /**
   * Haal de roostertijden uit de config op, behalve de laatste.
   * In het laatste uur wordt namelijk geen les gegeven.
   *
   * @return array
   */
  public static function getTijdenMin1()
  {
    return array_slice(Config::get('rooster.tijden'), 0, -1, true);
  }

  /**
   * Converteer klassen gescheiden met puntkomma naar een array.
   *
   * @param string $klassen Klassen gescheiden met puntkomma.
   * @return array
   */
  public static function klassenNaarArray($klassen)
  {
    return explode(';', trim($klassen, ';'));
  }


  /**
   * Zet de input in een array en verwerkt deze tot een JSON bestand.
   *
   * @param string $input HTML waarin alle klassen staan. 1 klas per regel.
   * @return bool
   */
  public static function setKlasWhitelist($input)
  {
    // Haal alle <option> tags weg
    $process = strip_tags($input);
    $process = strtolower($process);
    $process = html_entity_decode($process);
    // $process = urlencode($process);
    // We hebben nu alle klassen op een aparte regel staan. Tijd om er een array van te maken!
    $process = explode("\n", $process);
    // Verwijder lege array values
    $process = array_filter($process);
    $process = array_map('trim', $process);

    // Controleer nu of elke klas wel echt bestaat en geldige JSON teruggeeft.
    $processChecked = [];
    foreach ($process as $klas) {
      if (RoosterFetch::getFile($klas, true) === true) {
        $processChecked[] = $klas;
      }
    }
    // Array naar een JSON bestand omzetten
    $process = json_encode($processChecked, JSON_PRETTY_PRINT);

    $save = File::put('klaswhitelist.json', $process);

    if ($save)
      return true;

    return false;
  }

  /**
   * Zet een EU dateformat (bijv. 24-02-1995) om naar een US dateformat (bijv. 1995-02-24)
   *
   * @param string $input Datum in het formaat d-m-Y (dag-maand-jaar)
   * @return string dateformat Y-m-d (jaar-maand-dag)
   */
  public static function EUNaarDateFormat($input) {
    $dt = Carbon::createFromFormat('d-m-Y', $input);

    return $dt->format('Y-m-d');
  }

  /**
   * Zet een US dateformat (bijv. 1995-02-24) om naar een EU dateformat (bijv. 24-02-1995)
   *
   * @param string $input Datum in het formaat Y-m-d (jaar-maand-dag)
   * @return string dateformat d-m-Y (dag-maand-jaar)
   */
  public static function DateFormatNaarEU($input) {
    $dt = Carbon::createFromFormat('Y-m-d', $input);

    return $dt->format('d-m-Y');
  }

  /**
   * Bereken hoeveel dagen er nog zijn voordat de huidige datum bereikt wordt.
   *
   * @param string $start Datum in Y-m-d
   * @return int Aantal dagen
   */
  public static function dagenTeGaan($start) {
    $start = Carbon::createFromFormat('Y-m-d', $start);
    $huidig = Carbon::now();

    $verschil = $start->diffInDays($huidig);

    return $verschil;
  }

  /**
   * Controleer of het opgegeven weeknummer tussen de vakantiedata ligt (staan in de config).
   *
   * @param int $weekNummer Nummer moet tussen 0 - 52 zitten
   * @return bool
   */
  public static function isVakantie($weekNummer) {
    $nu = self::getTimestampVanWeeknrDagnr($weekNummer, 1);

    foreach (Config::get('rooster.vakanties') as $vakantie) {
      $start = new Carbon($vakantie['start']);
      $eind = new Carbon($vakantie['eind']);

      if ($nu->between($start, $eind))
        return true;
    }

    return false;
  }

  /**
   * Zoek de dichtstbijzijnde array value op en geef de key van de gekozen value terug.
   *
   * @param int|float
   * @return mixed
   */
  public static function getArrayKeyDichtstBij($search, $arr) {
     $closest = null;
     $closestKey = null;

     foreach($arr as $key => $item) {
        if($closest == null || abs($search - $closest) > abs($item - $search)) {
           $closest = $item;
           $closestKey = $key;
        }
     }
     return $closestKey;
  }

  /**
   * Converteert een string naar een heximale kleurencode.
   *
   * @param string
   * @return string van 6 heximale tekens
   */
  public static function stringNaarKleurenCode($input) {
    $code = dechex(crc32($input));
    $code = substr($code, 0, 6);
    return $code;
  }
}
