$(function() {

  // Lees status van de javascript variabelen op (handig om te testen)
  function getStatus() {
    console.log('KlasOrig: ' + klasOrig);
    console.log('Weeknr: ' + weeknr);
    console.log('Weeknr volgende: ' + weeknr_volgende);
    console.log('Weeknr vorige: ' + weeknr_vorige);
    console.log('Weeknr huidig: ' + weeknr_huidig);
  }

  getStatus();

  // Het daadwerkelijk laden van het rooster
  function roosterLaden(klasOrig, weeknr) {
    if (klasOrig && weeknr) {
      weeknr_volgende = weeknr + 1;
      weeknr_vorige = weeknr - 1;

      // console.log('Laden...');
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
        history.pushState(null, null, '?klas=' + klasOrig + '&week=' + weeknr);

        getStatus();
      });
    }
    // De hele zooi resetten als er geen klas en week zijn ingevuld
    else {
      $('.js-klas').val('');
      $('.js-permalink-toggle').hide();
      $('.hetrooster').html('');
      $('body').removeClass('rooster-actief');
      $('.js-weeknr-show').text(weeknr_huidig);
      $('.js-klas-show').text('');
      history.pushState(null, null, '/');
    }
  }

  $('.js-klas').on('keyup change', function() {
    // Haal de ingevoerde klassen op, haal alle spaties weg en vervang komma's door puntkomma's
    var input = $(this).val().replace(/\s+/g, '').replace(/,/g , ';').toLowerCase();
    // console.log(input);

    // Reset week naar huidige
    weeknr = weeknr_huidig;

    klasOrig = input;
    // .rooster-actief aan <body> toevoegen, zodat we makkelijk dingen in de CSS kunnen veranderen
    $('body').addClass('rooster-actief');
    roosterLaden(klasOrig, weeknr_huidig);
  });

  $('.js-vorige').on('click', function(e) {
    e.preventDefault();

    weeknr = weeknr - 1;

    // Week 0 bestaat niet, dus naar het vorige jaar gaan
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

    // Het jaar is voorbij, dus weer opnieuw beginnen
    if (weeknr == 53)
      weeknr = 01;

    roosterLaden(klasOrig, weeknr);
  });

  $('.js-home').on('click', function(e) {
    e.preventDefault();

    roosterLaden(null, null);
  });

});
