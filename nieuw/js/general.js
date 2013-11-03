$(function() {

	$('.klas-wisselen').on('click', function(e) {
		alert('Jo!');
	});

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
	});

});

