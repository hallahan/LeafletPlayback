

L.Playback.TickPoint = L.Class.extend({

  initialize: function (geoJSON, tickLen) {
    tickLen = tickLen || 250;
    this._geoJSON = geoJSON;
    this._tickLen = tickLen;
    this._ticks = [];

    var sampleTimes = geoJSON.properties.time;
    var samples = geoJSON.geometry.coordinates;
    var currSample = samples[0];
    var nextSample = samples[1];
    var t = currSampleTime = sampleTimes[0]; // t is used to iterate through tick times
    var nextSampleTime = sampleTimes[1];
    var tmod = t % tickLen; // ms past a tick time
    var rem, ratio;

    // handle edge case of only one t sample
    if (sampleTimes.length === 1) {
      if (tmod !== 0) t += tickLen - tmod;
      this._ticks[t] = samples[0];
      this._startTime = t;
      this._endTime = t;
      return;
    }

    // interpolate first tick if t not a tick time
    if (tmod !== 0) {
      rem = tickLen - tmod;
      ratio = rem / (nextSampleTime-currSampleTime);
      t += rem;
      this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
    } else {
      this._ticks[t] = currSample;
    }

    this._startTime = t;
    t += tickLen;

    while (t < nextSampleTime) {
      ratio = (t-currSampleTime) / (nextSampleTime-currSampleTime);
      this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
      t += tickLen;
    }

    // iterating through the rest of the samples
    for(var i=1, len=samples.length; i<len; i++) {
      currSample = samples[i];
      nextSample = samples[i+1];
      t = currSampleTime = sampleTimes[i];
      nextSampleTime = sampleTimes[i+1];

      tmod = t % tickLen;
      if (tmod != 0) {
        rem = tickLen - tmod;
        ratio = rem / (nextSampleTime-currSampleTime);
        t += rem;
        this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
      } else {
        this._ticks[t] = currSample;
      }

      t += tickLen;

      while (t < nextSampleTime) {
        ratio = (t-currSampleTime) / (nextSampleTime-currSampleTime);
        this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
        t += tickLen;
      }
    } 

    // the last t in the while would be past bounds
    this._endTime = t - tickLen;
    this._lastTick = this._ticks[this._endTime];

  },

  _interpolatePoint: function (start, end, ratio) {
    var delta = [end[0]-start[0], end[1]-start[1]];
    var offset = [delta[0]*ratio, delta[1]*ratio];
    return [start[0]+offset[0], start[1]+offset[1]];
  },

  getFirstTick: function() {
    return this._ticks[this._startTime];
  },

  getLastTick: function() {
    return this._ticks[this._endTime];
  },

  getStartTime: function() {
    return this._startTime;
  },

  getEndTime: function() {
    return this._endTime;
  },

  getTickMultiPoint: function() {
    var t = this.getStartTime();
    var endT = this.getEndTime();
    var tickLen = this._tickLen;
    var coordinates = [];
    var time = [];

    while (t <= endT) {
      time.push(t);
      coordinates.push(this.tick(t));
      t += this._tickLen;
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'MultiPoint',
        coordinates: coordinates
      },
      properties: {
        time: time
      }
    };
  },

  tick: function(ms) {
    return this._ticks[ms];
  }

});
