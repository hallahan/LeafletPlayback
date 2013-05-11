function MoveablePoint(map, startCoord, options) {
  this.latLng = new L.LatLng(startCoord[1],startCoord[0]);
  this.map = map;
  this.startCoord = startCoord;
  this.options = options;
  this.marker = L.marker(this.latLng).addTo(map);
}

MoveablePoint.prototype.move = function(coord, ms) {
  this.latLng = new L.LatLng(coord[1],coord[0]);
  this.marker.setLatLng(this.latLng);
}
