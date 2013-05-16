

L.Playback = L.Class.extend({

  initialize: function (map, geoJSON, options) {
    this.map = map;
    this.geoJSON = geoJSON;
    L.setOptions(this, options);
    this.tickPoint = new L.Playback.TickPoint(geoJSON, this.options.tickLen);
    this.tick = new L.Playback.Tick(map, this.tickPoint);
    this.clock = new L.Playback.Clock(this.tick, this.clockCallback, this.options);
  },

  options: {
    tickLen: 250,
    speed: 1
  },

  clockCallback: function (ms) {
    $('#cursor-time-txt').html(new Date(ms).toString());
    $('#cursor-time').val(ms.toString());
  }

});
