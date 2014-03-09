<?php
class Rooster extends Eloquent {
  /**
   * Database tabel gebruikt door het model.
   * @var string
   */
  protected $table = 'rooster';
  /**
   * Wel of geen timestamps aan de tabel toevoegen.
   * @var bool
   */
  public $timestamps = true;
  /**
   * Bij verwijdering van een rij het in een 'prullenbak' gooien.
   * @var bool
   */
  protected $softDelete = false;

  // public function scopeKlas($query, $klas)
  // {
  //   return $query->where('klas', '=', $klas)
  //         ->orWhere('klas', 'like', $klas.' %')
  //         ->orWhere('klas', 'like', '% '.$klas.'%');
  // }

  /**
   * Haal een lesuur op.
   *
   * @param int $weekNummer Nummer moet tussen 1 - 52 zitten.
   * @param int $dagNummer Nummer moet tussen 1 - 365 zitten.
   * @param int $uurNummer Nummer zit tussen 1 - 14 (kan geconfigureerd worden in app/config/rooster.php).
   * @param array $klassen De klassen die in het uur kunnen voorkomen.
   * @return array Informatie over het uur zoals vak, lokaal, docent.
   */
  public static function getUur($weekNummer, $dagNummer, $uurNummer, $klassen) {
    $uur = [];

    foreach ($klassen as $klas) {
      // Huidige jaar pakken met het ingevoerde week nummer.
      // Daarna daarbij het dagnummer optellen minus 1 (begint met maandag)
      $begintijd = strtotime(date('Y').'W'.$weekNummer.' + '.($dagNummer - 1).' day');
      $datum = date('Y-m-d', $begintijd);

      $query = Rooster::where(function($query) use ($klas) {
          $query->where('klas', '=', $klas)
            ->orWhere('klas', 'like', $klas.' %')
            ->orWhere('klas', 'like', '% '.$klas.'%');
        })
        ->where('tijdstip_begin', 'like', '%'.$datum.'%')
        ->where('uurnr_begin', '=', $uurNummer)
        ->first();

      $query2 = Rooster::where(function($query) use ($klas) {
          $query->where('klas', '=', $klas)
            ->orWhere('klas', 'like', $klas.' %')
            ->orWhere('klas', 'like', '% '.$klas.'%');
        })
        ->where('tijdstip_begin', 'like', '%'.$datum.'%')
        ->where('uurnr_eind', '=', ($uurNummer + 1))
        ->first();

      // Als er een uur gevonden is, deze in de array zetten (zodat er meerdere lesuren in één uur kunnen zitten)
      if ($query)
        $uur[] = $query;
      elseif ($query2)
        $uur[] = $query2;
    }

    return $uur;
  }
}
