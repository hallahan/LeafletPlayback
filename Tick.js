function Tick(tickPoints) {
  if (tickPoints instanceof Array) {
    this.tickPoints = tickPoints;
  } else {
    this.tickPoints = [tickPoints];
  }
  this.tockObj = new MoveablePoint(map,this.tickPoints[0].getFirstTick());
}


Tick.prototype.tock = function(ms) {
  var tickPoints = this.tickPoints;
  var len = tickPoints.length;
  for(var i=0; i<len; i++) {
    var tickPoint = tickPoints[i];
    var latLng = tickPoint.tick(ms);
    this.tockObj.move(latLng);
  }
}
