$(function() {

  demoTracks = [blodgett, blueMountain, drive, houseToCoordley, tillicum];

	//creates a new map
	map = new L.Map('map');

  // var basemapURL = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
	var basemapURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var basemapLayer = new L.TileLayer(basemapURL, {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
		maxZoom : 19
	});

	//centers map and default zoom level
	map.setView([44.44751, -123.49], 10);

	//adds the background layer to the map
	map.addLayer(basemapLayer);

	playback = new L.Playback(map, demoTracks, clockCallback);

	isPlaying = false;
	$('#play-pause').click(function() {
		if (isPlaying === false) {
			playback.start();
    	$('#play-pause-icon').removeClass('icon-play');
    	$('#play-pause-icon').addClass('icon-pause');
    	isPlaying = true;
		} else {
			playback.stop();
    	$('#play-pause-icon').removeClass('icon-pause');
    	$('#play-pause-icon').addClass('icon-play');
    	isPlaying = false;
		}
	});

	$('#set-cursor').click(function(){
		var val = $('#cursor-time').val();
		playback.setCursor(val);
		$('#time-slider').slider('value', val);
	});

	$('#start-time-txt').html(new Date(playback.getStartTime()).toString());
  startTime = playback.getStartTime();
	$('#cursor-date').html(L.Playback.Util.DateStr(startTime));
  $('#cursor-time').html(L.Playback.Util.TimeStr(startTime));

	$('#time-slider').slider({
		min: playback.getStartTime(),
		max: playback.getEndTime(),
		step: playback.getTickLen(),
		value: playback.getTime(),
		slide: function( event, ui ) {
			playback.setCursor(ui.value);
			$('#cursor-time').val(ui.value.toString());
			$('#cursor-time-txt').html(new Date(ui.value).toString());
		}
	});

	$('#cursor-time').val(playback.getTime().toString());
	$('#speed').val(playback.getSpeed().toString());

	$('#speed-slider').slider({
		min: -9,
		max: 9,
		step: .1,
		value: speedToSliderVal(playback.getSpeed()),
    orientation: 'vertical',
		slide: function( event, ui ) {
			var speed = sliderValToSpeed(parseFloat(ui.value));
			playback.setSpeed(speed);
			$('.speed').html(speed).val(speed);
		}
	});

  $('#speed-input').on('keyup', function(e) {
    var speed = parseFloat($('#speed-input').val());
    if (!speed) return;
    playback.setSpeed(speed);
    $('#speed-slider').slider('value', speedToSliderVal(speed));
    $('#speed-icon-val').html(speed);
    if (e.keyCode === 13) {
      $('.speed-menu').dropdown('toggle');
    }
  });

  $('#calendar').datepicker({
    changeMonth: true,
    changeYear: true,
    altField: '#date-input',
    altFormat: 'mm/dd/yy',
    defaultDate: new Date(playback.getTime()),
    onSelect: function(date) {
      var date = new Date(date);
      var time = $('#timepicker').data('timepicker');
      var ts = combineDateAndTime(date, time);
      playback.setCursor(ts);
      $('#time-slider').slider('value', ts);
    }
  }); 

  $('#date-input').on('keyup', function(e) {
    $('#calendar').datepicker('setDate', $('#date-input').val());
  });


  $('.dropdown-menu').on('click', function(e) {
    e.stopPropagation();
  });

  $('#timepicker').timepicker({
    showSeconds: true
  });
  $('#timepicker').timepicker('setTime', 
      new Date(playback.getTime()).toTimeString());

  $('#timepicker').timepicker().on('changeTime.timepicker', function(e) {
    var date = $('#calendar').datepicker('getDate');
    var ts = combineDateAndTime(date, e.time);
    playback.setCursor(ts);
    $('#time-slider').slider('value', ts);
  });

  $('#load-tracks-btn').on('click', function(e) {
    $('#load-tracks-modal').modal();
  });

  $('#load-tracks-save').on('click', function(e) {
    var file = $('#load-tracks-file').get(0).files[0];
    loadTracksFromFile(file);
  });

});

function clockCallback(ms) {
	$('#cursor-date').html(L.Playback.Util.DateStr(ms));
	$('#cursor-time').html(L.Playback.Util.TimeStr(ms));
	$('#time-slider').slider('value', ms);
}

function speedToSliderVal(speed) {
	if (speed < 1) return -10+speed*10;
	return speed - 1;
}

function sliderValToSpeed(val) {
	if (val < 0) return parseFloat((1+val/10).toFixed(2));
	return val + 1;
}

function combineDateAndTime(date, time) {
  var yr = date.getFullYear();
  var mo = date.getMonth();
  var dy = date.getDate();
  // the calendar uses hour and the timepicker uses hours...
  var hr = time.hours || time.hour;
  if (time.meridian == 'PM' && hr != 12) hr += 12;
  var min = time.minutes || time.minute;
  var sec = time.seconds || time.second;
  return new Date(yr, mo, dy, hr, min, sec).getTime();
}

function loadTracksFromFile(file) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(e) {
    var tracks = JSON.parse(e.target.result);
    playback.addTracks(tracks);
    samples.addData(tracks);
    $('#load-tracks-modal').modal('hide');
  }
}
