function Clock(tickObj, tickLen, speed, startTime, endTime) {
  this.tickObj    = tickObj;
  this.tickLen    = tickLen         || 250;
  this.speed      = speed           || 1;
  this.startTime  = startTime       || tickObj.getFirstTick();
  this.endTime    = endTime         || tickObj.getLastTick();
  this.cursor     = this.startTime  || null;
}


Clock.prototype.tick = function(self) {
  if (self.cursor > self.endTime) {
    clearInterval(self.intervalID);
    this.intervalID = null;
    return;
  }
  var obj = self.tickObj;
  if (obj instanceof Array) {
    var len = obj.length;
    for (var i=0; i<len; i++) {
      coord = obj[i].tick(self.cursor);
      console.log(['cursor coord',coord]);
    }
  } else {
    coord = obj.tick(self.cursor);
    console.log(['cursor coord', coord]);
  }
  self.cursor += self.tickLen;
}


Clock.prototype.start = function() {
  this.intervalID = window.setInterval(this.tick, this.tickLen/this.speed, this);
}


Clock.prototype.stop = function() {
  clearInterval(this.intervalID);
  this.intervalID = null;
}


Clock.prototype.changeSpeed = function(speed) {
  this.speed = speed;
  if (this.intervalID) {
    this.stop();
    this.start();
  }
}


Clock.prototype.setCursor = function(ms) {
  this.cursor = ms;
}
