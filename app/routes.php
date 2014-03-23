<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

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
  // $input = '';

  if (isset($input) && Bereken::setKlasWhitelist($input))
    echo 'De whitelist is opgeslagen.';
  else
    echo 'Er is helaas iets misgegaan met het verwerken en opslaan van de whitelist.';
});

Route::get('rooster/{klasInput?}/{weekInput?}', function($klasInput = null, $weekInput = null)
{
  // Ingevoerde klas in een sessie stoppen
  if (strlen($klasInput) > 1)
    Session::put('laatsteklas', $klasInput);

  // View ophalen uit cache indien die al gecachet is
  $key = 'klas-'.Str::slug(Request::url());
  if (Cache::has($key))
    return Cache::get($key);

  $klasInfo = Bereken::getKlasInfo($klasInput);
  $weekInfo = Bereken::getWeekInfo($weekInput);

  $data = [
    'klas' => $klasInfo['array'],
    'klasHuman' => $klasInfo['human'],
    'klasOrig' => $klasInfo['orig'],
    'weeknr_vorige' => $weekInfo['vorige'],
    'weeknr_huidig' => $weekInfo['huidig'],
    'weeknr_volgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt']
  ];

  $roosterView = View::make('rooster', $data)->render();

  // De gerenderde view in de cache opslaan als dat nog niet is gebeurt
  if (!is_null($roosterView) && !Cache::has($key))
    Cache::forever($key, $roosterView);

  return $roosterView;
});

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
    'weeknr_vorige' => $weekInfo['vorige'],
    'weeknr_huidig' => $weekInfo['huidig'],
    'weeknr_volgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt']
  ];

  return View::make('home', $data);
});
