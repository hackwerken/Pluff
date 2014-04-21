function popupOpenen(url) {
  $.get('/' + url, function(data) {
    // Opgehaalde cheatsheet in de DOM zetten
    $('.popup').html(data);
    $('.popup-achtergrond').fadeIn(200);
    $('.popup').fadeIn(200);
  });

  $(document).on('keyup', function(e) {
    if(e.keyCode === 27)
      popupSluiten();
  });
}

function popupSluiten() {
  $('.popup-achtergrond').fadeOut(200);
  $('.popup').fadeOut(200);
  $(document).off('keyup');
  keyUpFix();
}

$(function() {

  $('.js-popup').on('click', function(e) {
    e.preventDefault();

    var url = $(this).attr('href');
    popupOpenen(url);
  });

  $('.popup').on('click', '.sluit-popup', function(e) {
    e.preventDefault();

    popupSluiten();
  });

  $('.popup').on('click', '.cheat-link', function(e) {
    e.preventDefault();

    roosterLink($(this).text());
    popupSluiten();
  });
});
