<?php require('inc/klas.php') ?>

<!DOCTYPE html>
<html class="no-js" lang="nl" >

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>IMD <?php echo $klas_naam; ?> Rooster</title>


  <link rel="stylesheet" href="css/foundation.min.css">
  <link rel="stylesheet" href="css/style.css">

</head>
<body>
  <div class="row">
    <div class="small-12 columns">
      <?php require 'week.php'; ?>
    </div>
  </div>

  <footer>
    <p>
      &copy; <a href="http://webduck.nl">Kees Kluskens</a>
    </p>
  </footer>

  <script src="js/vendor/jquery.js"></script>
  <script src="js/general.js"></script>
</body>
</html>
