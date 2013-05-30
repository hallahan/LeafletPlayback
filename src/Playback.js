
L.Playback = L.Playback.Clock.extend({
  statics: {
    MoveableMarker: L.Playback.MoveableMarker,
    TickPoint: L.Playback.TickPoint,
    Tick: L.Playback.Tick,
    Clock: L.Playback.Clock
  },

  initialize: function (map, geoJSON, callback, options) {
    this.map = map;
    this.geoJSON = geoJSON;
    this.tickPoint = new L.Playback.TickPoint(geoJSON, this.options.tickLen);
    this.tick = new L.Playback.Tick(map, this.tickPoint);
    L.Playback.Clock.prototype.initialize.call(this, this.tick, callback, this.options);
    this.transport = new L.Playback.Transport();
    map.addControl(this.transport);
  }

});
