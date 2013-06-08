# Leaflet Playback

Leaflet Playback provides the ability to replay GPS Tracks in the form of GeoJSON objects. Rather than simply animating a marker along a polyline, the speed of the animation is synchroized to a clock. The playback functionality is similar to a video player--you can start and stop playback, change the playback speed, load GPS tracks, as well as set the playback time with a slider or calendar/time-picker widget.

## [View Demo](http://leafletplayback.theoutpost.io)

![alt text](https://raw.github.com/hallahan/LeafletPlayback/master/docs/screenshots/readme.png)

The demo demonstrates the usage of the plug-in in the context of having the replay of GPS tracks trigger Virtual Fences. The location of the GPS tracks during playback are sent to Esri's [Geoloqi](https://geoloqi.com/) API which consumes location updates and fires GeoTrigger messages when a [Virtual Fence](http://en.wikipedia.org/wiki/Geo-fence) is crossed.

The user can draw circles with [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw), which in turn creates a GeoTrigger via the Geoloqi API.

## GPS Data Format

Leaflet Playback consumes GPS tracks in the form of GeoJSON. The next feature to be implemented for the plugin is the added ability to parse GPX tracks as well. The schema of the GeoJSON data is as follows: 


