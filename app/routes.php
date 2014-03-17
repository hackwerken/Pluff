<?php
/*
|--------------------------------------------------------------------------
| Routes caching.
| TODO:
| - Verder testen
| - Snelheidwinst meten
|--------------------------------------------------------------------------
*/
Route::filter('cache', function($route, $request, $response = null)
{
    $key = 'route-'.Str::slug(Request::url());
    $minutes = 30;
    if(is_null($response) && Cache::has($key)) {
      return Cache::get($key);
    }
    elseif(!is_null($response) && !Cache::has($key)) {
      Cache::put($key, $response->getContent(), $minutes);
    }
});

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
  $input = '';

  if (Bereken::setKlasWhitelist($input))
    echo 'De whitelist is opgeslagen.';
  else
    echo 'Er is helaas iets misgegaan met het verwerken en opslaan van de whitelist.';
});

Route::get('rooster/{klasInput?}/{weekInput?}', array('before' => 'cache', 'after' => 'cache', function($klasInput = null, $weekInput = null)
{
  $klasInfo = Bereken::getKlasInfo($klasInput);
  $weekInfo = Bereken::getWeekInfo($weekInput);

  $data = [
    'klas' => $klasInfo['array'],
    'klasHuman' => $klasInfo['human'],
    'klasOrig' => $klasInfo['orig'],
    'weeknr_vorige' => $weekInfo['vorige'],
    'weeknr_huidig' => $weekInfo['huidig'],
    'weeknr_volgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt'],

    'cDagen' => Config::get('rooster.dagen'),
  ];

  return View::make('rooster', $data);
}));

Route::get('/{klasInput?}/{weekInput?}', function($klasInput = null, $weekInput = null)
{
  $klasInfo = Bereken::getKlasInfo($klasInput);
  $weekInfo = Bereken::getWeekInfo($weekInput);

  $data = [
    'klas' => $klasInfo['array'],
    'klasHuman' => $klasInfo['human'],
    'klasOrig' => $klasInfo['orig'],
    'weeknr_vorige' => $weekInfo['vorige'],
    'weeknr_huidig' => $weekInfo['huidig'],
    'weeknr_volgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt'],

    'cDagen' => Config::get('rooster.dagen'),
  ];

  return View::make('home', $data);
});
