<?php
error_reporting(E_ALL);

$tijden = [
  1 => '08:45',
  2 => '09:35',
  3 => '10:45',
  4 => '11:35',
  5 => '12:25',
  6 => '13:15',
  7 => '14:05',
  8 => '15:15',
  9 => '16:05',
  10 => '16:55',
  11 => '18:00',
  12 => '18:50',
  13 => '20:00',
  14 => '20:50',
  15 => '21:40'
];

// Deze aanpassen om te kunnen testen!
$start = '13:15';
$eind = '14:55';

$tijdstipBeginUnix = strtotime('2014-02-25 '.$start);
$tijdstipEindUnix = strtotime('2014-02-25 '.$eind);

$uurnrBegin = array_search($start, $tijden);

// 3000 = 50 minuten.
$secVerschil = $tijdstipEindUnix - $tijdstipBeginUnix;
$uurVerschil = ($secVerschil) / 3000;
$uurnrDuur = round($uurVerschil);
$uurnrEind = $uurnrDuur + $uurnrBegin;

echo '<b>Tijdstippen</b><br>';
echo 'Uur begint: '.$start.'<br>';
echo 'Uur eindigt: '.$eind.'<br>';
echo 'Seconden verschil: '.$secVerschil.'<br>';
echo 'Lesuur verschil: '.$uurVerschil.'<br>';
echo '<br>';
echo '<b>Lesuren</b><br>';
echo 'Les begint: '.$uurnrBegin.'e uur<br>';
echo 'Les duur: '.$uurnrDuur.' uur<br>';
echo 'Les eindigt: '.$uurnrEind.'e uur<br>';
