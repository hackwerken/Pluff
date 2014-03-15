@if (!empty($klas))
  <div class="row">
    @foreach($cDagen as $dagnr => $dagNaam)
      <div class="medium-3 columns">
        <div class="dag {{ (Bereken::getHuidigeDag($weeknr, $dagnr)) ? 'huidige-dag' : 'andere-dag' }}">
          <div class="naam">
            <h4>{{ $dagNaam }}</h4>
            <b class="datum">
              {{ date('d-m', Bereken::getTimestampVanWeeknrDagnr($weeknr, $dagnr)) }}
            </b>
          </div>

          @foreach (Bereken::getTijdenMin1() as $uurnr => $uurtijd)
            <?php $uurArray = Rooster::getUur($weeknr, $dagnr, $uurnr, $klas); ?>
            @if ($uurArray)
              <div class="uur">
                <div class="uur-nummer">{{ $uurnr }}</div>
                @foreach ($uurArray as $uur)
                  @if ($uur)
                    <b>{{ date('H:i', strtotime($uur['tijdstip_begin'])) }} - {{ date('H:i', strtotime($uur['tijdstip_eind'])) }}</b><br>
                    {{ $uur['vak'] }} - {{ $uur['docent'] }}<br>
                    <small>{{ $uur['lokaal'] }} - {{ $uur['klas'] }}</small><br>
                  @endif
                @endforeach
              </div>
            @else
              <div class="uur uur-leeg">
                <div class="uur-nummer"> {{ $uurnr }}</div>
              </div>
            @endif
            <hr class="{{ ($uurnr === 14) ? 'hide' : '' }}">
          @endforeach
        </div>
      </div>
    @endforeach
  </div>
@endif
