<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="nl" >

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Fontys Rooster</title>

  <link rel="stylesheet" href="/css/app.css">
  <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Quicksand:300,400">

  <script src="/js/vendor/modernizr.js"></script>

  <link rel="apple-touch-icon" sizes="57x57" href="/img/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/img/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/img/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/img/apple-touch-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/img/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/img/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/img/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/img/apple-touch-icon-152x152.png">
  <link rel="icon" type="image/png" href="/img/favicon-196x196.png" sizes="196x196">
  <link rel="icon" type="image/png" href="/img/favicon-160x160.png" sizes="160x160">
  <link rel="icon" type="image/png" href="/img/favicon-96x96.png" sizes="96x96">
  <link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16">
  <link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32">

  <meta name="msapplication-TileColor" content="#00aba9">
  <meta name="msapplication-TileImage" content="/img/mstile-144x144.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

</head>
<body class="{{ (!empty($klas)) ? 'rooster-actief' : '' }}">
  <!--[if lt IE 9]>
    <div class="slechtebrowser">
      <p>
        Het lijkt erop dat je Internet Explorer 8 of lager gebruikt. Het internet gaat snel vooruit, maar toch komt je browser nog uit het jaar 2009. We zitten nu in 2014. Dit kan toch niet?
      </p>
      <p>
        Ik adviseer je sterk om een goede internetbrowser zoals <a href="https://www.google.nl/intl/nl/chrome/browser/">Chrome</a> of <a href="https://www.mozilla.org/nl/firefox/">Firefox</a> te downloaden. Bezoek daarna mijn site en check het verschil!
      </p>
    </div>
  <![endif]-->

  <div class="row">
    <div class="small-15 columns">
      <div class="header">
        <h1 class="logo js-home"><a href="#">Pluff.</a></h1>
        <h2>Studentenrooster</h2>
        <hr>
        <h3>
          Klas <span class="js-klas-show">{{ $klasHuman or '' }}</span> &ndash;
          Week <span class="js-weeknr-show">{{ $weeknr }}</span>
        </h3>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="small-15 medium-5 columns">
      <a href="?klas={{ $klasOrig }}&week={{ $weeknr_vorige }}" class="button vorige-week js-vorige"><span class="pijl">&lt;</span> Vorige week</a>
    </div>
    <div class="small-15 medium-5 text-center-large columns">
      <a href="?klas={{ $klasOrig }}&week={{ $weeknr_huidig }}" class="button huidige-week js-huidige">Huidige week</a>
    </div>
    <div class="small-15 medium-5 columns">
      <a href="?klas={{ $klasOrig }}&week={{ $weeknr_volgende }}" class="button volgende-week js-volgende">Volgende week <span class="pijl">&gt;</span></a>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <div class="intro">
        <h3>Rooster</h3>
        <p>
          Hieronder kun je je klas van Fontys invoeren. Zit je in meerdere klassen? Scheid deze dan met een puntkomma.
          Je kunt hierna onderaan de pagina de &lsquo;permalink&rsquo; kopi&euml;ren en hier eventueel een bladwijzer van maken.
        </p>
        <p>
          <strong>Note:</strong> Je kunt hier alleen gebruik van maken als je op de Fontys ICT opleiding zit. We zijn nog bezig met andere opleidingen toevoegen.
        </p>
      </div>

      <input type="text" value="{{ $klasOrig }}" placeholder="Vul een of meerdere klassen in (puntkommmagescheiden)" class="js-klas">

      <div class="hetrooster">
        @include('rooster')
      </div>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <div class="permalink hide js-permalink-toggle panel">
        <b>Permalink:</b> <a href="#" class="js-permalink"></a>
      </div>
    </div>
  </div>


  <footer>
    <div class="row">
      <div class="small-15 columns">
        <p>
          <em>Pluff</em> BETA Versie.
          Ervaren coder? Help ons mee via <a href="https://github.com/SpaceK33z/FHICT-Rooster">Github</a>!
        </p>
      </div>
    </div>
  </footer>

  <script src="/js/vendor/jquery.js"></script>
  <script>
    window.weeknr = {{ $weeknr }};
    window.weeknr_volgende = {{ $weeknr_volgende }};
    window.weeknr_vorige = {{ $weeknr_vorige }};
    window.weeknr_huidig = {{ $weeknr_huidig }};
    window.klasOrig = "{{ $klasOrig }}";
  </script>
  <script src="/js/app.js"></script>

  <!-- LiveReload script -->
  <script>document.write('<script src="http://192.168.0.193:35729/livereload.js?snipver=1"></' + 'script>')</script>
</body>
</html>
