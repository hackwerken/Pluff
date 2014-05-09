// Lees status van de javascript variabelen op (handig om te testen)
function getStatus() {
  console.log('KlasOrig: ' + klasOrig);
  console.log('Weeknr: ' + weeknr);
  console.log('Weeknr volgende: ' + weeknrVolgende);
  console.log('Weeknr vorige: ' + weeknrVorige);
  console.log('Weeknr huidig: ' + weeknrHuidig);
}

var everLoaded = false;

// Het daadwerkelijk laden van het rooster
function roosterLaden(klasOrig, weeknrInput) {
  // .rooster-actief aan <body> toevoegen, zodat we makkelijk dingen in de CSS kunnen veranderen
  $('body').addClass('rooster-actief');

  if (klasOrig && weeknrInput) {

    // console.log('Laden...');
    $.get('/rooster/' + klasOrig + '/' + weeknrInput, function(data) {

      // Pas als het rooster succesvol geladen is de nieuwe global vars invoeren
      weeknr = weeknrInput;
      weeknrVolgende = weeknr + 1;
      weeknrVorige = weeknr - 1;

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

      // Foutmelding verbergen
      $('.js-ajax-error').hide();

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
    $('.js-weeknr-show').text(weeknrHuidig);
    $('.js-klas-show').text('');
    history.pushState(null, null, '/');
  }
}

function roosterLink(input) {
  klasOrig = input;

  roosterLaden(input, weeknrHuidig);
  $('.js-klas').val(input);
}

function keyUpFix() {
  $(document).on('keyup', function(e) {
    // Pijl naar links (vorige week)
    if(e.keyCode === 37) {
      weeknrInput = weeknr - 1;

      // Week 0 bestaat niet, dus naar het vorige jaar gaan
      // TODO: Onderstaande code controleren
      if (weeknrInput === 0)
        weeknrInput = 52;

      roosterLaden(klasOrig, weeknrInput);
    }
    // Pijl naar rechts (volgende week)
    else if (e.keyCode === 39) {
      weeknrInput = weeknr + 1;

      // Het jaar is voorbij, dus weer opnieuw beginnen
      if (weeknrInput == 53)
        weeknrInput = 01;

      roosterLaden(klasOrig, weeknrInput);
    }

  });
}

function laatAllesZien() {
  if (allesZien === true) {
    $('.dag, .controls').removeClass('hide-for-small-only');
    $('.js-alleszien:parent').hide();
  }
}

$(function() {

  // getStatus();

  $(document).ajaxError(function() {
    $('.js-ajax-error').show();
  });

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
        .replace(new RegExp('^[;]+'), '') // Strip 'loze' puntkomma aan het begin
        .replace(new RegExp('[;]+$'), '') // Strip 'loze' puntkomma aan het eind
        .toLowerCase();
      // console.log(input);

      klasOrig = input;

      roosterLaden(klasOrig, weeknrHuidig);
    }, 400));
  });

  $('.js-vorige').on('click', function(e) {
    e.preventDefault();

    weeknrInput = weeknr - 1;

    // Week 0 bestaat niet, dus naar het vorige jaar gaan
    // TODO: Onderstaande code controleren
    if (weeknrInput === 0)
      weeknrInput = 52;

    roosterLaden(klasOrig, weeknrInput);
  });

  $('.js-huidige').on('click', function(e) {
    e.preventDefault();

    roosterLaden(klasOrig, weeknrHuidig);
  });

  $('.js-volgende').on('click', function(e) {
    e.preventDefault();

    weeknrInput = weeknr + 1;

    // Het jaar is voorbij, dus weer opnieuw beginnen
    if (weeknrInput == 53)
      weeknrInput = 01;

    roosterLaden(klasOrig, weeknrInput);
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
      weeknrInput = parseInt(newLink[4]);

      roosterLaden(newLink[3], weeknrInput);
    }
    everLoaded = true;
  });

  keyUpFix();
});
