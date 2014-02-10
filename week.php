<?php
require 'inc/calfileparser.php';

$cal = new CalFileParser();
$remote = $cal->parse('http://pinega.fontys.nl/studenten/ical.aspx?instituut=1&klas=m22');

// echo '<pre>';
// print_r($remote);

$huidigWeeknummer = date('W');

foreach ($remote as $event) {
  $starttijd = strtotime($event['dtstart;tzid=europe/amsterdam']); // Starttijd geconverteerd naar UNIX timestamp
  $eindtijd  = strtotime($event['dtend;tzid=europe/amsterdam']); // Eindtijd geconverteerd naar UNIX timestamp
  $starttijdHuman = date('l H:i', $starttijd);
  $eindtijdHuman  = date('H:i', $eindtijd);

  $dagBegonnen = 0;

  // Alleen de huidige week weergeven
  if (date('W', $starttijd) === $huidigWeeknummer) {
    // if (!$dagBegonnen) {
    //   echo "<h2>".date('l', $starttijd)."</h2>";
    //   $dagBegonnen = 1;
    // }
    echo "<b>".$starttijdHuman." - ";
    echo $eindtijdHuman."</b><br/>";
    echo $event['summary']."<br/>";
    echo "<small>".$event['description']."</small><br/>";
    echo "<hr/>";
  }
}