$(function() {
    // Get start/end times
    var startTime = new Date(demoTracks[0].properties.time[0]);
    var endTime = new Date(demoTracks[0].properties.time[demoTracks[0].properties.time.length - 1]);

    // Create a DataSet with data
    var timelineData = new vis.DataSet([{ start: startTime, end: endTime, content: 'Demo GPS Tracks' }]);

    // Set timeline options
    var timelineOptions = {
      width:  "100%",
      height: 120,
      type: "box",
      orientation: "top",
      showCurrentTime:true
    };
    
    // Setup timeline
    var timeline = new vis.Timeline(document.getElementById('timeline'), timelineData, timelineOptions);
        
    // Set custom time marker (blue)
    timeline.setCurrentTime(startTime);

    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    });

    // Center map and default zoom level
    map.setView([44.5, -123.6], 10);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // =====================================================
    // =============== Playback ============================
    // =====================================================
    
    // Playback options
    var playbackOptions = {

        playControl: true,
        dateControl: true,
        
        // layer and marker options
        layer : {
            pointToLayer : function(featureData, latlng) {
                var result = {};
                
                if (featureData && featureData.properties && featureData.properties.path_options) {
                    result = featureData.properties.path_options;
                }
                
                if (!result.radius){
                    result.radius = 5;
                }
                
                return new L.CircleMarker(latlng, result);
            }
        },
        
        marker: { 
            getPopup: function(featureData) {
                var result = '';
                
                if (featureData && featureData.properties && featureData.properties.title) {
                    result = featureData.properties.title;
                }
                
                return result;
            }
        }
        
    };
        
    // Initialize playback
    var playback = new L.Playback(map, null, onPlaybackTimeChange, playbackOptions);
    
    playback.setData(demoTracks);    
    playback.addData(blueMountain);

    // Uncomment to test data reset;
    //playback.setData(blueMountain);    
    
    // Set timeline time change event, so cursor is set after moving custom time (blue)
    timeline.on('timechange', onCurrentTimeChange);    

    // A callback so timeline is set after changing playback time
    function onPlaybackTimeChange (ms) {
        timeline.setCurrentTime(new Date(ms));
    };
    
    // 
    function onCurrentTimeChange(properties) {
        if (!playback.isPlaying()) {
            playback.setCursor(properties.time.getTime());
        }        
    }       
});
