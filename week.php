<?php
require 'inc/calfileparser.php';
require 'inc/ical.php';

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

// Haal het rooster van maandag van deze week op
?>
<h3>Klas</h3>
<input type="text" value="" placeholder="Vul de klas in" class="js-klas">

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