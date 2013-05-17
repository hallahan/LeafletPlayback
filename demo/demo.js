$(function() {
	//creates a new map
	map = new L.Map('map');

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

	var l = {
		'Samples': samples
	};

	L.control.layers(l).addTo(map);
	map.fitBounds(samples.getBounds());

	playback = new L.Playback(map, data, clockCallback);

	map.on('mousemove', function(e) {
		$('#mouse-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	map.on('click', function(e) {
		$('#click-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	$('#start').click(function() {
		playback.start();
	});
	$('#stop').click(function() {
		playback.stop();
	});

	$('#set-cursor').click(function(){
		var val = $('#cursor-time').val();
		playback.setCursor(val);
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
		slide: function( event, ui ) {
			playback.setCursor(ui.value);
			$('#cursor-time').val(ui.value.toString());
			$('#cursor-time-txt').html(new Date(ui.value).toString());
		}
	});

	$('#cursor-time').val(playback.getTime().toString());
	$('#speed').val(playback.getSpeed().toString());

	$('#set-speed').on('click', function(e) {
		var speed = parseInt($('#speed').val());
		if (speed) playback.setSpeed(speed);
	})

});

function clockCallback(ms) {
	$('#cursor-time').val(ms.toString());
	$('#cursor-time-txt').html(new Date(ms).toString());
	$('#time-slider').slider('value', ms);
}
