$(function() {

  //creates a new map
  map = new L.Map('map');

  var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

  // centers map and default zoom level
  map.setView([44, -99], 5);

  // adds the background layer to the map
  map.addLayer(basemapLayer);

  // I made playback global so you can call methods on it
  // from the console. You can leave out the second argument
  // if you do not want to preload tracks.
  playback = new L.Playback(map, demoTracks);

});
