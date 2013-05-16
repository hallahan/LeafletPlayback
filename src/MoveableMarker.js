L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({

  initialize: function (startLatLng) {
    L.Marker.prototype.initialize.call(this, startLatLng);
    this.bindPopup(this._latlng.toString());
  },

  move: function (latLng, transitionTime) {
    // Only if CSS3 transitions are supported
    if (L.DomUtil.TRANSITION) {
      if (this._icon) { 
        this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
      }
      if (this._shadow) { 
        this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
      }
    }
    this.setLatLng(latLng);
    this._popup.setContent(this._latlng.toString());
  }
});