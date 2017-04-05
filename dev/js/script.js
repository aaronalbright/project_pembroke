var $ = jQuery = require('jquery');
var d3 = require('./d3.min.js');
require('./bootstrap.min.js');
var Handlebars = require('handlebars');

$(document).ready(function() {

$('.dest').hide();

var warningData;

handles();

// builds handlebar templates
function handles(){
  if ($('#warning-icons').length>0) {
  $.getJSON('/data/warningLights.json', function(data) {
    var iconList = $('#warning-icons').html();
    var iconScript = Handlebars.compile(iconList);

    $('#icon-content').append(iconScript(data));
    });
  }
}

var warnFilename;

// shows content
$('#icon-content').on('click', 'span', function() {
    $('.warning-title').html($(this).data('warning'));
    $('.warning-meaning').html($(this).data('meaning'));
    $('.warning-what').html($(this).data('what'));
    $('.warning-why').html($(this).data('why'));
    warnFilename = $(this).data('filename');
    $('.icondest').addClass(warnFilename);
    // $('#icon-content').hide();
    // $('nav').hide();
    $('<div id="chart"></div>').insertAfter('.why');
    $('<div id="chart2"></div>').insertAfter('#chart');
    $('.dest').show();
    pieInit();
    chartInit();
  });

// hides content
$('.dest').on('click', 'a', function() {
  // $('#icon-content').show();
  $('#chart').remove();
  $('#chart2').remove();
  // $('nav').show();
  // $('.dest').hide();
  $('.icondest').removeClass(warnFilename);
})

});


// builds D3 pie chart
function pieInit(){
  var piedata = [];

  d3.json('data/data.json', function(data) {

      for (key in data) {
        piedata.push(data[key])
      }

      var width = 300,
          height = 300,
          radius = Math.min(width, height) / 2,
          colors = d3.scale.linear()
                  .domain([0, 10])
                  .range(['#00C851', '#ff3d00']);

      var pie = d3.layout.pie()
          .value(function(d) {
            return d.value;
          })

      var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20);

      var myChart = d3.select('#chart').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate('+(width-radius)+','+(height-radius)+')')
          .selectAll('path').data(pie(piedata))
          .enter().append('g')
              .attr('class','slice')

      var slices = d3.selectAll('g.slice')
              .append('path')
              .attr ('fill', function(d, i){
                return colors(i);
              })
              .attr('d', arc)

      var text = d3.selectAll('g.slice')
            .append('text')
            .text(function(d, i) {
            return d.data.value + "%"
            })
            .attr('text-anchor', 'middle')
            .attr('fill','white')
            .attr('transform', function(d){
              d.innerRadius = 0;
              d.outerRadius = radius;
              return 'translate('+ arc.centroid(d)+')'
            })
  });
}

function chartInit() {
  var bardata = [];

  var w = 500,
      barH = 30;

  var x = d3.scale.linear()
      .range([0, w]);

  var myChart = d3.select('#chart2').append('svg')
      .attr('width', w);

  d3.json('data/cost.json', function(error, data) {

    for (j in data) {
      bardata.push(data[j])
    }
    var dataYear = bardata.map(function(o){return o.year}),
        dataCost = bardata.map(function(o){return o.cost});

    x.domain([0, d3.max(dataCost)]);

    var tempColor;

    var colors = d3.scale.linear()
      .domain([0, dataCost.length])
      .range(['#ff3d00', '#00C851']);

    // var y = d3.scale.ordinal()
    //       .domain(d3.range(0, dataCost.length))
    //       .rangeBands([0, h], 0.2);

    myChart.attr('height', barH * dataCost.length);

    var bar = myChart.selectAll('g')
        .data(dataCost)
        .enter().append('g')
        .attr("transform", function(d, i) { return "translate(0," + i * barH + ")"; });

      bar.append('rect')
          .style('fill', function(d,i) {
              return colors(i);
          })
          .attr('height', barH - 1)
          // .attr('y', function(d,i) {
          //     return y(i);
          // })
          .attr('width', function(d) { return x(d); })
          // .attr('x', 0)
      bar.append("text")
        .attr("x", function(d) { return x(d) - 3; })
        .attr("y", barH / 2)
        .attr("dy", ".35em")
        .text(function(d) { return "$"+d; });

      bar.on('mouseover', function(d) {

          tempColor = this.style.fill;
          d3.select(this)
              .style('opacity', .5)
      });

      bar.on('mouseout', function(d) {
          d3.select(this)
              .style('opacity', 1)
              .style('fill', tempColor)
      });
    // bar.transition()
    // .attr('width', function(d) {
    // return x(d);
    // })
    // .attr('x', 0)
    // .delay(function(d, i) {
    // return i * 5;
    // })
    // .duration(500)

    });
}
