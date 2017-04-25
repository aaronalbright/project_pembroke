var $ = jQuery = require('jquery');
var d3 = require('./d3.min.js');
require('./bootstrap.min.js');
var Handlebars = require('handlebars');

$(document).ready(function() {

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(function() {
      console.log('Service worker active');
    })
}

// builds handlebar template
handles();
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

// Shows content
$('#icon-content').on('click', 'span', function() {
    $('.dest').html("<a href=\"#menu\" aria-label=\"Close\"><span class=\"glyphicon glyphicon-remove close\"></span></a><span class=\"icondest\" data-light=\"\"></span><h2 class=\"warning-title\"></h2><div class=\"row\"><div class=\"col-md-12\"><h3>What it means</h3><p class=\"warning-meaning\"></p></div><div class=\"col-md-6\"><h3 class=\"pieStart\">What you can do about it</h3><p class=\"warning-what\"></p></div><div class=\"col-md-6 why\"><h3>Why it matters</h3><p class=\"warning-why\"></p></div></div><a href=\"#menu\" aria-label=\"Close\"><p class=\"return\">Return to list</p></a>");
    $('.warning-title').html($(this).data('warning'));
    $('.warning-meaning').html($(this).data('meaning'));
    $('.warning-what').html($(this).data('what'));
    $('.warning-why').html($(this).data('why'));
    warnFilename = $(this).data('filename');
    $('.icondest').addClass(warnFilename);
    if ($('span.icondest').hasClass('flaticon-malfunction-indicator')) {
      $('<div id="pieChart"></div>').insertAfter('.warning-what');
      $('<div id="barChart"></div>').insertAfter('.warning-why');
      pieInit();
      chartInit();
      $('<p class=\"source\"><i>Data sourced from CarMD 2016 Vehicle Health Index</i></p>').insertAfter('#chart2');
    };
    $('.page#panel').scrollTop(0);
  });

// Hides content
$('.dest').on('click', 'a', function() {
  $('#pieChart').remove();
  $('#barChart').remove();
  $('.icondest').removeClass(warnFilename);
})

});


// Builds D3 pie chart
function pieInit(){

  var width = d3.select('#pieChart').node().getBoundingClientRect().width,
      height = 450,
      radius = Math.min(width, height) / 3,
      legendRectSize = 23,
      legendSpacing = 4,
      tempColor;

  var chart = d3.select('#pieChart').append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 1.5) + ')');

  var arc = d3.arc().innerRadius(radius - 75).outerRadius(radius);

  var pie = d3.pie()
      .sort(null)
      .startAngle(1.1*Math.PI)
      .endAngle(3.1*Math.PI)
      .value(function(d) {return d.value;})

  var tooltip = d3.select('#pieChart')
    .append('div')
    .attr('class', 'tooltipA');
  tooltip.append('p')
    .attr('class', 'repair');
  tooltip.append('p')
    .attr('class', 'cost');
  tooltip.append('p')
    .attr('class', 'percent');

  d3.csv('data/data.csv', function(error, piedata) {
      if (error) throw error;

      piedata.forEach(function(d) {
        d.value = +d.value;
      });
      var color = d3.scaleOrdinal()
              .domain(piedata.length)
              .range(['#C42E41', '#009DDC', '#00C851', '#F26430','#6C61BF']);

      // Pie Slices
      var slices = chart.selectAll('path')
        .data(pie(piedata))
        .enter()
        .append('path')
        .attr ('fill', function(d, i){
              return color(d.data.repair);
            })
        .on('mouseover', function(d) {
            tempColor = this.style.fill;
            d3.select(this)
            .style('opacity', .5)
        })
        .on('click', function(d) {
            tooltip.select('.repair').html(d.data.repair);
            tooltip.select('.cost').html('$' + d.data.avg);
            tooltip.select('.percent').html(d.data.value + '% of 2015 repairs');
            tooltip.style('display', 'block')
            .style('top', (width / 4) + 'px')
            .style('left', (height / 2.5) + 'px');
            tempColor = this.style.fill;
            d3.select(this)
            .style('opacity', .5)
        })
        .on('mouseout', function(d) {
            d3.select(this)
              .style('opacity', 1)
              .style('fill', tempColor)
        });

  // Pie animation on scroll
  if ($(window).width() <= 991) {
  $('#panel').on('scroll.pie',function () {
    var pieLoc = $('.pieStart').offset().top + 75;

    if ($('.page#panel').scrollTop() >= pieLoc) {
      slices.transition().duration(2000)
          .attrTween('d', function(d) {
    var i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, d);
        return function(t) { return arc(i(t));
            }
        });
        $('.page#panel').off('scroll.pie')
      }
    });
  }
  else {
    slices.transition().duration(2500)
          .attrTween('d', function(d) {
      var i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, d);
      return function(t) { return arc(i(t)); }
      });
  }
    // Pie Legend
    var legend = chart.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          var height = legendRectSize + legendSpacing;
          var offset =  height * color.domain().length * 2;
          var horz = -6.52173913 * legendRectSize;
          var vert = i * height - 300;
          return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .attr('fill', color)

    legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .attr('fill','#FFF')
          .text(function(d) { return d;});
  }); // end of data.csv func
} // end of pieInit()

