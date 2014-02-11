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
  <!--[if lt IE 9]>
    <div class="slechtebrowser">
      <p>
        Het lijkt erop dat je Internet Explorer 8 of lager gebruikt. Het internet gaat snel vooruit, maar toch komt je browser nog uit het jaar 2009. We zitten nu in 2014. Dit kan toch niet?
      </p>
      <p>
        Ik adviseer je sterk om een goede internetbrowser zoals <a href="https://www.google.nl/intl/nl/chrome/browser/">Chrome</a> of <a href="https://www.mozilla.org/nl/firefox/">Firefox</a> te downloaden. Bezoek daarna mijn site en check het verschil!
      </p>
    </div>
  <![endif]-->

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
      <a href="index.php?klas=<?php echo $klasOrig ?>&week=<?php echo $weeknr_vorige ?>" class="button alert vorige-week js-vorige">&laquo; Vorige week</a>
    </div>
    <div class="small-15 medium-5 text-center-large columns">
      <a href="index.php?klas=<?php echo $klasOrig ?>&week=<?php echo $weeknr_huidig ?>" class="button huidige-week js-huidige">Huidige week</a>
    </div>
    <div class="small-15 medium-5 columns">
      <a href="index.php?klas=<?php echo $klasOrig ?>&week=<?php echo $weeknr_volgende ?>" class="button success volgende-week js-volgende">Volgende week &raquo;</a>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <div class="js-intro <?php echo (!empty($_GET['klas'])) ? 'hide' : '' ?>">
        <h3>Rooster</h3>
        <p>
          Hieronder kun je je klas van Fontys invoeren. Zit je in meerdere klassen? Scheid deze dan met een puntkomma.
          Je kunt hierna onderaan de pagina de &lsquo;permalink&rsquo; kopi&euml;ren en hier eventueel een bladwijzer van maken.
        </p>
        <p>
          <strong>Note:</strong> Je kunt hier alleen gebruik van maken als je op de Fontys ICT opleiding zit. We zijn nog bezig met andere opleidingen toevoegen.
        </p>
      </div>

      <input type="text" value="<?php echo $klasOrig ?>" placeholder="Vul een of meerdere klassen in (puntkommmagescheiden)" class="js-klas">

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
    <div class="row">
      <div class="small-15 columns">
        <p>
          <em>Pluff</em> BETA Versie. Gemaakt door <a href="https://webduck.nl">Kees Kluskens</a> &amp; <a href="http://laylo.nl">Jeroen Janssen</a>.
          Denk je dat dit beter kan? Help ons op <a href="https://github.com/SpaceK33z/FHICT-Rooster">Github</a>!
          <small>Een designer is dringend nodig</small>
        </p>
      </div>
    </div>
  </footer>

  <script src="js/vendor/jquery.js"></script>
  <script>
    window.weeknr = <?php echo $weeknr ?>;
    window.weeknr_volgende = <?php echo $weeknr_volgende ?>;
    window.weeknr_vorige = <?php echo $weeknr_vorige ?>;
    window.weeknr_huidig = <?php echo $weeknr_huidig ?>;
    window.klasOrig = "<?php echo $klasOrig ?>";
  </script>
  <script src="js/app.js"></script>
</body>
</html>
