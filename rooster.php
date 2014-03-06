<?php
require_once 'inc/config.php';
require_once 'inc/json.php';
require 'inc/header.php';
?>

<?php if (!empty($klas)) :?>
  <div class="row">
    <?php foreach($cDagen as $dagnr => $dagNaam) : ?>
      <div class="medium-3 columns">
        <div class="dag <?php echo (huidigeDag($weeknr, $dagnr)) ? 'huidige-dag' : '' ?>">
          <h4><?php echo $dagNaam ?></h4>
          <?php
          // We willen niet bij 0 beginnen.
          $cTijdenMin1 = array_slice($cTijden, 0, -1, true);

          // Alle uren
          foreach ($cTijdenMin1 as $uurnr => $uurtijd) {
            $uurArray = getUur($weeknr, $dagnr, $uurnr, $klas);
            if ($uurArray) {
              echo '<div class="uur">';
              echo '<div class="uur-nummer">'.$uurnr.'</div>';
              foreach ($uurArray as $uur) {
                if ($uur) {
                  echo '<b>'.date('H:i', strtotime($uur['tijdstip_begin'])).' - '.date('H:i', strtotime($uur['tijdstip_eind'])).'</b><br>';
                  echo $uur['vak'].' - '.$uur['docent'].'<br>';
                  echo '<small>'.$uur['lokaal'].' - '.$uur['klas'].'</small><br>';
                }
              }
              echo '</div>';
            }
            else {
              echo '<div class="uur uur-leeg">';
              echo '<div class="uur-nummer">'.$uurnr.'</div>';
              echo '</div>';
            }
            $laatste = ($uurnr === 14) ? 'hide' : '';
            echo '<hr class="'.$laatste.'">';
          }
          ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>
