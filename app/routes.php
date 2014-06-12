<?php
/*
|--------------------------------------------------------------------------
| Statistieken
|--------------------------------------------------------------------------
*/

Route::get('graph', function() {
  $data = [
    'docentenToplijst' => Rooster::getDocentenToplijst(5),
    'klassen' => Rooster::getKlassen('random')
  ];

  return View::make('graph', $data);
});

Route::get('graph/klas/{klas}', function($klas = null) {
  $data = [
    'klas' => $klas,
    'lessenTeGaan' => Rooster::getLessenTeGaan($klas),
    'lessenGemiddeld' => Rooster::getLessenGemiddeld($klas)
  ];

  return View::make('graph-klas', $data);
});

Route::get('graph/vakpercentage/{klas}', function($klas) {
  // Lessen van de klas per vak
  $vaklessen = Rooster::select(DB::raw('vak, count(*) as lessen'))
    ->klasLike($klas)
    ->groupBy('vak')
    ->orderBy('lessen', 'desc')
    ->get()->toArray();

  $data = [];

  foreach ($vaklessen as $vak) {

    $data[] = [
      'label' => $vak['vak'],
      'y' => $vak['lessen']
    ];
  }

  return Response::json($data);
});

Route::get('graph/weeklessen/{type?}/{weeknr?}', function($type = null, $weeknr = null) {
  $weekInfo = Bereken::getWeekInfo($weeknr);

  $data = [];

  if ($type === 'nv3') {
    $data['key'] = 'Drukte in week '.$weekInfo['gebruikt'];
  }

  foreach(Lang::get('site.days') as $dagnr => $dagNaam) {
    $datum = Bereken::getTimestampVanWeeknrDagnr($weekInfo['gebruikt'], $dagnr)->format('Y-m-d');

    $aantal = Rooster::whereRaw('tijdstip_begin::text LIKE \''.$datum.'%\'')->count();

    if ($type === 'nv3') {
      $data['values'][] = [
        'label' => $dagNaam,
        'value' => $aantal
      ];
    }
    else {
      $data[$dagNaam] = $aantal;
    }
  }

  return Response::json($data);
});

Route::get('graph/docentlessen/{type?}/{limiet?}', function($type = null, $limiet = null) {
  $query = Rooster::getDocentenToplijst($limiet);

  $data = [];

  if ($type === 'd3') {
    $docenten = [];

    foreach($query as $docent) {
      $docenten[] = [
        'name' => $docent['docent'],
        'size' => $docent['lessen']
      ];
    }

    $data = [
      'name' => 'lessen',
      'children' => $docenten
    ];
  }
  else {
    foreach($query as $docent) {
      $data[$docent['docent']] = $docent['lessen'];
    }
  }

  return Response::json($data);
});

Route::get('graph/totaallessen/{type?}', function($type = null) {
  $query = Rooster::getTotaalLessen();

  $data = [];
  $data['key'] = 'Lessen';

  foreach ($query as $item) {
    $datum = new Carbon($item['dag']);

    $data['values'][] = [
      'label' => $datum->format('d-m-Y'),
      'value' => $item['lessen']
    ];
  }

  return Response::json($data);
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

Route::get('jsoninput', function() {
  $json = Rooster::getAll();

  return Response::json($json);
});

Route::get('klaskleuren', function() {
  $start = microtime(true);
  foreach (Rooster::orderBy('vak')->distinct()->get(array('vak')) as $vak) {
    echo '<div style="width: 70px; height: 70px; float:left; margin: 0 10px 10px 0; color: #fff; background: #'.Bereken::stringNaarKleurenCode($vak->vak).'">
    '.$vak->vak.'
    </div>';
  }
  $end = microtime(true);
  echo "Geladen in ".($end-$start)."s\n";
});

Route::get('klasinput', function() {
  // Voor gehele automatisering van de input van klassen moet onderstaande methode nog verbeterd worden.
  // $ch = curl_init('http://iplanner.fontys.nl/');
  // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  // curl_setopt($ch, CURLOPT_POST, true);
  // curl_setopt($ch, CURLOPT_POSTFIELDS, 'ddlInstituut=1');
  // $response = curl_exec($ch);

  // Vul hieronder een lijst met <option>'s van alle klassen in.
  // Deze kun je krijgen van http://iplanner.fontys.nl/.
  // Zet elke option op een nieuwe regel!
  // Voorbeeld:
  // <option value="a1">a1</option>
  $input = '';

  if (isset($input) && Bereken::setKlasWhitelist($input))
    echo 'De whitelist is opgeslagen.';
  else
    echo 'Er is helaas iets misgegaan met het verwerken en opslaan van de whitelist.';
});

Route::get('lang/{lang}', function($langInput)
{
  if (in_array($langInput, Config::get('app.provided_locales'))) {
    Session::put('language', $langInput);

    return Redirect::back();
  }
});

Route::get('cheatsheet', function() {
  $data = [
    'docenten' => Rooster::getDocenten(),
    'lokalen' => Rooster::getLokalen(),
    'klassen' => Rooster::getKlassen()
  ];
  return View::make('cheatsheet', $data);
});

Route::get('vakanties', function() {
  $data = [
    'vakanties' => Config::get('rooster.vakanties')
  ];
  return View::make('vakanties', $data);
});

Route::get('rooster/{klasInput?}/{weekInput?}', function($klasInput = null, $weekInput = null)
{
  // Ingevoerde klas in een sessie stoppen
  if (strlen($klasInput) > 1)
    Session::put('laatsteklas', $klasInput);

  $klasInfo = Bereken::getKlasInfo($klasInput);
  $weekInfo = Bereken::getWeekInfo($weekInput);

  $data = [
    'klas' => $klasInfo['array'],
    'klasHuman' => $klasInfo['human'],
    'klasOrig' => $klasInfo['orig'],
    'weeknrVorige' => $weekInfo['vorige'],
    'weeknrHuidig' => $weekInfo['huidig'],
    'weeknrVolgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt'],
    'aankomendeDag' => Bereken::getAankomendeDagnr()
  ];

  return View::make('rooster', $data);
})->where('klasInput', '[A-Za-z0-9;_.-]+');

Route::get('/{klasInput?}/{weekInput?}', function($klasInput = null, $weekInput = null)
{
  // Als er geen klas is ingevuld, kijk dan welke klas de persoon het laatste heeft ingevuld
  if ($klasInput === null)
    $klasInput = Session::get('laatsteklas');

  $klasInfo = Bereken::getKlasInfo($klasInput);
  $weekInfo = Bereken::getWeekInfo($weekInput);

  $data = [
    'klas' => $klasInfo['array'],
    'klasHuman' => $klasInfo['human'],
    'klasOrig' => $klasInfo['orig'],
    'weeknrVorige' => $weekInfo['vorige'],
    'weeknrHuidig' => $weekInfo['huidig'],
    'weeknrVolgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt'],
    'aankomendeDag' => Bereken::getAankomendeDagnr()
  ];

  return View::make('home', $data);
});
