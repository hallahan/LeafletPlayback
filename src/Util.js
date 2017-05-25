L.Playback = L.Playback || {};

L.Playback.Util = L.Class.extend({
  statics: {

    DateStr: function(time) {
      return new Date(time).toDateString();
    },

    TimeStr: function(time) {
      var d = new Date(time);
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();
      var tms = time / 1000;
      var dec = (tms - Math.floor(tms)).toFixed(2).slice(1);
      var mer = 'AM';
      if (h > 11) {
        h %= 12;
        mer = 'PM';
      }
      if (h === 0) h = 12;
      if (m < 10) m = '0' + m;
      if (s < 10) s = '0' + s;
      return h + ':' + m + ':' + s + dec + ' ' + mer;
    },

    ParseGPX: function(gpx) {

	  var geojsonRoot = {
        type: 'FeatureCollection',
		features : []
      };


      var parser = new DOMParser();
      var xml = parser.parseFromString(gpx, "text/xml");
      
      var trks = xml.getElementsByTagName('trk');
      for (var trackIdx=0, numberOfTracks=trks.length; trackIdx<numberOfTracks; trackIdx++) {

        var track = trks[trackIdx];
        var geojson = {
          type: 'Feature',
          geometry: {
            type: 'MultiPoint',
            coordinates: []
          },
          properties: {
            trk : {},
            time: [],
            speed: [],
            altitude: [],
            bbox: []
          }
        };

        geojson.properties.trk.name = track.getElementsByTagName('name')[0].textContent;
        if (track.getElementsByTagName('desc')[0] !== undefined) {
          geojson.properties.trk.desc = track.getElementsByTagName('desc')[0].textContent;
        }
        if (track.getElementsByTagName('type')[0] !== undefined) {
          geojson.properties.trk.type = track.getElementsByTagName('type')[0].textContent;
        }
        if (track.getElementsByTagName('src')[0] !== undefined) {
          geojson.properties.trk.src = track.getElementsByTagName('src')[0].textContent;
        }

        var pts = track.getElementsByTagName('trkpt');
        for (var i=0, len=pts.length; i<len; i++) {
          var p = pts[i];
          var lat = parseFloat(p.getAttribute('lat'));
          var lng = parseFloat(p.getAttribute('lon'));
          var timeStr = p.getElementsByTagName('time')[0].textContent;
          var eleStr =  p.getElementsByTagName('ele')[0] !== undefined ? p.getElementsByTagName('ele')[0].textContent : null;
          var t = new Date(timeStr).getTime();
          var ele = parseFloat(eleStr);

          var coords = geojson.geometry.coordinates;
          var props = geojson.properties;

          var time = props.time;
          var altitude = geojson.properties.altitude;

          coords.push([lng,lat]);
          time.push(t);
          altitude.push(ele);
        }
        geojsonRoot.features.push(geojson);
      }

      return geojsonRoot;

    }
  }

});
