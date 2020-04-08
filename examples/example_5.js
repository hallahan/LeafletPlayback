$(function () {
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
        sliderControl: true,
        tooltips: true,
        popups: true,
        // marker options
        marker: function (featureData) {
            return {
                notLatLngBased: true,
                getPopup: function (featureData) {
                    var result = '';

                    if (featureData && featureData.properties && featureData.properties.title) {
                        result = "<strong>" + featureData.properties.title + "</strong><br/>";
                    }

                    return result;
                },
                getPopupOptions: function () {
                    return {
                        keepInView: true
                    };
                },
                getTooltip: function (featureData) {
                    var result = "";
                    if (featureData && featureData.properties && featureData.properties.title) {
                        result = "<strong style=\"font-size: 18px;\">" + featureData.properties.title + "</strong><br/>";
                    }
                    return result;
                },
                getTooltipOptions: function () {
                    return {
                        offset: [4, -4],
                        direction: "right",
                        permanent: true
                    };
                },
                getLocationWrapper: function () {
                    return {
                        start: "<strong>Coordinates:</strong> <i>[",
                        end: "]</i>"
                    }
                }
            }
        }

    };

    // Initialize playback
    var playback = new L.Playback(map, demoTracks, null, playbackOptions);
});