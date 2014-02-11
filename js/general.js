$(function() {

  $('.js-klas').keyup(function() {
    var tekst = $(this).val();
    console.log(tekst);

    $.get('klas.php?klas=' + tekst, function(data) {
      $('.hetrooster').html(data);

      console.log('Rooster is succesvol ingeladen.');
    });
  });

});

