<?php
require 'inc/json.php';
require 'inc/header.php';
?>

<!DOCTYPE html>
<html class="no-js" lang="nl" >

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Fontys Rooster</title>


  <link rel="stylesheet" href="css/foundation.min.css">
  <link rel="stylesheet" href="css/style.css">

</head>
<body>
  <div class="row">
    <div class="small-15 columns">
      <div class="header">
          Klas <span class="js-klas-show"><?php echo (!empty($klasHuman)) ? $klasHuman : '' ?></span> &ndash;
          Week <span class="js-weeknr-show"><?php echo $weeknr ?></span>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="small-15 medium-5 columns">
      <a href="rooster.php?klas=<?php echo $klasOrig ?>&week=<?php echo $weeknr_vorige ?>" class="button alert vorige-week js-vorige">&laquo; Vorige week</a>
    </div>
    <div class="small-15 medium-5 text-center-large columns">
      <a href="rooster.php?klas=<?php echo $klasOrig ?>&week=<?php echo $weeknr_huidig ?>" class="button huidige-week js-huidige">Huidige week</a>
    </div>
    <div class="small-15 medium-5 columns">
      <a href="rooster.php?klas=<?php echo $klasOrig ?>&week=<?php echo $weeknr_volgende ?>" class="button success volgende-week js-volgende">Volgende week &raquo;</a>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <?php if (empty($_GET['klas'])) : ?>
        <h3>Klas</h3>
        <input type="text" value="" placeholder="Vul een of meerdere klassen in (puntkommmagescheiden)" class="js-klas">
      <?php endif; ?>
      <div class="hetrooster">
        <?php require('rooster.php') ?>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <div class="permalink hide js-permalink-toggle panel">
        <b>Permalink:</b> <span class="js-permalink"></span>
      </div>
    </div>
  </div>


  <footer>
    <p>
      &copy; <a href="http://webduck.nl">Kees Kluskens</a>
    </p>
  </footer>

  <script src="js/vendor/jquery.js"></script>
  <script>
    window.weeknr = <?php echo $weeknr ?>;
    window.weeknr_volgende = <?php echo $weeknr_volgende ?>;
    window.weeknr_vorige = <?php echo $weeknr_vorige ?>;
    window.weeknr_huidig = <?php echo $weeknr_huidig ?>;
    window.klasOrig = "<?php echo $klasOrig ?>";
  </script>
  <script src="js/general.js"></script>
</body>
</html>
