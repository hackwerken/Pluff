<?php

return [
  'versie' => '1.0',
  'fetchUrl' => 'http://iplanner.fontys.nl/RoosterHandler.ashx?soort=JSON&instituut=1&klas=',
  'tijden' => [
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
  ],
  'klas_filter' => [
    '-',
    '?',
    '',
    'xxx'
  ],
  'vakanties' => [
    'Meivakantie' => [
      'start' => '2014-04-26',
      'eind' => '2014-05-05'
    ],
    'Zomervakantie' => [
      'start' => '2014-07-12',
      'eind' => '2014-08-24'
    ],
    'Herfstvakantie' => [
      'start' => '2014-10-18',
      'eind' => '2014-10-26'
    ],
    'Kerstvakantie' => [
      'start' => '2014-12-20',
      'eind' => '2015-01-04'
    ]
  ]
];
