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
	$weeknr = sprintf("%02s", $_GET['week']);
else
	$weeknr = sprintf("%02s", $weeknr_echt);

// Vorige en volgende weeknr's :)
$weeknr_vorige = $weeknr - 1;
$weeknr_volgende = $weeknr + 1;
if ($weeknr_volgende == 53)
	$weeknr_volgende = '01';
if ($weeknr_vorige == 00)
	$weeknr_vorige = 52;

// Het roostersysteem kent een code toe aan elke klas.
// Je kunt deze opzoeken door naar de roostersite te gaan, je rooster te zoeken,
// en dan Rechtsklik -> Framebron weergeven en daarna de code na 'c' in de url te kopieeren.
// Ik ben te lui om ze allemaal zelf toe te voegen.
// Kennelijk verandert deze code ook soms. M22 was eerst *96, nu *93
$klassen = array(
	'M21' => 'c00092',
	'M22' => 'c00093'
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
	$kwartaal = 'Huidig';
}
?>