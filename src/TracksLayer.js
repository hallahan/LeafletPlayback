// Simply shows all of the track points as circles.
// TODO: Associate circle color with the marker color.
//       Show relevent data about point in popup.

L.Playback = L.Playback || {};

L.Playback.TracksLayer = L.Class.extend({

  initialize: function(map, tracks) {
    this.layer = new L.GeoJSON(demoTracks, {
      pointToLayer: function(geojson, latlng) {
        var circle = new L.CircleMarker(latlng, {radius:5});
        // circle.bindPopup(i);
        return circle;
      }
    });

    var overlayControl = {
      '<i class="icon-bullseye"></i> GPS Tracks': this.layer
    };

    L.control.layers(null, overlayControl, {
      collapsed: false
    }).addTo(map);
  }

});
