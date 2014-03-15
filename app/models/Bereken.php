<?php
class Bereken {

  /**
   * Kijk welke klas(sen) er zijn ingevuld, of ze geldig zijn en maak er o.a. een array van.
   *
   * @param string|null $klasInput Puntkomma-gescheiden klassen
   * @return array Bevat alle informatie over de ingevoerde klas
   */
  public static function getKlasInfo($klasInput = null) {

    if (!empty($klasInput) && preg_match('/^[A-Za-z0-9;-]+$/i', $klasInput)) {
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
  public static function getWeekInfo($weekInput = null) {
    $weekOutput = [];

    // Standaard week
    if (date('N') == 5 && date('H') > 18 OR date('N') == 6 OR date('N') == 7) {
      $weekOutput['gebruikt'] = date('W') + 1;
      $weekOutput['huidig'] = date('W') + 1;
    }
    else {
      $weekOutput['gebruikt'] = date('W');
      $weekOutput['huidig'] = date('W');
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
   * Zoek de UNIX timestamp van de input op en controleer of de datum overeenkomt met de huidige datum.
   *
   * @param int $weekNummer Nummer moet tussen 0 - 52 zitten
   * @param int $dagNummer Nummer moet tussen 0 - 365 zitten
   * @return boolean
   */
  public static function getTimestampVanWeeknrDagnr($weekNummer, $dagNummer) {
    // Converteer het ingevoerde weeknummer + dagnummer van de week naar een UNIX timestamp
    $datum = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');

    return $datum;
  }

  /**
   * Zoek de UNIX timestamp van de input op en controleer of de datum overeenkomt met de huidige datum.
   *
   * @param int $weekNummer Nummer moet tussen 0 - 52 zitten
   * @param int $dagNummer Nummer moet tussen 0 - 365 zitten
   * @return boolean
   */
  public static function getHuidigeDag($weekNummer, $dagNummer) {
    $timestamp = Bereken::getTimestampVanWeeknrDagnr($weekNummer, $dagNummer);

    // En controleer of het de huidige dag is. Zoja, return true
    if (date('z') == date('z', $timestamp))
      return true;

    return false;
  }

  /**
   * Haal de roostertijden uit de config op, behalve de laatste.
   * In het laatste uur wordt namelijk geen les gegeven.
   *
   * @return array
   */
  public static function getTijdenMin1() {
    return array_slice(Config::get('rooster.tijden'), 0, -1, true);
  }
}
