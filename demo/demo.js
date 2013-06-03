$(function() {
	//creates a new map
	map = new L.Map('map', {zoomControl:false});

	//creates an ocean floor background layer
	var basemapURL = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
	var basemapLayer = new L.TileLayer(basemapURL, {
		maxZoom : 19
	});

	//centers map and default zoom level
	map.setView([44.3, -123.19], 10);

	//adds the background layer to the map
	map.addLayer(basemapLayer);

	var samples = new L.GeoJSON(data, {
		pointToLayer: function(geojson, latlng) {
			var circle = new L.CircleMarker(latlng, {radius:6});
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

	playback = new L.Playback(map, data, clockCallback);

	map.on('mousemove', function(e) {
		$('#mouse-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	map.on('click', function(e) {
		$('#click-latlng').html(e.latlng.lat+', '+e.latlng.lng);
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
    altFormat: 'mm/dd/yy'
  }); 

  $('.dropup input, .dropup i').on('click', function(e) {
    e.stopPropagation();
  });

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		draw: {
			position: 'topleft',
			polyline: false,
			polygon: false,
			rectangle: false,
			marker: false,
			circle: {
				title: "Create a GeoTrigger!",
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
      $('#create-geotrigger-modal').modal();
    }

		drawnItems.addLayer(layer);
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

function triggerFired(trigger) {
  console.log(['triggerFired',trigger]);
}
