$(function() {

  function roosterLaden(url) {
    console.log('Laden...');
    $.get(url, function(data) {
      $('.hetrooster').html(data);
      var jData = $(data);

      var weekie = jData.find('.js-week');

      console.log(weekie);
      console.log('Week:' + weekie);

      console.log('Rooster is succesvol ingeladen.');
    });
  }

  $('.js-klas').keyup(function() {
    // Haal de ingevoerde klassen op, haal alle spaties weg en vervang komma's door puntkomma's
    var input = $(this).val().replace(/\s+/g, '').replace(/,/g , ';');
    console.log(input);

    if (input.length >= 2)
      roosterLaden('rooster.php?klas=' + input);
  });

  $('.js-week').on('click', function(e) {
    e.preventDefault();

    var input = $(this).attr('href');
    roosterLaden(input);
  });

});

