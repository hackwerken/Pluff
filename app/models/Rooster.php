<?php
class Rooster extends Eloquent {
  /**
   * Database tabel gebruikt door het model.
   * @var string
   */
  protected $table = 'rooster';
  /**
   * Toestaan om alle columns te mogen bewerken.
   * TODO: Dit is niet zoals het hoort. Kan beter.
   * @var bool
   */
  public static $unguarded = true;
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
  /**
   * Alle DATETIME tekstvelden die naar een Carbon object mogen.
   * @var array
   */
  protected $dates = array('tijdstip_begin', 'tijdstip_eind');
  /**
   * Zoek een klas in het 'klas' veld.
   *
   * @param string $klas Voorbeeld: 'm32'
   */
  public function scopeKlasLike($query, $klas)
  {
    return $query->where(function($query) use ($klas) {
      $query->where('klas', 'like', '%;'.$klas.';%')
        ->orWhere('lokaal', '=', $klas)
        ->orWhere('docent', '=', $klas);
    });
  }

  /**
   * Filter een aantal niet bestaande velden
   *
   * @param string $column Voorbeeld: 'klas', 'lokaal', 'docent'
   */
  public function scopeFilterOnzin($query, $column)
  {
    $filter = Config::get('rooster.klas_filter');
    if ($column === 'klas') {
      foreach ($filter as &$value) {
        $value = ';'.$value.';';
      }
    }

    return $query->whereNotIn($column, $filter)->distinct();
  }

  /**
   * Haal een lesuur op.
   *
   * @param int $weekNummer Nummer moet tussen 1 - 52 zitten.
   * @param int $dagNummer Nummer moet tussen 1 - 365 zitten.
   * @param int $uurNummer Nummer zit tussen 1 - 14 (kan geconfigureerd worden in app/config/rooster.php).
   * @param array $klassen De klassen die in het uur kunnen voorkomen.
   * @return array Informatie over het uur zoals vak, lokaal, docent.
   */
  public static function getUur($weekNummer, $dagNummer, $uurNummer, $klassen)
  {
    $uur = [];

    foreach ($klassen as $klas) {
      // Huidige jaar pakken met het ingevoerde week nummer.
      // Daarna daarbij het dagnummer optellen minus 1 (begint met maandag)
      $begintijd = Bereken::getTimestampVanWeeknrDagnr($weekNummer, $dagNummer);
      $datum = $begintijd->format('Y-m-d');

      // TODO: LIKE query van tijdstip_begin verbeteren
      $query = Rooster::klasLike($klas)
        ->whereRaw('tijdstip_begin::text LIKE \''.$datum.'%\'')
        ->where('uurnr_begin', '=', $uurNummer)
        ->first();

      // Als er een uur gevonden is, deze in de array zetten (zodat er meerdere lesuren in één uur kunnen zitten)
      if ($query)
        $uur[] = $query;
    }

    return $uur;
  }

  /**
   * Haal alle docenten op die in het rooster staan.
   *
   * @return object Alle docentenafkortingen
   */
  public static function getDocenten()
  {
    $query = Cache::rememberForever('docenten', function() {
      $query = Rooster::filterOnzin('docent')->orderBy('docent')->get(array('docent'))->toArray();

      // Alleen 'enkelvoudige' klassen mogen in de lijst voorkomen, niet meerdere klassen.
      // TODO: Gadverdamme. Dit kan beter.
      foreach ($query as $docent) {
        $docenten[] = $docent['docent'];
      }
      return $docenten;
    });

    return $query;
  }

  /**
   * Haal alle lokalen op die in het rooster staan.
   *
   * @return object Alle docentenafkortingen
   */
  public static function getLokalen()
  {
    $query = Cache::rememberForever('lokalen', function() {
      $query = Rooster::filterOnzin('lokaal')->orderBy('lokaal')->get(array('lokaal'))->toArray();

      // Alleen 'enkelvoudige' klassen mogen in de lijst voorkomen, niet meerdere klassen.
      // TODO: Gadverdamme. Dit kan beter.
      foreach ($query as $lokaal) {
        $lokalen[] = $lokaal['lokaal'];
      }
      return $lokalen;
    });

    return $query;
  }

  /**
   * Haal alle klassen op die in het rooster staan.
   *
   * @return object Alle klassen
   */
  public static function getKlassen($type = null)
  {
    $query = Rooster::filterOnzin('klas')->orderBy('klas')->get(array('klas'))->toArray();

    // Alleen 'enkelvoudige' klassen mogen in de lijst voorkomen, niet meerdere klassen.
    // TODO: Gadverdamme. Dit kan beter.

    $klassen = [];

    foreach ($query as $klasColumn) {
      foreach (Bereken::klassenNaarArray($klasColumn['klas']) as $klas)
        $klassen[] = $klas;
    }

    $klassen = array_unique($klassen);

    if ($type === 'random')
      shuffle($klassen);

    return $klassen;
  }

  public static function getAll()
  {
    $output = Cache::rememberForever('alle-data', function() {
      $klassen = self::getKlassen();
      $lokalen = self::getLokalen();
      $docenten = self::getDocenten();

      return array_merge($klassen, $lokalen, $docenten);
    });

    return $output;
  }

  public static function getDocentenToplijst($limiet = null) {
    $query = Rooster::filterOnzin('docent')
      ->select(DB::raw('count(*) as lessen, docent'))
      ->groupBy('docent')
      ->orderBy('lessen', 'desc');

      if (is_numeric($limiet))
        $query->take($limiet);

      return $query->get()->toArray();
  }

  public static function getTotaalLessen() {
    $nu = Carbon::now()->subWeek()->toDateTimeString();

    $query = Rooster::select(DB::raw('date_trunc(\'day\', tijdstip_begin) AS "dag", count(*) AS lessen'))
      ->where('tijdstip_begin', '>', $nu)
      ->groupBy('dag')
      ->orderBy('dag', 'asc');

    return $query->get()->toArray();
  }

  public static function getLessenTeGaan($klas) {
    $nu = Carbon::now()->toDateTimeString();

    $query = Rooster::klasLike($klas)
      ->where('tijdstip_begin', '>', $nu)
      ->count();

    return (int) $query;
  }

  public static function getLessenGemiddeld($klas) {
    $lessenTeGaan = Rooster::getLessenTeGaan($klas);

    if ($lessenTeGaan > 1) {
      $query = Rooster::select(DB::raw('date_trunc(\'day\', tijdstip_begin) AS "dag"'))
        ->groupBy('dag')
        ->get()->toArray();

      $gemiddeld = (float) $lessenTeGaan / (count($query));
    }
    else {
      $gemiddeld = 0;
    }

    return (float) $gemiddeld;
  }
}
