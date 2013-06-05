var fs = require('fs');

fs.readdirSync('./geoloqi-json').forEach(function(file) {
  var geoloqi = require('./geoloqi-json/' + file);

  var geojson = {
    type: 'Feature',
    geometry: {
      type: 'MultiPoint',
      coordinates: []
    },
    properties: {
      time: [],
      speed: [],
      altitude: [],
      heading: [],
      horizontal_accuracy: [],
      vertical_accuracy: [],
      raw: []
    },
    bbox: []
  };

  geojson.bbox[0] = [geoloqi.bounds.sw.longitude, geoloqi.bounds.sw.latitude];
  geojson.bbox[1] = [geoloqi.bounds.sw.longitude, geoloqi.bounds.ne.latitude];
  geojson.bbox[2] = [geoloqi.bounds.ne.longitude, geoloqi.bounds.ne.latitude];
  geojson.bbox[3] = [geoloqi.bounds.ne.longitude, geoloqi.bounds.sw.latitude];

  var points = geoloqi.points;
  var len = points.length;
  for(var i=0;i<len;i++){
    var point = points[i];
    var pos = point.location.position;
    geojson.geometry.coordinates[i] = [pos.longitude,pos.latitude];
    var prop = geojson.properties;
    prop.time[i] = new Date(point.date).getTime();
    prop.speed[i] = pos.speed;
    prop.altitude[i] = pos.altitude;
    prop.heading[i] = pos.heading;
    prop.horizontal_accuracy[i] = pos.horizontal_accuracy;
    prop.vertical_accuracy[i] = pos.vertical_accuracy;
  }

  fs.writeFile('./geo-json/' + file , JSON.stringify(geojson,null,2), function(err){
    if (err) {
      console.log('unable to write file: ' + err);
    } else {
      console.log('success');
    }
  });
});
