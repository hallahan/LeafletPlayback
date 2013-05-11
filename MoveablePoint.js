function MoveablePoint(map, startLatLng) {
  this.latLng = startLatLng;
  this.map = map;
  this.marker = L.marker(this.latLng).addTo(map);
}

MoveablePoint.prototype.move = function(latLng) {
  this.latLng = latLng;
  this.marker.setLatLng(latLng);
}
