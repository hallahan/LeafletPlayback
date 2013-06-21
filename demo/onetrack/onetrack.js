$(function() {

  demoTracks = mtWashington;

	//creates a new map
	map = new L.Map('map');

  // var basemapURL = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
  var basemapURL = 'http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}';
	// var basemapURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var basemapLayer = new L.TileLayer(basemapURL, {
    attribution: '&copy; USGS',
		maxZoom : 19
	});

	//centers map and default zoom level
	map.setView([44.44751, -123.49], 10);

	//adds the background layer to the map
	map.addLayer(basemapLayer);

	playback = new L.Playback(map, demoTracks);

  bounds = playback.tracksLayer.layer.getBounds();

  map.fitBounds(bounds);
});
