var map = null;

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

	$.getJSON('data/drive-geo.json', function(data) {
		
		var samples = new L.GeoJSON(data, {
			pointToLayer: function(geojson, latlng) {
				var circle = new L.CircleMarker(latlng, {radius:6});
				// circle.bindPopup(i);
				return circle;
			}
		});
		
		tickPoints = new TickPoints(data, 250);
		tickGeoJSON = tickPoints.getTickMultiPoint();
		var ticks = new L.GeoJSON(tickGeoJSON, {
			pointToLayer: function(geojson, latlng) {
				var circle = new L.CircleMarker(latlng, {radius:4, color:'#666'});
				// circle.bindPopup(i);
				return circle;
			}
		});

		var l = {
			'Samples': samples,
			'Ticks': ticks
		};

		L.control.layers(l).addTo(map);
		map.fitBounds(samples.getBounds());

		clock = new Clock(tickPoints);

		map.on('mousemove', function(e) {
			$('#mouse-latlng').html(e.latlng.lat+', '+e.latlng.lng);
		});

		map.on('click', function(e) {
			$('#click-latlng').html(e.latlng.lat+', '+e.latlng.lng);
		});

	});
});

