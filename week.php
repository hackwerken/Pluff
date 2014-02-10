<?php
require 'inc/calfileparser.php';



// echo '<pre>';
// print_r($remote);

$huidigWeeknummer = date('W');

function getDag($weekNummer, $dagNummer) {
  $cal = new CalFileParser();
  $remote = $cal->parse('http://pinega.fontys.nl/studenten/ical.aspx?instituut=1&klas=m22');

  foreach ($remote as $event) {
    $starttijd = strtotime($event['dtstart;tzid=europe/amsterdam']); // Starttijd geconverteerd naar UNIX timestamp
    $eindtijd  = strtotime($event['dtend;tzid=europe/amsterdam']); // Eindtijd geconverteerd naar UNIX timestamp
    $starttijdHuman = date('H:i', $starttijd);
    $eindtijdHuman  = date('H:i', $eindtijd);

    // Alleen de huidige week weergeven
    if (date('W', $starttijd) === $weekNummer AND date('N', $starttijd) == $dagNummer) {
      echo "<b>".$starttijdHuman." - ";
      echo $eindtijdHuman."</b><br/>";
      echo $event['summary']."<br/>";
      echo "<small>".$event['description']."</small><br/>";
      echo "<hr/>";
    }
  }
}

// Haal het rooster van maandag van deze week op
?>

<div class="row">
  <div class="large-3 columns">
    <h2>Ma</h2>
    <?php echo getDag(date('W', time()), 1); ?>
  </div>
  <div class="large-3 columns">
    <h2>Di</h2>
    <?php echo getDag(date('W', time()), 2); ?>
  </div>
  <div class="large-3 columns">
    <h2>Wo</h2>
    <?php echo getDag(date('W', time()), 3); ?>
  </div>
  <div class="large-3 columns">
    <h2>Do</h2>
    <?php echo getDag(date('W', time()), 4); ?>
  </div>
</div>