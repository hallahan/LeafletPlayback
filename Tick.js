function Tick(tickPoints) {
  if (tickPoints instanceof Array) {
    this.tickPoints = tickPoints;
  } else {
    this.tickPoints = [tickPoints];
  }
  var first = this.tickPoints[0].getFirstTick();
  var latLng = new L.LatLng(first[1],first[0]);
  this.tockObj = new MoveablePoint(map,latLng);
}


Tick.prototype.tock = function(ms) {
  var tickPoints = this.tickPoints;
  var len = tickPoints.length;
  for(var i=0; i<len; i++) {
    var tickPoint = tickPoints[i];
    var lngLat = tickPoint.tick(ms);
    var latLng = new L.LatLng(lngLat[1],lngLat[0]);
    this.tockObj.move(latLng);
    $('#cursor-time').val(ms.toString());
    $('#cursor-latlng').html(latLng.lat+', '+latLng.lng);
  }
}


Tick.prototype.getStartTime = function() {
  return this.tickPoints[0].getStartTime();
}


Tick.prototype.getEndTime = function() {
  return this.tickPoints[0].getEndTime();
}