# Leaflet Playback

Leaflet Playback provides the ability to replay GPS Tracks in the form of GeoJSON objects. Rather than simply animating a marker along a polyline, the speed of the animation is synchroized to a clock. The playback functionality is similar to a video player--you can start and stop playback, change the playback speed, load GPS tracks, as well as set the playback time with a slider or calendar/time-picker widget.

## [View Demo: Interaction of GPS Tracks and Virtual Fences](http://leafletplayback.theoutpost.io)

![alt text](https://raw.github.com/hallahan/LeafletPlayback/master/docs/screenshots/readme.png)

The demo demonstrates the usage of the plug-in in the context of having the replay of GPS tracks trigger Virtual Fences. The location of the GPS tracks during playback are sent to Esri's [Geoloqi](https://geoloqi.com/) API which consumes location updates and fires GeoTrigger messages when a [Virtual Fence](http://en.wikipedia.org/wiki/Geo-fence) is crossed. [Read More...](https://github.com/hallahan/LeafletPlayback/blob/master/docs/demo.md)

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

