<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

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

