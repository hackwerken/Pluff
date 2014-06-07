<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="nl" >

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Pluff | @lang('site.page_title')</title>

  <link rel="stylesheet" href="/css/app.css?2b71bc">

  <script src="/js/pace.js?e9f4e5" data-pace-options='{ "restartOnRequestAfter": false }'></script>

  <link rel="apple-touch-icon" sizes="57x57" href="/img/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/img/apple-touch-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/img/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/img/apple-touch-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/img/apple-touch-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/img/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/img/apple-touch-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/img/apple-touch-icon-152x152.png">
  <link rel="icon" type="image/png" href="/img/favicon-196x196.png?b17708" sizes="196x196">
  <link rel="icon" type="image/png" href="/img/favicon-160x160.png?7f3779" sizes="160x160">
  <link rel="icon" type="image/png" href="/img/favicon-96x96.png?6b24d7" sizes="96x96">
  <link rel="icon" type="image/png" href="/img/favicon-16x16.png?0aadfd" sizes="16x16">
  <link rel="icon" type="image/png" href="/img/favicon-32x32.png?4696d7" sizes="32x32">

  <meta name="msapplication-TileColor" content="#00aba9">
  <meta name="msapplication-TileImage" content="/img/mstile-144x144.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <meta name="description" content="Pluff laat je op een snelle manier je Fontys rooster zien. Sla het op in je bladwijzers en kijk met 1 klik je rooster terug!">
  <meta property="og:title" content="Pluff - Check je Fontys rooster!">
  <meta property="og:image" content="/img/logo.png">
  <meta property="og:type" content="website">
  <meta property="og:description" content="Pluff laat je op een snelle manier je Fontys rooster zien. Sla het op in je bladwijzers en kijk met 1 klik je rooster terug!">
  <meta property="og:url" content="{{ url() }}">

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
        <h2>@lang('site.sub_heading')</h2>
        <hr>
        <h3 class="klas-week-info">
          <span class="js-klas-show">{{ $klasHuman or '' }}</span> &ndash;
          @lang('site.week') <span class="js-weeknr-show">{{ $weeknr }}</span>
        </h3>
      </div>
    </div>
  </div>
  <div class="row controls">
    <div class="small-15 medium-5 columns">
      <a href="/{{ $klasOrig }}/{{ $weeknrVorige }}" class="button button-fullwidth vorige-week js-vorige"><span class="pijl">&lt;</span> @lang('site.last_week')</a>
    </div>
    <div class="small-15 medium-5 text-center-large columns">
      <a href="/{{ $klasOrig }}/{{ $weeknrHuidig }}" class="button button-fullwidth huidige-week js-huidige">@lang('site.current_week')</a>
    </div>
    <div class="small-15 medium-5 columns">
      <a href="/{{ $klasOrig }}/{{ $weeknrVolgende }}" class="button button-fullwidth volgende-week js-volgende">@lang('site.next_week') <span class="pijl">&gt;</span></a>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <div class="intro">
        <p>
          @lang('site.intro_paragraph')
        </p>
      </div>

      <input type="text" value="{{ $klasOrig }}" placeholder="@lang('site.input_placeholder')" autocapitalize="off" autocorrect="off" spellcheck="false" class="js-klas">

      <div class="js-messages">
        <div class="hide alert-box radius js-ajax-error">
          <strong>Oops!</strong> @lang('site.error_loading')
        </div>
      </div>

      <div class="hetrooster">
        @include('rooster')
      </div>
    </div>
  </div>
  <div class="row">
    <div class="small-15 columns">
      <div class="permalink hide js-permalink-toggle panel">
        <b>@lang('site.permalink'):</b> <a href="#" class="js-permalink"></a>
      </div>
    </div>
  </div>
  
  <div class="row alles-zien">
    <div class="small-15 columns">
      <a href="#" class="button button-fullwidth js-alleszien">@lang('site.show_everything')</a>
    </div>
  </div>

  <div class="buttons-fixed">
    <a href="cheatsheet" class="button-fixed js-popup">@lang('site.cheatsheet')</a>
    <a href="vakanties" class="button-fixed js-popup">@lang('site.holidays')</a>
  </div>

  <footer>
    <div class="row">
      <div class="small-15 columns">
        <p>
          <em>Pluff</em> {{ Config::get('rooster.versie') }}.
          @lang('site.choose_lang')
          @foreach (Config::get('app.provided_locales') as $locale)
          <a href="{{ url('lang/'.$locale) }}">{{ strtoupper($locale) }}</a>
          @endforeach
          .
          @lang('site.footer_credits')
        </p>
      </div>
    </div>
  </footer>

  <div class="popup hide"></div>
  <div class="popup-achtergrond hide"></div>

  <script src="/js/vendor/jquery.js?97d540"></script>
  <script>
    window.weeknr = {{ $weeknr }};
    window.weeknrVolgende = {{ $weeknrVolgende }};
    window.weeknrVorige = {{ $weeknrVorige }};
    window.weeknrHuidig = {{ $weeknrHuidig }};
    window.appUrl = "{{ url() }}";
    window.klasOrig = "{{ $klasOrig }}";
    window.allesZien = false;
  </script>

  @if (App::environment('local'))
  <script src="/js/app.js?9f703d"></script>
  <script src="/js/popup.js?a50b21"></script>
  <script src="/js/vendor/selectize.min.js?fc5960"></script>
  <!-- LiveReload script -->
  <!-- <script>document.write('<script src="http://192.168.1.100:35729/livereload.js?snipver=1"></' + 'script>')</script> -->
  @else
  <script src="/js/all.js?2d0aef"></script>
  @endif
</body>
</html>
