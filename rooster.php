<?php
require_once 'inc/json.php';
require 'inc/header.php';
?>

<?php if (!empty($klas)) :?>
  <div class="row">
    <?php foreach($dagen as $dagnr => $dagNaam) : ?>
      <div class="medium-3 columns">
        <div class="dag <?php echo (huidigeDag($dagnr)) ? 'huidige-dag' : '' ?>">
          <h4><?php echo $dagNaam ?></h4>
          <?php echo getDag($weeknr, $dagnr, $klas); ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>
