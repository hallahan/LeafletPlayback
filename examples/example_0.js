$(function() {
    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png');

    // Center map and default zoom level
    map.setView([44.61131534, -123.4726739], 9);

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
        
    // Initialize playback
    var playback = new L.Playback(map, demoTracks, null, playbackOptions);   
});
