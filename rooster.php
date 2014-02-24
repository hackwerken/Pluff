<?php
require_once 'inc/json.php';
require 'inc/header.php';
?>

<?php if (!empty($klas)) :?>
  <div class="row">
    <div class="medium-3 columns">
      <div class="dag <?php echo (huidigeDag(1)) ? 'huidige-dag' : '' ?>">
        <h4>Maandag</h4>
        <?php echo getDag($weeknr, 1, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag <?php echo (huidigeDag(2)) ? 'huidige-dag' : '' ?>">
        <h4><b>Dinsdag</b></h4>
        <?php echo getDag($weeknr, 2, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag <?php echo (huidigeDag(3)) ? 'huidige-dag' : '' ?>">
        <h4>Woensdag</h4>
        <?php echo getDag($weeknr, 3, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag <?php echo (huidigeDag(4)) ? 'huidige-dag' : '' ?>">
        <h4>Donderdag</h4>
        <?php echo getDag($weeknr, 4, $klas); ?>
      </div>
    </div>
    <div class="medium-3 columns">
      <div class="dag <?php echo (huidigeDag(5)) ? 'huidige-dag' : '' ?>">
        <h4>Vrijdag</h4>
        <?php echo getDag($weeknr, 5, $klas); ?>
      </div>
    </div>
  </div>
<?php endif; ?>
