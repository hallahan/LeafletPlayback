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
    '<i class="icon-flag"></i> Virtual Fences': geoTriggerFeatureGroup
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

	$('#start').click(function() {
		playback.start();
    geoTriggers.startPolling();
	});
	$('#stop').click(function() {
		playback.stop();
    geoTriggers.stopPolling();
	});

	$('#set-cursor').click(function(){
		var val = $('#cursor-time').val();
		playback.setCursor(val);
		$('#time-slider').slider('value', val);
	});

	$('#start-time-txt').html(new Date(playback.getStartTime()).toString());
	$('#start-time').html(playback.getStartTime().toString());	
	$('#end-time-txt').html(new Date(playback.getEndTime()).toString());
	$('#end-time').html(playback.getEndTime().toString());
	$('#cursor-time-txt').html(new Date(playback.getTime()).toString());

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
		slide: function( event, ui ) {
			var speed = sliderValToSpeed(parseFloat(ui.value));
			playback.setSpeed(speed);
			$('#speed').val(speed);
		}
	});

	$('#set-speed').on('click', function(e) {
		var speed = parseInt($('#speed').val());
		if (!speed) return;
		playback.setSpeed(speed);
		$('#speed-slider').slider('value', speedToSliderVal(speed));
	})

	$('#close-right-panel').click(function(e){
		$('#right-panel').hide();
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
	$('#cursor-time').val(ms.toString());
	$('#cursor-time-txt').html(new Date(ms).toString());
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
