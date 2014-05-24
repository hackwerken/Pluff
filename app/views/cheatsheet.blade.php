<a class="sluit-popup">&#215;</a>
<div class="row">
  <div class="small-5 columns">
    <h2>@lang('site.cheatsheet_classes')</h2>
    <p class="cheats cheats-klassen">
      @foreach ($klassen as $klas)
      <a href="#" class="cheat-link">{{ $klas }}</a><br>
      @endforeach
    </p>
  </div>
  <div class="small-5 columns">
    <h2>@lang('site.cheatsheet_teachers')</h2>
    <p class="cheats cheats-docenten">
      @foreach ($docenten as $docent)
      <a href="#" class="cheat-link">{{ $docent }}</a><br>
      @endforeach
    </p>
  </div>
  <div class="small-5 columns">
    <h2>@lang('site.cheatsheet_locals')</h2>
    <p class="cheats cheats-lokalen">
      @foreach ($lokalen as $lokaal)
      <a href="#" class="cheat-link">{{ $lokaal }}</a><br>
      @endforeach
    </p>
  </div>
</div>
