$(function() {

  // Lees status van de javascript variabelen op (handig om te testen)
  function getStatus() {
    console.log('KlasOrig: ' + klasOrig);
    console.log('Weeknr: ' + weeknr);
    console.log('Weeknr volgende: ' + weeknr_volgende);
    console.log('Weeknr vorige: ' + weeknr_vorige);
  }

  // Standaard status
  getStatus();

  // Het daadwerkelijk laden van het rooster
  function roosterLaden(klasOrig, weeknr) {
    weeknr_volgende = weeknr + 1;
    weeknr_vorige = weeknr - 1;

    console.log('Laden...');
    $.get('rooster.php?klas=' + klasOrig + '&week=' + weeknr, function(data) {
      $('.hetrooster').html(data);

      $('.js-weeknr-show').text(weeknr);
      $('.js-klas-show').text(klasOrig.replace(/;/g , ', '));

      getStatus();
    });
  }

  $('.js-klas').on('keyup change', function() {
    // Haal de ingevoerde klassen op, haal alle spaties weg en vervang komma's door puntkomma's
    var input = $(this).val().replace(/\s+/g, '').replace(/,/g , ';');
    console.log(input);

    if (input.length >= 2) {
      klasOrig = input;
      roosterLaden(klasOrig, weeknr_huidig);
    }
  });

  $('.js-vorige').on('click', function(e) {
    e.preventDefault();

    weeknr = weeknr - 1;

    roosterLaden(klasOrig, weeknr);
  });

  $('.js-huidige').on('click', function(e) {
    e.preventDefault();

    weeknr = weeknr_huidig;

    roosterLaden(klasOrig, weeknr);
  });

  $('.js-volgende').on('click', function(e) {
    e.preventDefault();

    weeknr = weeknr + 1;

    roosterLaden(klasOrig, weeknr);
  });

});

