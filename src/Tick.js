L.Playback = L.Playback || {};

L.Playback.Tick = L.Class.extend({

  initialize: function (map, tickPoints) {
    this._map = map;
    if (tickPoints instanceof Array) {
      this._tickPoints = tickPoints;
    } else {
      this._tickPoints = [tickPoints];
    }
    this._markers = [];
    for(var i=0,len=this._tickPoints.length;i<len;i++){
      var firstLngLat = this._tickPoints[i].getFirstTick();
      var latLng = new L.LatLng(firstLngLat[1],firstLngLat[0]);
      this._markers[i] = new L.Playback.MoveableMarker(latLng).addTo(map);
    }
  },

  addTickPoint: function(tickPoint, ms) {
    this._tickPoints.push(tickPoint);
    var lngLat = tickPoint.tick(ms);
    var latLng = new L.LatLng(lngLat[1], lngLat[0]);
    this._markers.push(new L.Playback.MoveableMarker(latLng).addTo(this._map));
  },

  tock: function (ms, transitionTime) {
    for(var i=0,len=this._tickPoints.length;i<len;i++){
      var lngLat = this._tickPoints[i].tick(ms);
      var latLng = new L.LatLng(lngLat[1],lngLat[0]);
      this._markers[i].move(latLng, transitionTime);
    }
  },

  getStartTime: function () {
    var earliestTime = this._tickPoints[0].getStartTime();
    for(var i=1,len=this._tickPoints.length;i<len;i++){
      var t = this._tickPoints[i].getStartTime();
      if (t < earliestTime) earliestTime = t;
    }
    return earliestTime;
  },

  getEndTime: function () {
    var latestTime = this._tickPoints[0].getEndTime();
    for(var i=1,len=this._tickPoints.length;i<len;i++){
      var t = this._tickPoints[i].getEndTime();
      if (t > latestTime) latestTime = t;
    }
    return latestTime;
  },

  getMarkers: function() {
    return this._markers;
  }
  
});
