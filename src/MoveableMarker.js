

L.Playback.MoveableMarker = L.Class.extend({

  initialize: function (map, startLatLng) {
    this._map = map;
    this._latLng = startLatLng;
    this._marker = new L.Marker(this._latLng).addTo(map);
  },

  move: function (latLng, transitionTime) {
    this._latLng = latLng;
    // Only if CSS3 transitions are supported
    if (L.DomUtil.TRANSITION) {
      if (marker._icon) { 
        this._marker._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
      }
      if (marker._shadow) { 
        this._marker._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
      }
    }
    this._marker.setLatLng(latLng);
  }
});