function MoveablePoint(map, startLatLng) {
  this.latLng = startLatLng;
  this.map = map;
  this.marker = L.marker(this.latLng).addTo(map);
}

MoveablePoint.prototype.move = function(latLng) {
  this.latLng = latLng;
  var marker = this.marker;
  // Only if CSS3 transitions are supported
  if (L.DomUtil.TRANSITION) {
    if (marker._icon) { marker._icon.style[L.DomUtil.TRANSITION] = ('all ' + 250 + 'ms linear'); }
    if (marker._shadow) { marker._shadow.style[L.DomUtil.TRANSITION] = 'all ' + 250 + 'ms linear'; }
  }
  this.marker.setLatLng(latLng);
}
