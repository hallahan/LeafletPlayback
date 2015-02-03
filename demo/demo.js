/**
 * NOTE: This is for the GeoFence Demo. This is not used in the main LeafletPlayback plugin!
 */

$(function() {
  $('#bottom-branding').on('click', function(e) {
    $('header').fadeIn();
  });

  $('.close-header').on('click', function(e) {
    $('header').fadeOut();
  });

  $('#play-demo-btn').on('click', function(e) {
    playback.start();
    geoTriggers.startPolling();
    $('#play-pause-icon').removeClass('icon-play');
    $('#play-pause-icon').addClass('icon-pause');
    isPlaying = true;
  });

  demoTracks = [blodgett, blueMountain, drive, houseToCoordley, tillicum];

	//creates a new map
	map = new L.Map('map', {zoomControl:false});

  // var basemapURL = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

	//centers map and default zoom level
	map.setView([44.44751, -123.49], 10);

	//adds the background layer to the map
	map.addLayer(basemapLayer);

	samples = new L.GeoJSON(demoTracks, {
		pointToLayer: function(geojson, latlng) {
			var circle = new L.CircleMarker(latlng, {radius:5});
			// circle.bindPopup(i);
			return circle;
		}
	});

  geoTriggerFeatureGroup = new L.FeatureGroup();
  geoTriggerFeatureGroup.addTo(map);
	var l = {
		'<i class="icon-bullseye"></i> GPS Tracks': samples,
    '<i class="icon-bell"></i> Virtual Fences': geoTriggerFeatureGroup
	};

	L.control.layers(null, l, {
    collapsed: false,
    position: 'topleft'
  }).addTo(map);

  L.control.scale({metric:false}).addTo(map);

	playback = new L.Playback(map, demoTracks, clockCallback);

	map.on('click', function(e) {
    console.log(e.latlng.toString());
	});


	isPlaying = false;
	$('#play-pause').click(function() {
		if (isPlaying === false) {
			playback.start();
    	geoTriggers.startPolling();
    	$('#play-pause-icon').removeClass('icon-play');
    	$('#play-pause-icon').addClass('icon-pause');
    	isPlaying = true;
		} else {
			playback.stop();
    	geoTriggers.stopPolling();
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

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	drawControl = new L.Control.Draw({
		draw: {
			position: 'topleft',
			polyline: false,
			polygon: false,
			rectangle: false,
			marker: false,
			circle: {
				title: "Create a Virtual Fence!",
				shapeOptions: {
					color: '#662d91'
				}
			}
		},
		edit: {
			featureGroup: geoTriggerFeatureGroup
		}
	});
	map.addControl(drawControl);

	map.on('draw:created', function (e) {
		var type = e.layerType
			, layer = e.layer;

		if (type === 'marker') {
			layer.bindPopup('A popup!');
		}

    if (type === 'circle') {
      var latlng = layer.getLatLng();
      $('#new-trigger-lat').html(latlng.lat);
      $('#new-trigger-lng').html(latlng.lng);
      var radius = layer.getRadius();
      $('#new-trigger-radius').html(radius);

      $('input, textarea').val('').html('');
      $('#create-geotrigger-modal').modal();
    }

		// geoTriggerFeatureGroup.addLayer(layer);
	});

	map.on('draw:edited', function (e) {
		var layers = e.layers;
		var countOfEditedLayers = 0;
		layers.eachLayer(function(layer) {
			countOfEditedLayers++;

			geoTriggers.editTrigger({
				latlng: layer.getLatLng(),
				radius: layer.getRadius(),
				placeId: layer.placeId
			});

		});
		console.log("Edited " + countOfEditedLayers + " layers");

	});

	map.on('draw:deleted', function(e) {
		e.layers.eachLayer(function(layer) {
			geoTriggers.deleteTrigger(layer.placeId);
		});
	});

	// NH TODO this doesnt work...
	// L.DomUtil.get('changeColor').onclick = function () {
	// 	drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#004a80' } } });
	// };

  geoTriggers = new GeoTriggers(geoTriggerFeatureGroup, triggerFired);

  $('#create-geotrigger-save').on('click', function(e) {

  	geoTriggers.createTrigger({
  		lat: parseFloat($('#new-trigger-lat').html()),
  		lng: parseFloat($('#new-trigger-lng').html()),
  		radius: parseFloat($('#new-trigger-radius').html()),
  		name: $('#new-trigger-name').val(),
  		message: $('#new-trigger-message').val()
  	});

  	console.log('save');
  	$('#create-geotrigger-modal').modal('hide');
  });


  $('#load-tracks-save').on('click', function(e) {
    var file = $('#load-tracks-file').get(0).files[0];
    loadTracksFromFile(file);
  });

  $('#view-all-fences-btn').on('click', function(e) {
    var bounds = geoTriggerFeatureGroup.getBounds();
    map.fitBounds(bounds);
  });

});

function clockCallback(ms) {
	$('#cursor-date').html(L.Playback.Util.DateStr(ms));
	$('#cursor-time').html(L.Playback.Util.TimeStr(ms));
	$('#time-slider').slider('value', ms);
  // $('#timepicker').timepicker('setTime', new Date(ms).toTimeString());
}

function speedToSliderVal(speed) {
	if (speed < 1) return -10+speed*10;
	return speed - 1;
}

function sliderValToSpeed(val) {
	if (val < 0) return parseFloat((1+val/10).toFixed(2));
	return val + 1;
}

function triggerFired(trigger) {
  console.log('triggerFired');
  console.log(trigger);

  var html = 
'<div class="accordion-inner">' +
'  <strong>'+trigger.place.name+'</strong>' +
'  <span class="broadcast-time">'+ trigger.display_date + '</span>' +
'  <br/>' +
   trigger.trigger.text + '<br/>' +
'  <button class="btn btn-info btn-small view-notification"><i class="icon-eye-open"></i> View</button>'+
'</div>';

  $('#notifications').prepend(html);
  var count = $('#notifications').children().length;
  $('#notification-count').html('<span class="badge badge-important pull-right">'+count+'</span>');
  var $btn = $('#notifications').find('button').first();
  $btn.data('trigger',trigger);
  $btn.on('click', function(e) {
    console.log('view trigger');
    var lat = trigger.place.latitude;
    var lng = trigger.place.longitude;
    var radius = trigger.place.radius * 1.5;
    var circle = new L.Circle([lat,lng],radius);
    var bounds = circle.getBounds();
    map.fitBounds(bounds);
  });
}

function combineDateAndTime(date, time) {
  var yr = date.getFullYear();
  var mo = date.getMonth();
  var dy = date.getDate();
  // the calendar uses hour and the timepicker uses hours...
  var hr = time.hours || time.hour;
  if (time.meridian === 'PM' && hr !== 12) hr += 12;
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
  };
}

function save(data, name) {
  var json = JSON.stringify(data, null, 2);
  var blob = new Blob([json], {type:'text/plain'});
  var downloadLink = document.createElement("a");
  var url = (window.webkitURL != null ? window.webkitURL : window.URL);
  downloadLink.href = url.createObjectURL(blob);
  downloadLink.download = name || 'data.json';
  downloadLink.click();   
}

function sliceData(data, start,end) {
  end = end || data.geometry.coordinates.length-1;
  data.geometry.coordinates = data.geometry.coordinates.slice(start,end);
  data.properties.time = data.properties.time.slice(start,end);
  data.properties.speed = data.properties.speed.slice(start,end);
  data.properties.altitude = data.properties.altitude.slice(start,end);
  data.properties.heading = data.properties.heading.slice(start,end);
  data.properties.horizontal_accuracy = data.properties.horizontal_accuracy.slice(start,end);
  data.properties.vertical_accuracy = data.properties.vertical_accuracy.slice(start,end);
  save(data,'sliced-data.json');
}
