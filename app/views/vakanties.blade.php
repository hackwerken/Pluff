<a class="sluit-popup">&#215;</a>
<div class="row">
  <div class="small-15 columns">
    <h2>@lang('site.holidays')</h2>
    <table>
      <thead>
        <tr>
          <th>@lang('site.holidays_heading_name')</th>
          <th>@lang('site.holidays_heading_start')</th>
          <th>@lang('site.holidays_heading_end')</th>
          <th>@lang('site.holidays_heading_daystogo')</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($vakanties as $vakNaam => $vak)
        <tr>
          <td>{{ $vakNaam }}</td>
          <td>{{ Bereken::DateFormatNaarEU($vak['start']) }}</td>
          <td>{{ Bereken::DateFormatNaarEU($vak['eind']) }}</td>
          <td>{{ Bereken::DagenTeGaan($vak['start']) }} @lang('site.holidays_days')</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>
