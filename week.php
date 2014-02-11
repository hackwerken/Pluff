<?php
require 'inc/calfileparser.php';

$huidigWeeknummer = date('W');

// Standaard klas
$klas = 'm32';

if (!empty($_GET['klas']) && preg_match('/^[A-Za-z0-9;]+$/i', $_GET['klas'])) {
  // Indien meerdere klassen er een array van maken
  $klasArray = explode(";", $_GET['klas']);
  // Array weer samenvoegen met extra tekst ertussen. (array) voorkomt een foutmelding als er maar 1 klas is opgegeven.
  $klasArray = implode("&klas=", (array)$klasArray);
  $klas = $klasArray;
}

function getDag($weekNummer, $dagNummer, $klas) {
  $cal = new CalFileParser();
  $remote = $cal->parse('http://pinega.fontys.nl/studenten/ical.aspx?instituut=1&klas='.$klas);

  $huidigeTijd = '11:00';

  foreach ($remote as $event) {
    $starttijd = strtotime($event['dtstart;tzid=europe/amsterdam']); // Starttijd geconverteerd naar UNIX timestamp
    $eindtijd  = strtotime($event['dtend;tzid=europe/amsterdam']); // Eindtijd geconverteerd naar UNIX timestamp
    $starttijdHuman = date('H:i', $starttijd);
    $eindtijdHuman  = date('H:i', $eindtijd);

    // Alleen de huidige week weergeven
    if (date('W', $starttijd) === $weekNummer AND date('N', $starttijd) == $dagNummer) {
      // Controleer of de les nu bezig is door het dagnummer te vergelijken en de tijd
      if (date('z', $starttijd) === date('z', time()) && $huidigeTijd > $starttijdHuman && $huidigeTijd < $eindtijdHuman) {
        echo '<span style="color:red">';
      }
      echo "<b>".$starttijdHuman." - ";
      echo $eindtijdHuman."</b><br/>";
      echo $event['summary']."<br/>";
      echo "<small>".$event['description']."</small><br/>";
      echo "<hr/>";
      if (date('z', $starttijd) === date('z', time()) && $huidigeTijd > $starttijdHuman && $huidigeTijd < $eindtijdHuman) {
        echo '</span>';
      }
    }
  }
}

// Haal het rooster van maandag van deze week op
?>

<div class="row">
  <div class="large-2 columns">
    <h2>Ma</h2>
    <?php echo getDag(date('W', time()), 1, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Di</h2>
    <?php echo getDag(date('W', time()), 2, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Wo</h2>
    <?php echo getDag(date('W', time()), 3, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Do</h2>
    <?php echo getDag(date('W', time()), 4, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Vr</h2>
    <?php echo getDag(date('W', time()), 5, $klas); ?>
  </div>
  <div class="large-2 columns"></div>
</div>