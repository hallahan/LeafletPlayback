# Demo: Interaction of GPS Tracks and Virtual Fences

The user can draw circles with [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw), which in turn creates a GeoTrigger via the Geoloqi API. This can be done by clicking the ![alt text](https://raw.github.com/hallahan/LeafletPlayback/master/docs/screenshots/create-trigger-btn.png) button in the upper left corner.

The Edit button below that will put the Virtual Fence circles in edit mode where you can move and resize your fences.

The Trash button will put you in delete mode where clickin on the fences will remove them. Clicking the save button that subsequently pops up will persist your deletions on the server.

## Data Sources

The Leaflet basemap retries its `.png` rasters from [OpenStreetMap.org](http://openstreetmap.org) in the URL format:

```
http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

The GPS tracks were generated on my Android phone and were sent using the [Geotracks GPS Tracker](https://play.google.com/store/apps/details?id=com.geoloqi.geotracks). These tracks were retrieved with a script that I wrote that fetches all of my tracks for a given day counting backwards from today. [View Script...](https://github.com/hallahan/LeafletPlayback/blob/master/util/download-tracks.html).

The JSON that is returned is not in GeoJSON format, so [this script](https://github.com/hallahan/LeafletPlayback/blob/master/util/geoloqi-to-geojson.js) was then needed to convert that into GeoJSON. This is run using NodeJS.

The location of the Virtual Fences as well as the notifications are retrieved dynamically from Esri's [Geoloqi API](https://developers.geoloqi.com/api) using the [JavaScript client](https://developers.geoloqi.com/client-libraries/javascript).

## Issues

The location of the GPS points is sent during replay with the current timestamp, because the GeoTriggers are designed to be a real-time service and do not take into account sending messages for past actions. The current timestamp in reality is sent instead. This becomes a problem, because the API only deals with time in the granularity of a single seconds, and when we have 5 locations sent for the same second, only one of them gets registered for the trigger. The location that is actually registered is indeterminate, seemingly random.

One possible solution may be to get the last recorded location timestamp and simply increment each update by a second rather than using the current time. This will only work for sparse use in the demo and is still a hack.

If you look at the multiuser branch, I attempted to solve this problem by logging in multiple users, one for each GPS Track. See [GeoTriggers.js#L40](https://github.com/hallahan/LeafletPlayback/blob/multiuser/demo/GeoTriggers.js#L40) and [GeoTriggers.js#L10](https://github.com/hallahan/LeafletPlayback/blob/multiuser/demo/GeoTriggers.js#L10). This works for about 15 seconds, but then thousands of errors are thrown by `geoloqi.js`.

For the use case of this demo, it might make more sense to detect when GPS tracks cross into a Virtual Fence within the browser rather than a web service. The fences can be retrieved from a server, but the colision of the moving points should instead be detected by the client.
