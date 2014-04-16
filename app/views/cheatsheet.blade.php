<a class="sluit-popup">&#215;</a>
<div class="row">
  <div class="small-5 columns">
    <h2>Klassen</h2>
    <p class="cheats cheats-klassen">
      @foreach ($klassen as $klas)
        <a href="#" class="cheat-link">{{ $klas['klas'] }}</a><br>
      @endforeach
    </p>
  </div>
  <div class="small-5 columns">
    <h2>Docenten</h2>
    <p class="cheats cheats-docenten">
      @foreach ($docenten as $docent)
        <a href="#" class="cheat-link">{{ $docent['docent'] }}</a><br>
      @endforeach
    </p>
  </div>
  <div class="small-5 columns">
    <h2>Lokalen</h2>
    <p>
      <em>Je kunt voorlopig nog niet op lokalen zoeken</em>
    </p>
    <p class="cheats cheats-lokalen">
      @foreach ($lokalen as $lokaal)
        <a href="#" class="cheat-link">{{ $lokaal['lokaal'] }}</a><br>
      @endforeach
    </p>
  </div>
</div>
