L.Playback = L.Playback || {};

L.Playback.Clock = L.Class.extend({

  initialize: function (tickObj, callback, options) {
    this._tickObj = tickObj;
    this._callback = callback;
    L.setOptions(this, options);
    this._startTime = this.options.startTime || tickObj.getStartTime();
    this._endTime = this.options.endTime || tickObj.getEndTime();
    this._speed = this.options.speed;
    this._tickLen = this.options.tickLen;
    this._cursor = this._startTime;
    this._transitionTime = this._tickLen / this._speed;
  },

  options: {
    tickLen:    250,
    speed:      1
  },

  _tick: function (self) {
    if (self._cursor > self.options.endTime) {
      clearInterval(self._intervalID);
      return;
    }
    self._tickObj.tock(self._cursor, self._transitionTime);
    self._callback(self._cursor);
    self._cursor += self._tickLen;
  },

  start: function () {
    if (this._intervalID) return;
    this._intervalID = window.setInterval(
      this._tick, 
      this._transitionTime, 
      this);
  },

  stop: function () {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  },

  getSpeed: function() {
    return this._speed;
  },

  setSpeed: function (speed) {
    this._speed = speed;
    this._transitionTime = this._tickLen / speed;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  setCursor: function (ms) {
    var time = parseInt(ms);
    if (time) this._cursor = time;
  },

  getStartTime: function() {
    return this._startTime;
  },

  getEndTime: function() {
    return this._endTime;
  }

});
