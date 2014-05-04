# Leaflet Playback

Leaflet Playback provides the ability to replay GPS Tracks in the form of GeoJSON objects. Rather than simply animating a marker along a polyline, the speed of the animation is synchroized to a clock. The playback functionality is similar to a video player--you can start and stop playback, change the playback speed, load GPS tracks, as well as set the playback time with a slider or calendar/time-picker widget.

## [View Demo](http://leafletplayback.theoutpost.io)

This demo pre-loads some GPS GeoJSON tracks and lets you play them back.

## GPS Data Format

Leaflet Playback consumes GPS tracks in the form of GeoJSON. The next feature to be implemented for the plugin is the added ability to parse GPX tracks as well. The schema of the GeoJSON data is as follows: 

```javascript
{
  "type": "Feature",
  "geometry": {
    "type": "MultiPoint",
    "coordinates": [/*array of [lng,lat] coordinates*/]
  },
  "properties": {
    "time": [/*array of UNIX timestamps*/]
  }
}
```

Other attributes may be added to the GeoJSON object, but this is the required minimum schema for the plug-in to work.

GeoJSON tracks can be added dynamically to Leaflet Playback by calling:

```javascript
playback.addTracks(tracks);
```

## Usage

```javascript
var playback = new L.Playback(map, demoTracks, clockCallback);
```

Where map is your Leaflet map object, demoTracks is a GeoJSON object or an array of GeoJSON objects, and clockCallback is a function you feed it that will send the timestamp value on each tick.

You need the following css in your HTML:

```html
<link rel="stylesheet" href="../../lib/leaflet/leaflet.css" />
<link rel="stylesheet" href="../../lib/bootstrap/css/bootstrap.css" />
<link rel="stylesheet" href="../../lib/jquery-ui/jquery-ui.css" />
<link rel="stylesheet" href="../../lib/font-awesome/css/font-awesome.css" />
<link rel="stylesheet" href="../../lib/bootstrap-timepicker/bootstrap-timepicker.css" />
<link rel="stylesheet" href="../../lib/awesome-markers/leaflet.awesome-markers.css" />
<link rel="stylesheet" href="simple.css" />
```

And you can include JavaScript file including all of the dependencies:

```html
<script src="../../dist/LeafletPlaybackWithDeps.js"></script>
<script src="simple.js"></script>
```

Or, you can explicity include the dependencies before including the library:
```html
<script src="../../lib/jquery1.9.1.js"></script>
<script src="../../lib/jquery-ui/jquery-ui.js"></script>
<script src="../../lib/bootstrap/js/bootstrap.js"></script>
<script src="../../lib/bootstrap-timepicker/bootstrap-timepicker.js"></script>
<script src="../../lib/leaflet/leaflet-src.js"></script>
<script src="../../lib/awesome-markers/leaflet.awesome-markers.js"></script>
<script src="../../dist/LeafletPlayback.js"></script>
<script src="simple.js"></script>
```
