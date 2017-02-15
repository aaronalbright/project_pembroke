$ = jQuery = require('jquery'),
smoothState = require('./smoothState.min.js');
require('./bootstrap.min.js');

var bardata = [];

for (var i=0; i < 15; i++) {
    bardata.push(Math.round(Math.random()*100)+10)
}

bardata.sort(function compareNumbers(a,b) {
    return b -a;
});

var width = d3.select('#chart').node().getBoundingClientRect().width,
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

var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)
        .style('color','#2E2E2E')

var myChart = d3.select('#chart').append('svg')
    .style('background', '#2E2E2E')
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

        tooltip.transition()
            .style('opacity', .9)

        tooltip.html(d)
            .style('left', (d3.event.pageX - 35) + 'px')
            .style('top',  (d3.event.pageY - 30) + 'px')


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
        return i * 10;
    })
    .duration(2000)
    .ease('elastic')

$(function(){
  var $page = $('#main'),
      options = {
        debug: true,
        prefetch: true,
        cacheLength: 2,
        forms: 'form',
        onStart: {
          duration: 300, // Duration of our animation
          render: function ($container) {
            // Add your CSS animation reversing class
            $container.addClass('is-exiting');
            // Restart your animation
            smoothState.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 0,
          render: function ($container, $newContent) {
            // Remove your CSS animation reversing class
            $container.removeClass('is-exiting');
            // Inject the new content
            $container.html($newContent);
          }
        }
      },
      smoothState = $page.smoothState(options).data('smoothState');

});
