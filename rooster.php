<?php
require_once 'inc/config.php';
require_once 'inc/json.php';
require 'inc/header.php';
?>

<?php if (!empty($klas)) :?>
  <div class="row">
    <?php foreach($cDagen as $dagnr => $dagNaam) : ?>
      <div class="medium-3 columns">
        <div class="dag <?php echo (huidigeDag($dagnr)) ? 'huidige-dag' : '' ?>">
          <h4><?php echo $dagNaam ?></h4>
          <?php foreach (array_slice($cTijden, 0, -1, true) as $uurnr => $uurtijd) : ?>
            <div class="uur">
              <?php
              $uur = getUur($weeknr, $dagnr, $uurnr, $klas);
              if ($uur) {
                echo '<b>'.date('H:i', strtotime($uur['tijdstip_begin'])).' - '.date('H:i', strtotime($uur['tijdstip_eind'])).'</b><br>';
                echo $uur['vak'].' - '.$uur['docent'].'<br>';
                echo '<small>'.$uur['lokaal'].' - '.$uur['klas'].'</small><br>';
              }
              else {
                echo 'leeg<br>';
              }
              ?>
            </div>
            <hr>
          <?php endforeach ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>
