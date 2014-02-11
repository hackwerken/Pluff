<?php
require_once 'inc/json.php';
require 'inc/header.php';
?>
<div class="hide js-klasHuman"><?php echo $klasHuman ?></div>
<div class="hide js-week"><?php echo $weeknr ?></div>

<?php if (!empty($klas)) :?>
  <div class="row">
    <div class="medium-3 columns">
      <h2>Ma</h2>
      <?php echo getDag($weeknr, 1, $klas); ?>
    </div>
    <div class="medium-3 columns">
      <h2>Di</h2>
      <?php echo getDag($weeknr, 2, $klas); ?>
    </div>
    <div class="medium-3 columns">
      <h2>Wo</h2>
      <?php echo getDag($weeknr, 3, $klas); ?>
    </div>
    <div class="medium-3 columns">
      <h2>Do</h2>
      <?php echo getDag($weeknr, 4, $klas); ?>
    </div>
    <div class="medium-3 columns">
      <h2>Vr</h2>
      <?php echo getDag($weeknr, 5, $klas); ?>
    </div>
  </div>
<?php endif; ?>