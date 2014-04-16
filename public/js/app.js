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
      $.get('/rooster/' + klasOrig + '/' + weeknr, function(data) {
        // Opgehaalde rooster in de DOM zetten
        $('.hetrooster').html(data);

        // Weeknummer en klas vervangen in de header
        $('.js-weeknr-show').text(weeknr);
        $('.js-klas-show').text(klasOrig.replace(/;/g , ', '));

        // Permalink laten zien
        $('.js-permalink-toggle').show();
        var nieuweUrl = appUrl + '/' + klasOrig;
        $('.js-permalink').text(nieuweUrl).attr('href', nieuweUrl);

        $('.js-alleszien:parent').addClass('show-for-small-only');

        // Push de url naar de browser zodat je dezelfde pagina ziet als je de pagina refresht en een permalink kunt maken
        history.pushState(null, null, '/' + klasOrig + '/' + weeknr);

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

  $('.js-klas').on('input', function() {
    clearTimeout($(this).data('timer'));

    var thisInput = $(this);

    // We maken gebruik van een timer, om overbodige AJAX requests te voorkomen en de server niet te misbruiken.
    // Dit zorgt ook voor betere performance.
    $(this).data('timer', setTimeout(function() {
      // Haal de ingevoerde klassen op, haal alle spaties weg en vervang komma's door puntkomma's
      var input = thisInput.val().replace(/\s+/g, '').replace(/,/g , ';').toLowerCase();
      // console.log(input);

      // Reset week naar huidige
      weeknr = weeknr_huidig;

      klasOrig = input;

      // .rooster-actief aan <body> toevoegen, zodat we makkelijk dingen in de CSS kunnen veranderen
      $('body').addClass('rooster-actief');

      roosterLaden(klasOrig, weeknr_huidig);
    }, 400));
  });

  $('.js-vorige').on('click', function(e) {
    e.preventDefault();

    weeknr = weeknr - 1;

    // Week 0 bestaat niet, dus naar het vorige jaar gaan
    // TODO: Onderstaande code controleren
    if (weeknr === 0)
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

  // Gebruiker van een klein scherm eventueel alle dagen + knoppen laten zien
  $('.js-alleszien').on('click', function(e) {
    e.preventDefault();
    $('.dag, .js-controls').removeClass('hide-for-small-only');
    $('.js-alleszien:parent').hide();
  });


  // POPUP
  function popupOpenen() {
    $.get('/cheatsheet', function(data) {
      // Opgehaalde cheatsheet in de DOM zetten
      $('.popup').html(data);
      $('.popup-achtergrond').fadeIn(200);
      $('.popup').fadeIn(200);
    });

    $(document).on('keyup', function(e) {
      if(e.keyCode === 27) {
        popupSluiten();
        $(document).off('keyup');
      }
    });
  }

  function popupSluiten() {
    $('.popup-achtergrond').fadeOut(200);
    $('.popup').fadeOut(200);
  }

  $('.js-btn-cheatsheet').on('click', function(e) {
    e.preventDefault();

    popupOpenen();
  });

  $('.popup').on('click', '.sluit-popup', function(e) {
    e.preventDefault();

    popupSluiten();
  });

  $('.popup').on('click', '.cheat-link', function(e) {
    e.preventDefault();

    var input = $(this).text();

    weeknr = weeknr_huidig;
    klasOrig = input;
    $('body').addClass('rooster-actief');

    roosterLaden(input, weeknr_huidig);
    $('.js-klas').val(input);

    popupSluiten();
  });

});
