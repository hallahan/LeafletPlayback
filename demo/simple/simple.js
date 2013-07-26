$(function() {

  // These are just some pre-loaded demo tracks, you don't need this.
  var demoTracks = [blodgett, blueMountain, drive, houseToCoordley, tillicum];

  //creates a new map
  var map = new L.Map('map');

  var basemapURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var basemapLayer = new L.TileLayer(basemapURL, {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
  	maxZoom : 19
  });

  // centers map and default zoom level
  map.setView([44.44751, -123.49], 10);

  // adds the background layer to the map
  map.addLayer(basemapLayer);

  // I made playback global so you can call methods on it
  // from the console.
  playback = new L.Playback(map, demoTracks);

});
