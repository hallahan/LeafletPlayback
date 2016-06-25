$(function() {
    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

    // Center map and default zoom level
    map.setView([44.562108, -123.265806], 14);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // =====================================================
    // =============== Playback ============================
    // =====================================================
    
    // Playback options
    var playbackOptions = {
        playControl: true,
        dateControl: true,
        sliderControl: true     
    };
	
	
	var playback;
	 
	//playback = new L.Playback(map, null, null, playbackOptions); 
    
	
	/* asynchronous load gpx file. */
	$.get( "../data/gpx/dummy.gpx", function( data ) {
		geoJsonData =  L.Playback.Util.ParseGPX(data);
		//playback.setData(geoJsonData);
		/* ^^^^^^^apparently, the time slider is not updated correctly after calling setData,
		while calling the next commented line here gives a correct slider. */
	 playback = new L.Playback(map, geoJsonData, null, playbackOptions); 
		
});

         
     
});
