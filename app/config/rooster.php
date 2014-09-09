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
  'fetchUrl' => 'http://iplanner.fontys.nl/RoosterHandler.ashx?soort=JSON&dagen=365&instituut=1&klas=',
  /*
  |--------------------------------------------------------------------------
  | Lesuur tijden
  |--------------------------------------------------------------------------
  |
  | Dit zijn de uren waarop een lesuur kan _beginnen_. Een lesuur hoeft niet
  | per se op ondertaande tijdstippen te _eindigen_.
  |
  | De minuten moeten door 60 gedeeld worden. (08:45 wordt 8.75)
  |
  */
  'tijden' => [
    1 => 8.75,
    2 => 9.583333333,
    3 => 10.75,
    4 => 11.583333333,
    5 => 12.42,
    6 => 13.25,
    7 => 14.08,
    8 => 15.25,
    9 => 16.08,
    10 => 16.92,
    11 => 18,
    12 => 18.83,
    13 => 20,
    14 => 20.83,
    15 => 21.67
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
    'xxx',
    'voorlichting-fhict'
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
    'Herfstvakantie' => [
      'start' => '2014-10-18',
      'eind' => '2014-10-26'
    ],
    'Kerstvakantie' => [
      'start' => '2014-12-20',
      'eind' => '2015-01-04'
    ],
    'Voorjaarsvakantie' => [
      'start' => '2015-02-14',
      'eind' => '2015-02-22'
    ],
    'Meivakantie' => [
      'start' => '2015-05-02',
      'eind' => '2015-05-10'
    ],
    'Zomervakantie' => [
      'start' => '2015-07-25',
      'eind' => '2015-08-30'
    ]
  ]
];
