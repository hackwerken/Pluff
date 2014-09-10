<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="nl" >

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Pluff | @lang('site.page_title')</title>

  <link rel="stylesheet" href="/css/graph.css?0d2660">

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
  <div class="wrapper">
    <div class="row">
      <div class="small-15 large-9 columns">
        <h3 class="caption">Vakkenmeter van {{{ $klas }}}<br><small>klik op de vakken die je niet volgt en zie welke vakken je het meest hebt!</small></h3>
        <svg class="vakpercentage"></svg>
      </div>
      <div class="small-15 large-6 columns">
        <p class="big-p">
          Je hebt nog <strong>{{{ $lessenTeGaan }}}</strong> lessen tot het einde van deze periode.
          Dat is gemiddeld <strong>{{{ round($lessenGemiddeld, 2) }}}</strong> uur les per dag!
        </p>
      </div>
    </div>

    <script src="/js/vendor/jquery.js?97d540"></script>
    <script>
      window.appUrl = "{{ url() }}";
      window.klas = "{{ $klas }}";
    </script>

    @if (App::environment('local'))
    <script src="/bower_components/d3/d3.min.js?a31dbc"></script>
    <script src="/bower_components/nvd3/nv.d3.min.js?88799e"></script>
    <script src="/js/graph-klas.js?6c0f29"></script>
    <!-- LiveReload script -->
    <!-- <script>document.write('<script src="http://192.168.1.100:35729/livereload.js?snipver=1"></' + 'script>')</script> -->
    @else
    <script src="/js/all.js?2d0aef"></script>
    @endif
  </div>
</body>
</html>
