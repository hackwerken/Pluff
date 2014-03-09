<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('rooster/{klasInput?}/{weekInput?}', function($klasInput = null, $weekInput = null)
{
  $klasInfo = Rooster::getKlasInfo($klasInput);
  $weekInfo = Rooster::getWeekInfo($weekInput);

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
});

Route::get('/{klasInput?}/{weekInput?}', function($klasInput = null, $weekInput = null)
{
  $klasInfo = Rooster::getKlasInfo($klasInput);
  $weekInfo = Rooster::getWeekInfo($weekInput);

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
