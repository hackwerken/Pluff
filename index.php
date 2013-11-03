<?php
/*
 * Deze code is zo snel als mogelijk gemaakt en is slordig. Je bent gewaarschuwd.
 */


// Als het vrijddag na 18 uur is, of zaterdag of zondag, alvast de volgende week pakken
if (date('N') == 5 && date('H') > 18 OR date('N') == 6 OR date('N') == 7)
	$weeknr_echt = date('W') + 1;
else
	$weeknr_echt = date('W');

// Als er een weeknummer is ingevuld die ook numeriek is, deze gebruiken.
// Anders het huidige weeknr
if (isset($_GET['week']) && is_numeric($_GET['week']))
	$weeknr = $_GET['week'];
else
	$weeknr = $weeknr_echt;

// Vorige en volgende weeknr's :)
$weeknr_vorige = $weeknr - 1;
$weeknr_volgende = $weeknr + 1;

// Ik ben te lui om ze allemaal toe te voegen.
$klassen = array(
	'M21' => 'c00095',
	'M22' => 'c00096'
);

// Als er een klas is ingevuld die in bovenstaande array staat, die klas selecteren.
// Anders de beste klas, M22.
if (isset($_GET['klas']) && array_key_exists($_GET['klas'], $klassen)) {
	$klas_naam = $_GET['klas'];
	$klas_code = $klassen[$_GET['klas']];
}
else {
	$klas_naam = 'M22';
	$klas_code = $klassen['M22'];
}

// Door het hartstikke goede roostersysteem moet ik deze 'hack' toepassen.
// Moet wss binnenkort verwijderd worden als ze de links weer aanpassen.
if ($weeknr <= 45) {
	$kwartaal = 'Huidig';
}
else {
	$kwartaal = 'Volgend';
}
?>

<!DOCTYPE html>
<!--[if IE 8]> 				 <html class="no-js lt-ie9" lang="en" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->

<head>
	<meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>IMD <?php echo $klas_naam; ?> Rooster</title>


  <link rel="stylesheet" href="css/foundation.min.css">
  <link rel="stylesheet" href="css/style.css">

</head>
<body>

	<div class="row">
		<div class="large-12 columns">
			<div class="header">
				IMD <a href="index.php?klas=<?php echo $klas_naam; ?>" class="klas-wisselen" title=""><?php echo $klas_naam; ?></a>
				Rooster - Week
				<a href="#" class="week-select-button"><?php echo $weeknr; ?></a>

				<div class="week-select">
					<ul>
						<?php
						$weeknr_select_begin = 35;
						$weeknr_select_eind = 52;
						while ($weeknr_select_begin <= $weeknr_select_eind) {
							echo '<li>
									<a href="index.php?week='.$weeknr_select_begin.'&klas='.$klas_naam.'">Week '.$weeknr_select_begin.'</a>
								</li>';
							$weeknr_select_begin++;
						}
						?>
					</ul>
				</div>
			</div>

			<div class="row">
				<div class="small-12 large-4 columns">
					<a href="index.php?week=<?php echo $weeknr_vorige; ?>&klas=<?php echo $klas_naam; ?>" class="button alert vorige-week">&laquo; Vorige week</a>
				</div>
				<div class="small-12 large-4 text-center-large columns">
					<?php if ($weeknr_echt != $weeknr) : ?>
						<a href="index.php?week=<?php echo $weeknr_echt; ?>&klas=<?php echo $klas_naam; ?>" class="button huidige-week">Huidige week</a>
					<?php endif; ?>
				</div>
				<div class="small-12 large-4 columns">
					<a href="index.php?week=<?php echo $weeknr_volgende; ?>&klas=<?php echo $klas_naam; ?>" class="button success volgende-week">Volgende week &raquo;</a>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="large-12 columns">
			<div class="embed-container">
				<iframe src="https://www.fhict.nl/Roosters/<?php echo $kwartaal; ?>kwartaal/<?php echo $weeknr; ?>/c/<?php echo $klas_code; ?>.htm" frameborder="0"></iframe>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="large-6 columns">
			<div class="panel">
				<h4>Datum</h4>
				<p>
					Het is nu: <?php echo date('d-m-Y H:i'); ?>, week <?php echo date('W'); ?>.
				</p>
				<h4>Extra links</h4>

				<ul class="list-margin">
					<li><a href="https://www.fhict.nl/Roosters/HuidigKwartaal/default.htm">Origineel rooster</a></li>
					<li><a href="https://portal.fhict.nl/IMD/default.aspx">Portal FHICT</a></li>
				</ul>
			</div>
		</div>
		<div class="large-6 columns">
			<div class="panel">
				<h4>Vakantie</h4>
				<p>
					<?php echo 52 - date('W'); ?> weken tot kerstvakantie (<?php echo 357 - date('z'); ?> dagen).<br>
				</p>
				<div class="row">
					<div class="small-6 columns">
						Kerstvakantie
					</div>
					<div class="small-6 columns">
						23-12-2013 - 2 weken
					</div>
				</div>
				<div class="row">
					<div class="small-6 columns">
						<strong title="Zuipen verplicht.">CARNAVAL</strong>
					</div>
					<div class="small-6 columns">
						15-02-2014 - 1 week
					</div>
				</div>
				<div class="row">
					<div class="small-6 columns">
						Meivakantie
					</div>
					<div class="small-6 columns">
						26-04-2014 - 1 week
					</div>
				</div>
			</div>
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
