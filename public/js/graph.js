  // $.getJSON(appUrl + '/graph/docentlessen', function(json) {

  //   var data = [];

  //   $.each(json, function(docent, lessen) {
  //     data.push([docent, lessen]);
  //   });

  //   console.log(data);
  // });

function klasStatsLaden(input) {
    $('.klassen-lijst, .klassen-lijst-meer').fadeOut(200);
    $('.js-klas-stats').load(appUrl + '/graph/klas/' + input + ' .wrapper', function() {
      window.klas = input;
      $.getScript(appUrl + '/js/graph-klas.js');
    });
}

$(function() {
  $.getJSON(appUrl + '/jsoninput', function(data) {
    items = data.map(function(x) { return { item: x }; });

    $select = $('.js-klas').selectize({
        maxItems: 1,
        create: false,
        openOnFocus: false,
        options: items,
        selectOnTab: true,
        hideSelected: true,
        persist: false,
        labelField: 'item',
        valueField: 'item',
        searchField: 'item',
        plugins: ['remove_button'],
        onItemAdd: function() {
          // Sluit het dropdown menu na het toevoegen van een item
          selectize.close();
        },
        onChange: function(input) {
          klasStatsLaden(input);
        }
      });
    selectize = $select[0].selectize;
  });

  $('.klassen-lijst-meer').on('click', function(e) {
    e.preventDefault();

    $('.klassen-lijst').addClass('meerder');
    $('.klassen-lijst li').removeClass('hide');
    $(this).fadeOut();
  });

  $('.js-klasklik').on('click', function(e) {
    e.preventDefault();
    var input = $(this).data('klas');
    console.log(input);
    klasStatsLaden(input);
  });
});


// Drukmeter
$.getJSON(appUrl + '/graph/weeklessen/nv3', function(json) {
  nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(false)
        .transitionDuration(1500)
        ;

        chart.yAxis
            .axisLabel('Aantal lessen')
            .tickFormat(d3.format('d'))
            ;

    d3.select('.druktemeter svg')
        .datum([ json ])
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
});

// Totaal lessen meter
$.getJSON(appUrl + '/graph/totaallessen/nv3', function(json) {
  nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(false)
        .transitionDuration(1500)
        ;

        chart.yAxis
            .axisLabel('Aantal lessen')
            .tickFormat(d3.format('d'))
            ;

    d3.select('.totaalmeter svg')
        .datum([ json ])
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
});

// Docenten meter
var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select('.bubbles').append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .attr('class', 'bubble');

d3.json(appUrl + '/graph/docentlessen/d3', function(error, root) {
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style('fill', function(d) { return color(d.packageName); });

  node.append("text")
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style('height', diameter + 'px');
