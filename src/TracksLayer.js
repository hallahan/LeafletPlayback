// Simply shows all of the track points as circles.
// TODO: Associate circle color with the marker color.

L.Playback = L.Playback || {};

L.Playback.TracksLayer = L.Class.extend({
    initialize : function (map, options) {
        var layer_options = options.layer || {};
        
        if (jQuery.isFunction(layer_options)){
            layer_options = layer_options(feature);
        }
        
        if (!layer_options.pointToLayer) {
            layer_options.pointToLayer = function (featureData, latlng) {
                return new L.CircleMarker(latlng, { radius : 5 });
            };
        }
    
        this.layer = new L.GeoJSON(null, layer_options);

        var overlayControl = {
            'GPS Tracks' : this.layer
        };

        L.control.layers(null, overlayControl, {
            collapsed : false
        }).addTo(map);
    },

    // clear all geoJSON layers
    clearLayer : function(){
        for (var i in this.layer._layers) {
            this.layer.removeLayer(this.layer._layers[i]);            
        }
    },

    // add new geoJSON layer
    addLayer : function(geoJSON) {
        this.layer.addData(geoJSON);
    }
});