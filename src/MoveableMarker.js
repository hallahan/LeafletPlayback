L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({
  statics: {
    _colorIdx: 0,
    _colors: [
      'green',
      'blue',
      'purple',
      'darkred',
      'cadetblue',
      'red',
      'darkgreen',
      'darkblue',
      'darkpurple',
      'orange'
    ],
    _assignColor: function() {
      return this._colors[this._colorIdx++%10];
    }
  }, 

  initialize: function (startLatLng) {
    L.Marker.prototype.initialize.call(this, startLatLng, {
      icon: L.AwesomeMarkers.icon({
        icon: 'bullseye', 
        color: L.Playback.MoveableMarker._assignColor()
      }) 
    });

    this.bindPopup(this._latlng.toString());
  },

  move: function (latLng, transitionTime) {
    // Only if CSS3 transitions are supported
    if (L.DomUtil.TRANSITION) {
      if (this._icon) { 
        this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
        if (this._popup && this._popup._wrapper)
          this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
      }
      if (this._shadow) { 
        this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
      }
    }
    this.setLatLng(latLng);
    this._popup.setContent(this._latlng.toString());
  }
});
