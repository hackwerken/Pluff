<!DOCTYPE html>
<html class="no-js" lang="nl" >

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Pluff | @lang('site.page_title')</title>

  <link rel="stylesheet" href="/css/graph.css?e05fc4">

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
</head>
<body>

  <div class="row">
    <div class="small-15 columns">
      <h3 class="caption">Check je klas<br><small>vul hieronder je klas in en zie de statistieken</small></h3>
      <input type="text" value="" placeholder="Vul een klas in" autocapitalize="off" autocorrect="off" spellcheck="false" class="js-klas">

      <ul class="small-block-grid-3 medium-block-grid-7 klassen-lijst">
        @foreach ($klassen as $nummer => $klas)
          <li {{ ($nummer > 20) ? 'class="hide"' : ''}}>
            <a href="#" data-klas="{{{ $klas }}}" class="js-klasklik" style="background: #{{{ Bereken::stringNaarKleurenCode($klas) }}}">
              {{{ $klas }}}
            </a>
          </li>
        @endforeach
      </ul>

      <a href="#" class="klassen-lijst-meer">Meer &rang;</a>
    </div>
  </div>

  <div class="js-klas-stats"></div>

  <div class="row">
    <div class="small-15 columns">
      <h3 class="caption">Druktemeter<br><small>het aantal lessen van deze week, per dag</small></h3>
    </div>
  </div>

  <div class="druktemeter">
    <svg></svg>
  </div>

  <div class="totaalmeter">
    <svg></svg>
  </div>

  <div class="row">
    <div class="small-15 columns">
      <h3 class="caption">Docenten bubble<br><small>grootte gebaseerd op het aantal lessen</small></h3>
    </div>
  </div>

  <div class="bubbles">
    <div class="bubbles-toplijst">
      <h4>Meest gewerkte docenten</h4>
      <ol>
        @foreach ($docentenToplijst as $docent)
          <li>{{{ $docent['docent'] }}} <small>{{{ $docent['lessen'] }}} lessen</small></li>
        @endforeach
      </ol>
    </div>

  </div>

  <script src="/js/vendor/jquery.js?97d540"></script>
  <script>
    window.appUrl = "{{ url() }}";
  </script>

  @if (App::environment('local'))
  <script src="/bower_components/d3/d3.min.js?a31dbc"></script>
  <script src="/bower_components/nvd3/nv.d3.min.js?88799e"></script>
  <script src="/js/vendor/selectize.min.js?fc5960"></script>
  <script src="/js/graph.js?c156c4"></script>
  <!-- LiveReload script -->
  <!-- <script>document.write('<script src="http://192.168.1.100:35729/livereload.js?snipver=1"></' + 'script>')</script> -->
  @else
  <script src="/js/all-graph.js?f1e14a"></script>
  @endif
</body>
</html>
