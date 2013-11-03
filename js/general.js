$(function() {

	$('.klas-wisselen').on('click', function(e) {
		e.preventDefault();

		console.log('Klikkie.');

		// Dropdown laten zien
		$('.klas-select').fadeToggle(300);

		// Verdwijnen bij esc toets
		$(document).on('keyup', function(e) {
			if(e.keyCode === 27) {
				$('.klas-select').fadeOut(300);
				$(document).off('keyup');
			}
		});

		// Laten verdwijnen als er ergens anders op wordt geklikt.
		// WAARSCHUWING: matige code.
		$('.wegklikken').css('z-index', 10).on('click', function(e) {
			$('.klas-select, .week-select').hide();
			console.log('Weg!');
			$('.wegklikken').css('z-index', 0).off();
		});
	});

	// En die shit kopieren, ik ben te lui.
	$('.week-select-button').on('click', function(e) {
		e.preventDefault();

		console.log('Klikkie.');
		$('.week-select').fadeToggle(300);

		$(document).on('keyup', function(e) {
			if(e.keyCode === 27) {
				$('.week-select').fadeOut(300);
				$(document).off('keyup');
			}
		});

		$('.wegklikken').css('z-index', 10).on('click', function(e) {
			$('.klas-select, .week-select').hide();
			console.log('Weg!');
			$('.wegklikken').css('z-index', 0).off();
		});
	});


});

