function MoveablePoint(map, startCoord) {
  this.latLng = new L.LatLng(startCoord[1],startCoord[0]);
  this.map = map;
  this.startCoord = startCoord;
  this.marker = L.marker(this.latLng).addTo(map);
}

MoveablePoint.prototype.move = function(latLng) {
  this.latLng = latLng;
  this.marker.setLatLng(latLng);
}
