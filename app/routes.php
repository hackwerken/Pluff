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
