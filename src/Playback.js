
L.Playback = L.Playback.Clock.extend({
  statics: {
    MoveableMarker: L.Playback.MoveableMarker,
    TickPoint: L.Playback.TickPoint,
    Tick: L.Playback.Tick,
    Clock: L.Playback.Clock,
    Util: L.Playback.Util,
    TracksLayer: L.Playback.TracksLayer,
    Control: L.Playback.Control
  },

  options : {
    tracksLayer: true
  }, 

  initialize: function (map, geoJSON, callback, options) {
    L.setOptions(this, options);
    this.map = map;
    this.geoJSON = geoJSON;
    this.tickPoints = [];
    if (geoJSON instanceof Array) {
      for(var i=0,len=geoJSON.length;i<len;i++){
        this.tickPoints.push( new L.Playback.TickPoint(geoJSON[i], this.options.tickLen) );
      }
    } else {
      this.tickPoints.push( new L.Playback.TickPoint(geoJSON, this.options.tickLen) );
    }
    this.tick = new L.Playback.Tick(map, this.tickPoints);
    L.Playback.Clock.prototype.initialize.call(this, this.tick, callback, this.options);
    if (this.options.tracksLayer) {
      this.tracksLayer = new L.Playback.TracksLayer(map, geoJSON);
    }
  },

  addTracks: function(geoJSON) {
    console.log('addTracks');
    console.log(geoJSON);
    var newTickPoint = new L.Playback.TickPoint(geoJSON, this.options.tickLen);
    this.tick.addTickPoint(newTickPoint, this.getTime());
    $('#time-slider').slider('option','min',this.getStartTime());
    $('#time-slider').slider('option','max',this.getEndTime());
  }

});

L.Map.addInitHook(function() {
  if (this.options.playback) {
    this.playback = new L.Playback(this);
  }
});

L.playback = function(map, geoJSON, callback, options) {
  return new L.Playback(map, geoJSON, callback, options);
}
