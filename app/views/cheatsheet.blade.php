<div class="cheats-docenten">
  @foreach ($docenten as $docent)
    {{ $docent['docent'] }}<br>
  @endforeach
</div>

<div class="cheats-lokalen">
  @foreach ($lokalen as $lokaal)
    {{ $lokaal['lokaal'] }}<br>
  @endforeach
</div>
