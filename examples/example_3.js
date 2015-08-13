$(function() {
    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

    // Center map and default zoom level
    map.setView([44.61131534, -123.4726739], 9);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // =====================================================
    // =============== Playback ============================
    // =====================================================
    
    var shipIcon = L.icon({
                            iconUrl: 'ship-icon.png',
                            iconSize: [7, 20], // size of the icon
                            shadowSize: [0, 0], // size of the shadow
                            iconAnchor: [3.5, 10], // point of the icon which will correspond to marker's location
                            shadowAnchor: [0, 0], // the same for the shadow
                            popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                        });
    // Playback options
    var playbackOptions = {
        playControl: true,
        dateControl: true,
        sliderControl: true,
        orientIcons:true,
        marker: function (featureData) {
                    return {
                        icon: shipIcon,
                        getPopup: function (feature) {
                            return feature.properties.title;
                        }
                    };
                }
    };
        
    // Initialize playback
    var playback = new L.Playback(map, demoTracks, null, playbackOptions);   
});
