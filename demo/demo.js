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

	playback = new L.Playback(map, data);

	map.on('mousemove', function(e) {
		$('#mouse-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	map.on('click', function(e) {
		$('#click-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	$('#start').click(function() {
		playback.clock.start();
	});
	$('#stop').click(function() {
		playback.clock.stop();
	});

	$('#set-cursor').click(function(){
		var val = $('#cursor-time').val();
		playback.clock.setCursor(val);
	});

});

