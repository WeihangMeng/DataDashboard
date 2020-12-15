

$(function(){
  //Variable define
  var statusEffcient = ['efficiency'];
  var statusChart;
  const CTA = document.querySelector('.cta a');
  const CSTATUS = document.querySelector('#CollectingStatus');
  const CTB = document.querySelector('.cta1 b');
  CTA.classList.remove('hide');
  CSTATUS.classList.add('hide');
  //Set time statement
  document.querySelector(
    '#fromTime'
  ).value = moment('01:00:00', 'hh:mm:ss').format(
    'hh:mm:ss');

  document.querySelector(
    '#toTime'
  ).value = moment('01:00:00', 'hh:mm:ss').format(
    'hh:mm:ss');

  //Status bar animation control
  function reveal(e, current){
    e.preventDefault();
    current.innerHTML == "Collect The Data!" ? CTA.innerHTML = "Stop!" : CTA.innerHTML = "Collect The Data!";
    CSTATUS.classList.toggle('hide');
  };
  //Generate Chart format
  function generateChart(xRange){
    return c3.generate({
      data:{
        columns: [],
      },
      axis:{
        y:{
          max:100,
          min:0,
        },
        x:{
          min:0,
          max:xRange - 1,
        }
      },
      color:{
        pattern:['#green']
      }
    })
  };
  setInterval(function(){
    $.ajax({
      url:'http://pixelprowess.com/i/stream.php',
      dataType: 'json',
      success: function(data){
        $('#progress-red').css(
          'width', (data.red_value / 255) * 100 + '%');
        $('#progress-red').text(data.red_value);
        $('#progress-green').css(
          'width', (data.green_value / 255) * 100 + '%');
        $('#progress-green').text(data.green_value);
        $('#progress-blue').css(
          'width', (data.blue_value / 255) * 100 + '%');
        $('#progress-blue').text(data.blue_value);

        $('#current-color').css('backgroundColor', 'rgb('+data.red_value + ','
        + data.green_value + ','
        + data.blue_value + ')');

        $('#time-stamp').text(data.time_stamp);
        $('#progress-pulsometer').css(
          'width', (data.pulsometer_readout -1) / 255 * 100 + '%');
        $('#progress-pulsometer').text(data.pulsometer_readout);

        $('#progress-efficiency').css(
          'width', (data.engine_efficiency / 100) * 100 + '%');
        $('#progress-efficiency').text(data.engine_efficiency);

        if (CTA.innerHTML == 'Stop!'){
          statusEffcient.push(data.engine_efficiency);
        }
        statusChart = generateChart(statusEffcient.length - 1);
        statusChart.load({
          columns: [statusEffcient]
        });
    }
    })
  }, 1000);
  CTA.addEventListener('click', function(e){reveal(e, this);}, false);
  CTA.addEventListener('click', function(){CTA.innerHTML == 'Stop!'? document.querySelector('#fromTime').value = document.querySelector('#time-stamp').innerHTML:document.querySelector('#toTime').value = document.querySelector('#time-stamp').innerHTML;}, false);
  CTB.addEventListener('click', function(){statusChart.unload();statusEffcient = ['efficient'];}, false);
});
