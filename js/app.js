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
      // Opgehaalde rooster in de DOM zetten
      $('.hetrooster').html(data);

      // Weeknummer en klas vervangen in de header
      $('.js-weeknr-show').text(weeknr);
      $('.js-klas-show').text(klasOrig.replace(/;/g , ', '));

      // Permalink laten zien
      $('.js-permalink-toggle').show();
      var nieuweUrl = 'http://pluff.nl/?klas=' + klasOrig;
      $('.js-permalink').text(nieuweUrl).attr('href', nieuweUrl);

      // Push de url naar de browser zodat je dezelfde pagina ziet als je de pagina refresht en een permalink kunt maken
      history.pushState(null, null, 'index.php?klas=' + klasOrig + '&week=' + weeknr);

      getStatus();
    });
  }

  $('.js-klas').on('keyup change', function() {
    // Haal de ingevoerde klassen op, haal alle spaties weg en vervang komma's door puntkomma's
    var input = $(this).val().replace(/\s+/g, '').replace(/,/g , ';').toLowerCase();
    console.log(input);

    if (input.length >= 2) {
      klasOrig = input;
      $('.js-intro').hide();
      roosterLaden(klasOrig, weeknr_huidig);
    }
    else {
      $('.js-intro').show();
    }
  });

  $('.js-vorige').on('click', function(e) {
    e.preventDefault();

    weeknr = weeknr - 1;

    if (weeknr == 00)
      weeknr = 52;

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

    if (weeknr == 53)
      weeknr = 01;

    roosterLaden(klasOrig, weeknr);
  });

});

