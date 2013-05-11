function Clock(tickLen, speed, startTime, endTime) {
  this.tickLen    = tickLen    || 250;
  this.speed      = speed      || 1;
  this.startTime  = startTime  || null;
  this.endTime    = endTime    || null;
  this.cursor     = startTime  || new Date().getTime();
}

var z=1;
Clock.prototype.tick = function() {
  z++;
  console.log(z);
  this.cursor += this.tickLen;
}


Clock.prototype.start = function() {
  this.intervalID = window.setInterval(this.tick, this.tickLen/this.speed);
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