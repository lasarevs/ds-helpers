// JavaScript
console.log('helper is loaded');

$( document ).ready(function() {
    $('body').on('resize', function() {
        //location.reload();
    })
});

function fitChart(params) {
    var chart = $('.qlik_chart');
    var width = (params.width || $('body').width()) - 215;
    var height = (params.height || $('body').height()) - 115;
    if(height <  $('.filter_block').height()) {
        height = $('.filter_block').height();
    }
    chart.width(width);
    chart.height(height);
}