<a class="sluit-popup">&#215;</a>
<div class="row">
  <div class="small-15 columns">
    <h2>Vakanties</h2>
    <table>
      <thead>
        <tr>
          <th>Naam</th>
          <th>Begin</th>
          <th>Eind</th>
          <th>Dagen te gaan</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($vakanties as $vakNaam => $vak)
        <tr>
          <td>{{ $vakNaam }}</td>
          <td>{{ Bereken::DateFormatNaarEU($vak['start']) }}</td>
          <td>{{ Bereken::DateFormatNaarEU($vak['eind']) }}</td>
          <td>{{ Bereken::DagenTeGaan($vak['start']) }} dagen</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>
