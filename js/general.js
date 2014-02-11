$(function() {

  $('.js-klas').keyup(function() {
    // Haal de ingevoerde klassen op, haal alle spaties weg en vervang komma's door puntkomma's
    var input = $(this).val().replace(/\s+/g, '').replace(/,/g , ';');
    console.log(input);

    if (input.length >= 2) {
      console.log('Laden...');
      $.get('rooster.php?klas=' + input, function(data) {
        $('.hetrooster').html(data);

        console.log('Rooster is succesvol ingeladen.');
      });
    }
  });

  $('.js-week').on('click', function(e) {
    e.preventDefault();

    var input = $(this).attr('href');
    $.get(input, function(data) {
      $('.hetrooster').html(data);

      console.log('Rooster is succesvol ingeladen.');
    });
  });

});

