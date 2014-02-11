<?php
require_once 'inc/calfileparser.php';
require_once 'inc/ical.php';
require 'inc/header.php';
?>
<div class="row">
  <div class="large-2 columns">
    <h2>Ma</h2>
    <?php echo getDag($weeknr, 1, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Di</h2>
    <?php echo getDag($weeknr, 2, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Wo</h2>
    <?php echo getDag($weeknr, 3, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Do</h2>
    <?php echo getDag($weeknr, 4, $klas); ?>
  </div>
  <div class="large-2 columns">
    <h2>Vr</h2>
    <?php echo getDag($weeknr, 5, $klas); ?>
  </div>
  <div class="large-2 columns"></div>
</div>