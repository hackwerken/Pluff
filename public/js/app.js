// Lees status van de javascript variabelen op (handig om te testen)
function getStatus() {
  console.log('KlasOrig: ' + klasOrig);
  console.log('Weeknr: ' + weeknr);
  console.log('Weeknr volgende: ' + weeknr_volgende);
  console.log('Weeknr vorige: ' + weeknr_vorige);
  console.log('Weeknr huidig: ' + weeknr_huidig);
}

var everLoaded = false;

// Het daadwerkelijk laden van het rooster
function roosterLaden(klasOrig, weeknr) {
  // .rooster-actief aan <body> toevoegen, zodat we makkelijk dingen in de CSS kunnen veranderen
  $('body').addClass('rooster-actief');

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

      // Button laten zien op kleine schermen zodra er een rooster is geladen
      $('.js-alleszien:parent').addClass('show-for-small-only');

      // Alles weer laten zien indien nodig
      laatAllesZien();

      // Push de url naar de browser zodat je dezelfde pagina ziet als je de pagina refresht en een permalink kunt maken
      history.pushState(null, null, '/' + klasOrig + '/' + weeknr);
      everLoaded = true;

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

function roosterLink(input) {
  weeknr = weeknr_huidig;
  klasOrig = input;

  roosterLaden(input, weeknr_huidig);
  $('.js-klas').val(input);
}

function keyUpFix() {
  $(document).on('keyup', function(e) {
    // Pijl naar links (vorige week)
    if(e.keyCode === 37) {
      weeknr = weeknr - 1;

      // Week 0 bestaat niet, dus naar het vorige jaar gaan
      // TODO: Onderstaande code controleren
      if (weeknr === 0)
        weeknr = 52;

      roosterLaden(klasOrig, weeknr);
    }
    // Pijl naar rechts (volgende week)
    else if (e.keyCode === 39) {
      weeknr = weeknr + 1;

      // Het jaar is voorbij, dus weer opnieuw beginnen
      if (weeknr == 53)
        weeknr = 01;

      roosterLaden(klasOrig, weeknr);
    }

  });
}

function laatAllesZien() {
  if (allesZien === true) {
    $('.dag, .js-controls').removeClass('hide-for-small-only');
    $('.js-alleszien:parent').hide();
  }
}

$(function() {

  // getStatus();

  $('.js-klas').on('input', function() {
    clearTimeout($(this).data('timer'));

    var thisInput = $(this);

    // We maken gebruik van een timer, om overbodige AJAX requests te voorkomen en de server niet te misbruiken.
    // Dit zorgt ook voor betere performance.
    $(this).data('timer', setTimeout(function() {
      // Haal de ingevoerde klassen op, haal leading en trailing spaties weg en vervang komma's door puntkomma's
      var input = thisInput.val()
        .trim()
        .replace(/,/g , ';')
        .replace(/, /g , ';')
        .replace(/; /g , ';')
        .toLowerCase();
      // console.log(input);

      // Reset week naar huidige
      weeknr = weeknr_huidig;

      klasOrig = input;

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

  $('.hetrooster').on('click', '.js-roosterlink', function(e) {
    e.preventDefault();

    // Slashes verwijderen
    var input = $(this).attr('href').replace(/^\/|\/$/g, '');
    roosterLink(input);
  });

  // Gebruiker van een klein scherm eventueel alle dagen + knoppen laten zien
  $('.js-alleszien').on('click', function(e) {
    e.preventDefault();

    allesZien = true;
    laatAllesZien();
  });

  // Detecteren als er op een vorige of volgende knop wordt gedrukt
  // TODO: Deze functie werkt nog niet 100%. Nog controleren!
  $(window).on('popstate', function(e) {
    if (everLoaded) {
      // Link ophalen waarnaar genavigeerd wordt
      newLink = history.location || document.location;
      // Alleen de bruikbare informatie uit de link halen
      newLink = newLink.toString();
      newLink = newLink.split('/');
      weeknr = parseInt(newLink[4]);

      roosterLaden(newLink[3], weeknr);
    }
    everLoaded = true;
  });

  keyUpFix();
});
