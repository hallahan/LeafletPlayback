function TickPoint(geoJSON, tickLen) {
  this.geoJSON = geoJSON;
  this.tickLen = tickLen || 250;
  this.ticks = [];

  var sampleTimes = geoJSON.properties.time;
  this.startTime = sampleTimes[0];
  this.endTime = sampleTimes[sampleTimes.length-1];

  var samples = geoJSON.geometry.coordinates;
  var len = samples.length;
  for (var i=0; i<len; i++) {
    var startTime = sampleTimes[i];
    var endTime = sampleTimes[i+1];
    var clockTime = startTime;
    var startSample = samples[i];
    var endSample = samples[i+1];

    // If we are on the last sample and it is on a clock
    // tick, we add its value to the last clock tick.
    if (!endSample) {
      this.ticks[clockTime] = startSample;
      break;
    }

    // If a sample time is not a clock tick, 
    // increment t to the next valid tick time
    var tmod = startTime % tickLen;
    if (tmod !== 0) {
      clockTime += tickLen - tmod;
      var ratio = (clockTime-startTime)/(endTime-startTime);
      this.ticks[clockTime] = interpolatePoint(startSample, endSample, ratio);
    } else {
      this.ticks[clockTime] = startSample;
    }
    clockTime += tickLen;
    while(clockTime < endTime) {
      var ratio = (clockTime-startTime)/(endTime-startTime);
      this.ticks[clockTime] = interpolatePoint(startSample, endSample, ratio);
      clockTime += tickLen;
    }
  }
}


function interpolatePoint(start, end, ratio) {
  var delta = [end[0]-start[0], end[1]-start[1]];
  var offset = [delta[0]*ratio, delta[1]*ratio];
  return [start[0]+offset[0], start[1]+offset[1]];
}

// NH needs refactoring
TickPoint.prototype.getFirstTick = function() {
  if (this.firstTick)
    return this.ticks[this.firstTick];

  var tmod = this.startTime % this.tickLen;
  if (tmod === 0) {
    this.firstTick = this.startTime;
    return this.ticks[this.firstTick];
  } 

  this.firstTick = this.startTime + (this.tickLen - tmod);
  return this.ticks[this.firstTick];
}

// NH needs refactoring
TickPoint.prototype.getStartTime = function() {
  if (this.firstTick)
    return this.firstTick;

  var tmod = this.startTime % this.tickLen;
  if (tmod === 0) {
    this.firstTick = this.startTime;
    return this.firstTick;
  } 

  this.firstTick = this.startTime + (this.tickLen - tmod);
  return this.firstTick;
}

// NH needs refactoring
TickPoint.prototype.getLastTick = function() {
  if (this.lastTick)
    return this.ticks[this.lastTick];

  var tmod = this.endTime % this.tickLen;
  if (tmod ===0) {
    this.lastTick = this.endTime;
    return this.ticks[this.lastTick];
  }

  this.lastTick = this.endTime - tmod;
  return this.ticks[this.lastTick];
}

// NH needs refactoring
TickPoint.prototype.getEndTime = function() {
  if (this.lastTick)
    return this.lastTick;

  var tmod = this.endTime % this.tickLen;
  if (tmod ===0) {
    this.lastTick = this.endTime;
    return this.lastTick;
  }

  this.lastTick = this.endTime - tmod;
  return this.lastTick;
}


// Returns tick points as geoJSON
TickPoint.prototype.getTickMultiPoint = function() {
  var tick = this.getFirstTick();
  var lastTick  = this.getLastTick();
  var tickLen = this.tickLen;
  var coordinates = [];
  var time = [];

  while (tick <= lastTick) {
    time.push(tick);
    coordinates.push(this.ticks[tick]);
    tick += tickLen;
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
}


TickPoint.prototype.tick = function(ms) {
  return this.ticks[ms];
}
