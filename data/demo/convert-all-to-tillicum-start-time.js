var fs              = require('fs');
var blodgett        = require('./blodgett.json');
var blueMountain    = require('./blue-mountain.json');
var drive           = require('./drive.json');
var houseToCoordley = require('./house-to-coordley.json');
var tillicum        = require('./tillicum.json');

var tillicumStart = tillicum.properties.time[0];

function convertTimes(timeArray) {
  var newTimes = [];
  var offset = tillicumStart - timeArray[0];
  timeArray.forEach(function(t) {
    newTimes.push( t + offset );
  });
  return newTimes;
}

blodgett.properties.time = convertTimes(blodgett.properties.time);
blueMountain.properties.time = convertTimes(blueMountain.properties.time);
drive.properties.time = convertTimes(drive.properties.time);
houseToCoordley.properties.time = convertTimes(houseToCoordley.properties.time);

fs.writeFile('blodgett.js', 'var blodgett = ' + JSON.stringify(blodgett,null,2), function(err){
  if (err) {
    console.log('unable to write file: ' + err);
  } else {
    console.log('success');
  }
});

fs.writeFile('blue-mountain.js', 'var blueMountain = ' + JSON.stringify(blueMountain,null,2), function(err){
  if (err) {
    console.log('unable to write file: ' + err);
  } else {
    console.log('success');
  }
});

fs.writeFile('drive.js', 'var drive = ' + JSON.stringify(drive,null,2), function(err){
  if (err) {
    console.log('unable to write file: ' + err);
  } else {
    console.log('success');
  }
});

fs.writeFile('house-to-coordley.js', 'var houseToCoordley = ' + JSON.stringify(houseToCoordley,null,2), function(err){
  if (err) {
    console.log('unable to write file: ' + err);
  } else {
    console.log('success');
  }
});