// Builds D3 bar chart
function chartInit() {

  var margin = {top:30, right:10, bottom: 10, left:45};

  var w = d3.select('#barChart').node().getBoundingClientRect().width - margin.left - margin.right,
      barHeight = 30,
      color = '#00C851',
      tempColor;

  var x = d3.scaleLinear()
      .range([0, w]);

  d3.json('data/cost.json', function(error, data) {
    if (error) throw error;

    d3.select('#barChart')
      .append('h3')
      .attr('class','chartHeader')
      .text('Avg. cost of check engine repairs');

    var foo = "yearlyAverage"

    var dataYear = data[foo].map(function(d){return d.key}),
        dataCost = data[foo].map(function(d){return d.cost});

    var h = (barHeight * dataYear.length) - margin.top - margin.bottom;

    x.domain([0, d3.max(dataCost)]);

    var y = d3.scaleBand()
              .domain(dataYear)
              .range([0, h]).round(true).padding(0.2);

    var xAxis = d3.axisTop().scale(x).ticks(5,"$.0f");
    var yAxis = d3.axisLeft().scale(y);

    var svg = d3.select('#barChart').append('svg')
        .attr('width', w + margin.left + margin.right)
        .attr('height', h + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.top+')');

        svg.append('g')
        .attr('class',"x axis")
        .attr('transform',"translate(0,0)")
        .call(xAxis);

        svg.append('g')
        .attr('class','y axis')
        .call(yAxis);

      var bar = svg.append('g');

      // bar styles
       bar.selectAll('.bar').data(data.yearlyAverage)
          .enter().append('rect')
          .attr('class','bar')
          .style('fill', color)
          .attr('height', y.bandwidth())
          .attr('width', 0)
          .attr('x', 2)
          .attr('y', function(d) { return y(d.key); })
          .on('mouseover', function(d) {
              tempColor = this.style.fill;
              d3.select(this)
                  .style('opacity', .5)
          })
          .on('mouseout', function(d) {
              d3.select(this)
                  .style('opacity', 1)
                  .style('fill', tempColor)
          });

      // text styles
      bar.selectAll('.texty').data(data.yearlyAverage)
      .enter().append('text')
      .attr('class','texty')
        .attr('x', 2)
        .attr("y", function(d){ return y(d.key) + y.bandwidth()/2;})
        .attr("dy", ".36em")
        .attr('dx', -5)
        .style('display','none')
        .text(function(d) { return "$"+ d.cost; });


        // bar animation on scroll
        if ($(window).width() <= 991) {
        $('#panel').on('scroll.bar',function () {
          var barLoc = $('.warning-why').offset().top + 800;
          if ($('.page#panel').scrollTop() >= barLoc) {
            bar.selectAll('.bar')
            .transition()
            .attr('width', function(d) { return x(d.cost) - 2; })
            .delay(function(d, i) {
            return i * 75;
            })
            .duration(3000)
            .ease(d3.easeElastic);
            bar.selectAll('.texty')
            .transition()
            .style('display','block')
            .attr("x", function(d){ return x(d.cost); })
            .delay(function(d, i) { return i * 75; })
            .duration(3000)
            .ease(d3.easeElastic);
            $('.page#panel').off('scroll.bar')
          }
        });
      }
        else {
          bar.selectAll('.bar')
          .transition()
          .attr('width', function(d) { return x(d.cost) - 2; })
          .delay(function(d, i) {
          return i * 75;
          })
          .duration(2500)
          .ease(d3.easeElastic);
          bar.selectAll('.texty')
          .transition()
          .style('display','block')
          .attr("x", function(d){ return x(d.cost); })
          .delay(function(d, i) { return i * 75; })
          .duration(2500)
          .ease(d3.easeElastic);
        }

    }); // end of cost.json func
} // End of chartInit()
