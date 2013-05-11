function Clock(tickObj, tickLen, speed, startTime, endTime) {
  this.tickObj    = tickObj;
  this.tickLen    = tickLen         || 250;
  this.speed      = speed           || 1;
  this.startTime  = startTime       || tickObj.getStartTime();
  this.endTime    = endTime         || tickObj.getEndTime();
  this.cursor     = this.startTime  || null;
}


Clock.prototype.tick = function(self) {
  if (self.cursor > self.endTime) {
    clearInterval(self.intervalID);
    self.intervalID = null;
    return;
  }
  self.tickObj.tock(self.cursor);
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
