<?php
class Bereken {

  /**
   * Zoek de UNIX timestamp van de input op en controleer of de datum overeenkomt met de huidige datum.
   *
   * @param int $weekNummer Nummer moet tussen 0 - 52 zitten
   * @param int $dagNummer Nummer moet tussen 0 - 365 zitten
   * @return boolean
   */
  public static function getHuidigeDag($weekNummer, $dagNummer) {
    // Converteer het ingevoerde weeknummer + dagnummer van de week naar een UNIX timestamp
    $datum = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');
    // Pak dan het dagnummer van het jaar (0 - 365)
    $dagnrvanhetjaar = date('z', $datum);

    // En controleer of het de huidige dag is. Zoja, return true
    if (date('z') == $dagnrvanhetjaar)
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
