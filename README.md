# LeafletPlayback

Leaflet Playback provides the ability to replay GPS Tracks in the form of GeoJSON objects. Rather than simply animating a marker along a polyline, the speed of the animation is synchroized to a clock. The playback functionality is similar to a video player--you can start and stop playback, change the playback speed, load GPS tracks, as well as set the playback time with a slider or calendar/time-picker widget.

## Examples

### [Example 0](http://leafletplayback.theoutpost.io/examples/example_0.html)

Basic example of LeafletPlayback plugin, that pre-loads some GPS GeoJSON tracks and lets you play them back.

### [Example 1](http://leafletplayback.theoutpost.io/examples/example_1.html)

Use vis.js timeline as slider control

### [Example 2](http://leafletplayback.theoutpost.io/examples/example_2.html)

Custom interface example - Includes the usage of Maki Markers and Twitter Bootstrap.

### [Virtual Fence Demo](http://virtualfence.theoutpost.io/)
I began my work on LeafletPlayback in my web mapping class at [Oregon State University](http://cartography.oregonstate.edu/). My final project involved animating GPS tracks that triggered geo-fences. _Note: this may stop working on August 2015 when Geoloqui will discontinue their web services._

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

There are three leaflet controls defined in `src/Controls.js`: 

1. L.Playback.DateControl - Current tick date/time;
2. L.Playback.PlayControl -  Play/stop button to control time flow of LeafletPlayback;
3. L.Playback.SliderControl - Simple time slider;

# Usage

## API

### new L.Playback(map, geoJSON, onPlaybackTimeChange, options)

### Options

```javascript
var playback = new L.Playback(map, geoJSON, onPlaybackTimeChange, options);
```

* `map` - LeafLet map object. **Required**.

* `geoJSON` - GeoJSON object or an array of GeoJSON objects. Pass `null` if you don't have any data yet. **Required**.

* `onPlaybackTimeChange` - A function with signature `(timestamp)` that will send the `timestamp` value on each tick. **Required**.

* `options` - An options object. **Optional**.

### options

* `tickLen` - Set tick length in miliseconds. Increasing this value, may improve performance, at the cost of animation smoothness. **Default: `250`**.

* `speed` - Set `float` multiplier for default animation speed. **Default: `1`**.

* `maxInterpolationTime` - Set max interpolation time in seconds. **Default: `5*60*1000` (5 minutes)**.

* `tracksLayer` - Set `true` if you want to show layer control on the map. **Default: `true`**.

* `playControl` - Set `true` if play button is needed. **Default: `false`**.

* `dateControl` - Set `true` if date label is needed. **Default: `false`**.

* `sliderControl` - Set `true` if slider control is needed. **Default: `false`**.

* `layer` - Object or function with signature `(featureData)` that returns geoJSON layer options object. Useful for setting path color. **Default: `{}`**.

* `marker` - Object or function with signature `(featureData)` that returns leaflet marker options, to extend `L.Playback.MoveableMarker`. Useful for custom icons. **Default: `{}`**.


### playback#setData(geoJSON)

Reset current data and add new.

* `geoJSON` - GeoJSON object or an array of GeoJSON objects. **Required**.

### playback#addData(geoJSON)

Add new data.

* `geoJSON` - GeoJSON object or an array of GeoJSON objects. **Required**.

### playback#clearData()

Clear all data and tracks layer.

## Authors and Contributors

* @hallahan - Nicholas Hallahan
* @recallfx - Marius
* @lbuter - Luke Butler
* @dgorissen - Dirk Gorissen

