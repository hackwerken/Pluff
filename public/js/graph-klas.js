// Vakpercentage

$.getJSON(appUrl + '/graph/vakpercentage/' + klas, function(json) {
  nv.addGraph(function() {
      var width = 500,
          height = 500;

      var chart = nv.models.pieChart()
          .x(function(d) { return d.label; })
          .y(function(d) { return d.y; })
          .color(d3.scale.category10().range())
          .width(width)
          .height(height);

        d3.select('.vakpercentage')
            .datum(json)
          .transition().duration(1200)
            .attr('width', width)
            .attr('height', height)
            .call(chart);

      chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

      return chart;
  });
});
