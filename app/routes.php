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
  $input = '<option value="A1">A1</option>
  <option value="A1H">A1H</option>
  <option value="A1T">A1T</option>
  <option value="A2">A2</option>
  <option value="A4">A4</option>
  <option value="AFSTUD-DT/OC">AFSTUD-DT/OC</option>
  <option value="AMW1">AMW1</option>
  <option value="AMW1T">AMW1T</option>
  <option value="AMW2">AMW2</option>
  <option value="B21">B21</option>
  <option value="B21T">B21T</option>
  <option value="B22">B22</option>
  <option value="B23MW">B23MW</option>
  <option value="B31">B31</option>
  <option value="B32">B32</option>
  <option value="B41">B41</option>
  <option value="B61">B61</option>
  <option value="B62">B62</option>
  <option value="BESTSTAF">BESTSTAF</option>
  <option value="CIT">CIT</option>
  <option value="DP41">DP41</option>
  <option value="DP42">DP42</option>
  <option value="DT-AD1">DT-AD1</option>
  <option value="DT-AD2">DT-AD2</option>
  <option value="DT-AD3">DT-AD3</option>
  <option value="DT-AD4">DT-AD4</option>
  <option value="DT-BEE">DT-BEE</option>
  <option value="DT-BIA">DT-BIA</option>
  <option value="DT-CSSD">DT-CSSD</option>
  <option value="DT-DBS">DT-DBS</option>
  <option value="DT-DES">DT-DES</option>
  <option value="DT-EHNS">DT-EHNS</option>
  <option value="DT-GSW">DT-GSW</option>
  <option value="DT-HSI 3">DT-HSI 3</option>
  <option value="DT-HSI1">DT-HSI1</option>
  <option value="DT-IA">DT-IA</option>
  <option value="DT-ICS">DT-ICS</option>
  <option value="DT-IDI">DT-IDI</option>
  <option value="DT-ISO">DT-ISO</option>
  <option value="DT-ITA">DT-ITA</option>
  <option value="DT-NAO">DT-NAO</option>
  <option value="DT-NOHI-1">DT-NOHI-1</option>
  <option value="DT-NOHI-2">DT-NOHI-2</option>
  <option value="DT-NOHI-3">DT-NOHI-3</option>
  <option value="DT-NOHI-4">DT-NOHI-4</option>
  <option value="DT-OOP">DT-OOP</option>
  <option value="DT-SCM">DT-SCM</option>
  <option value="DT-UC">DT-UC</option>
  <option value="EAO">EAO</option>
  <option value="EDU41A">EDU41A</option>
  <option value="EDU41B">EDU41B</option>
  <option value="EGT70">EGT70</option>
  <option value="EI14B">EI14B</option>
  <option value="EI14S">EI14S</option>
  <option value="EI2A">EI2A</option>
  <option value="EI2B">EI2B</option>
  <option value="EI2C">EI2C</option>
  <option value="EI4B">EI4B</option>
  <option value="EI4X">EI4X</option>
  <option value="EI4Y">EI4Y</option>
  <option value="EI4Z">EI4Z</option>
  <option value="EI6">EI6</option>
  <option value="EI8A">EI8A</option>
  <option value="EI8B">EI8B</option>
  <option value="EI8T">EI8T</option>
  <option value="ERP&amp;BI-1">ERP&amp;BI-1</option>
  <option value="FASTLANE">FASTLANE</option>
  <option value="FLOT">FLOT</option>
  <option value="GD41">GD41</option>
  <option value="GD42">GD42</option>
  <option value="GD43">GD43</option>
  <option value="HBO-ICT">HBO-ICT</option>
  <option value="IMS41">IMS41</option>
  <option value="IMS42">IMS42</option>
  <option value="IMS43">IMS43</option>
  <option value="INCIDENTEEL">INCIDENTEEL</option>
  <option value="LS41">LS41</option>
  <option value="M21">M21</option>
  <option value="M21T">M21T</option>
  <option value="M22">M22</option>
  <option value="M23">M23</option>
  <option value="M31">M31</option>
  <option value="M32">M32</option>
  <option value="M41">M41</option>
  <option value="M41T">M41T</option>
  <option value="M42">M42</option>
  <option value="M61">M61</option>
  <option value="M62">M62</option>
  <option value="M63">M63</option>
  <option value="MMM70">MMM70</option>
  <option value="OVERLEG">OVERLEG</option>
  <option value="S21">S21</option>
  <option value="S21T">S21T</option>
  <option value="S22">S22</option>
  <option value="S22T">S22T</option>
  <option value="S23">S23</option>
  <option value="S24">S24</option>
  <option value="S25">S25</option>
  <option value="S25V">S25V</option>
  <option value="S31">S31</option>
  <option value="S32">S32</option>
  <option value="S41">S41</option>
  <option value="S41T">S41T</option>
  <option value="S42">S42</option>
  <option value="S43">S43</option>
  <option value="S61">S61</option>
  <option value="S62">S62</option>
  <option value="S63">S63</option>
  <option value="S64">S64</option>
  <option value="SCHOLING">SCHOLING</option>
  <option value="SM31">SM31</option>
  <option value="SM32">SM32</option>
  <option value="SM41">SM41</option>
  <option value="SM42">SM42</option>
  <option value="T21">T21</option>
  <option value="T21T">T21T</option>
  <option value="T22">T22</option>
  <option value="T41">T41</option>
  <option value="T61">T61</option>
  <option value="VENLO">VENLO</option>
  <option value="VOORLICHTING FHICT">VOORLICHTING FHICT</option>';

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
    'weeknr_vorige' => $weekInfo['vorige'],
    'weeknr_huidig' => $weekInfo['huidig'],
    'weeknr_volgende' => $weekInfo['volgende'],
    'weeknr' => $weekInfo['gebruikt'],
    'aankomende_dag' => Bereken::getAankomendeDagnr()
  ];

  return View::make('rooster', $data);
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
    'weeknr' => $weekInfo['gebruikt'],
    'aankomende_dag' => Bereken::getAankomendeDagnr()
  ];

  return View::make('home', $data);
});

