<?php
require_once 'inc/json.php';
require 'inc/header.php';
?>

<?php if (!empty($klas)) :?>
  <div class="row">
    <div class="medium-3 columns">
      <div class="dag">
        <h4>Maandag</h4>
        <?php echo getDag($weeknr, 1, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag">
        <h4>Dinsdag</h4>
        <?php echo getDag($weeknr, 2, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag">
        <h4>Woensdag</h4>
        <?php echo getDag($weeknr, 3, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag">
        <h4>Donderdag</h4>
        <?php echo getDag($weeknr, 4, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag">
        <h4>Vrijdag</h4>
        <?php echo getDag($weeknr, 5, $klas); ?>
      </div>
    </div>
  </div>
<?php endif; ?>
