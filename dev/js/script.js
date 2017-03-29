var $ = jQuery = require('jquery');
var d3 = require('./d3.min.js');
var smoothState = require('./smoothState.min.js');
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

var warnFilename = '';

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
    $('.dest').show();
  });

// hides content
$('.dest').on('click', 'a', function() {
  // $('#icon-content').show();
  $('#chart').remove();
  // $('nav').show();
  // $('.dest').hide();
  $('.icondest').removeClass(warnFilename);
})


});


// builds D3 chart
function chartInit(){
  var bardata = [];

  for (var i=0; i < 15; i++) {
      bardata.push(Math.round(Math.random()*100)+10)
  };

  bardata.sort(function compareNumbers(a,b) {
      return b -a;
  });

  var width = 600,
      height = 300

  var tempColor;

  var colors = d3.scale.linear()
  .domain([0, bardata.length])
  .range(['#ff3d00', '#00C851'])

  var x = d3.scale.linear()
          .domain([0, d3.max(bardata)])
          .range([0, width]);

  var y = d3.scale.ordinal()
          .domain(d3.range(0, bardata.length))
          .rangeBands([0, height], 0.2)

    var myChart = d3.select('#chart').append('svg')
                .attr('height', height)
                .attr('width', width)
                .append('g')
                .selectAll('rect').data(bardata)
                .enter().append('rect')
                    .style('fill', function(d,i) {
                        return colors(i);
                    })
                    .attr('height', y.rangeBand())
                    .attr('y', function(d,i) {
                        return y(i);
                    })
                    .attr('width', 0)
                    .attr('x', 0)

                .on('mouseover', function(d) {

                    tempColor = this.style.fill;
                    d3.select(this)
                        .style('opacity', .5)
                        .style('fill', 'yellow')
                })

                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('fill', tempColor)
                })
    myChart.transition()
    .attr('width', function(d) {
    return x(d);
    })
    .attr('x', 0)
    .delay(function(d, i) {
    return i * 5;
    })
    .duration(500)
}
