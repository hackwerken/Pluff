<?php
class Bereken {

  // Check of $string wel een geldige JSON array is en of er uberhaupt wel iets in de $string staat
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

  // Haal alle tijden volgens het rooster op, behalve de laatste. In het laatste uur wordt namelijk geen les gegeven.
  public static function getTijdenMin1() {
    return array_slice(Config::get('rooster.tijden'), 0, -1, true);
  }
}
