<?php

return [
  /*
  |--------------------------------------------------------------------------
  | Het versienummmer
  |--------------------------------------------------------------------------
  |
  | Verschijnt onder in de footer.
  |
  */
  'versie' => '1.0',
  /*
  |--------------------------------------------------------------------------
  | Fetch URL
  |--------------------------------------------------------------------------
  |
  | Deze URL wordt gebruikt om de roosters uit op te halen. De response moet
  | in JSON zijn. Achter deze URL komt een klasnaam te staan.
  |
  */
  'fetchUrl' => 'http://iplanner.fontys.nl/RoosterHandler.ashx?soort=JSON&instituut=1&klas=',
  /*
  |--------------------------------------------------------------------------
  | Lesuur tijden
  |--------------------------------------------------------------------------
  |
  | Dit zijn de uren waarop een lesuur kan _beginnen_. Een lesuur hoeft niet
  | per se op ondertaande tijdstippen te _eindigen_.
  |
  */
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
  /*
  |--------------------------------------------------------------------------
  | Klas filter
  |--------------------------------------------------------------------------
  |
  | Dit zijn de klassen / docenten / lokalen die uit de cheatsheet worden
  | gefilterd.
  |
  */

  'klas_filter' => [
    '-',
    '?',
    '',
    'xxx'
  ],
  /*
  |--------------------------------------------------------------------------
  | Vakanties
  |--------------------------------------------------------------------------
  |
  | Dit zijn, logischerwijs alle vakanties die er nog komen. Zorg dat ze
  | in dit exacte formaat staan:
  | 'vakanties' => [
  |   'Vakantienaam' => [
  |     'start' => 'yyyy-mm-dd',
  |     'eind' => 'yyyy-mm-dd'
  |   ]
  | ]
  |
  */
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
