<?php
class Rooster extends Eloquent {
  /**
   * Database table used by model
   * @var string
   */
  protected $table = 'rooster';

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

  public static function getUur($weekNummer, $dagNummer, $uurNummer, $klassen) {
    $uur = [];

    foreach ($klassen as $klas) {
      // Huidige jaar pakken met het ingevoerde week nummer.
      // Daarna daarbij het dagnummer optellen minus 1 (begint met maandag)
      $begintijd = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');
      $datum = date('Y-m-d', $begintijd);

      $query = Rooster::where('klas', 'like', '%'.$klas.'%')
        ->where('tijdstip_begin', 'like', '%'.$datum.'%')
        ->where('uurnr_begin', '=', $uurNummer)
        ->first();

      // Als er een uur gevonden is, deze in de array zetten (zodat er meerdere lesuren in één uur kunnen zitten)
      if ($query)
        $uur[] = $query;
    }

    return $uur;
  }
}
