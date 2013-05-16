function intermediatePoint(lat1, lng1, lat2, lng2, f) {
  var d, A, B, x, y, z, sinDLat, sinDLon, sinD, cosLat1, cosLat2;
  sinDLat = Math.sin(lat1 - lat2);
  sinDLon = Math.sin(lon1 - lon2);
  cosLat1 = Math.cos(lat1);
  cosLat2 = Math.cos(lat2);

  d = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat / 4 + cosLat1 * cosLat2 * sinDLon * sinDLon / 4));
  sinD = Math.sin(d);
  A = Math.sin((1 - f) * d) / sinD;
  B = Math.sin(f * d) / sinD;
  x = A * cosLat1 * Math.cos(lon1) + B * cosLat2 * Math.cos(lon2);
  y = A * cosLat1 * Math.sin(lon1) + B * cosLat2 * Math.sin(lon2);
  z = A * Math.sin(lat1) + B * Math.sin(lat2);
  lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  lng = Math.atan2(y, x);
  return [lat, lng];
}