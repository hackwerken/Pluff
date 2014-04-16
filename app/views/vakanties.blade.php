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
        </tr>
      </thead>
      <tbody>
        @foreach ($vakanties as $vakNaam => $vak)
        <tr>
          <td>{{ $vakNaam }}</td>
          <td>{{ $vak['start'] }}</td>
          <td>{{ $vak['eind'] }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>
