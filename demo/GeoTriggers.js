
function GeoTriggers(featureGroup, callback) {
  this.featureGroup = featureGroup;
  this.callback = callback;

  geoloqi.init({
    client_id: "d8e57ca4439b8ac89bc0be27c4ed9b8e"
  });

  this.login();
  this.logLayers();
  this.logPlaces();
  this.logTriggers();
  this.showPlaces();
}


GeoTriggers.prototype.getProfile = function() {
  geoloqi.get('account/profile', function(result, error) {
    console.log(result);
  });
}


GeoTriggers.prototype.login = function() {
  geoloqi.login({username:"LeafletPlayback2",password:"LeafletPlayback2"});
}


GeoTriggers.prototype.logLayers = function() {
  geoloqi.get('layer/list', function(res) {
    console.log(['layer/list', res]);
  });
}


GeoTriggers.prototype.logPlaces = function() {
  geoloqi.get("place/list", {
    "layer_id": "7j6V"
  }, function(response, error) {
    console.log(['place/list', response || error]);
  });
}


GeoTriggers.prototype.logTriggers = function() {
  geoloqi.get("place/list", {
    "layer_id": "7j6V"
  }, function(res, err) {
    if (err) {
      console.log(["place/list ERROR for logging triggers", err]);
      return;
    }
    var places = res.places;
    for (var i=0, len=places.length; i<len; i++) {
      var place = places[i];
      geoloqi.get("trigger/list", {
        "place_id": place.place_id
      }, function(res, err) {
        console.log(['triggers for place',res.triggers]);
      });
    }
  });
}


GeoTriggers.prototype.showPlaces = function() {
  var self = this;
  geoloqi.get("place/list", {
    "layer_id": "7j6V"
  }, function(res, err) {
    if (err) {
      console.log(['err showing places',err]);
      return;
    }
    var places = res.places;
    for (var i=0, len=places.length; i<len; i++) {
      var place = places[i];
      var latlng = new L.LatLng(place.latitude,place.longitude);
      var radius = place.radius;
      var circle = new L.Circle(latlng, radius, {
        color: '#FF9500',
        fillColor: '#FF9500'
      });
      var popup = new L.Popup();
      popup.setContent(JSON.stringify(place,null,2));
      circle.bindPopup(popup);
      self.featureGroup.addLayer(circle);
    }
  });
}


GeoTriggers.prototype.updateLocation = function() {
  var latlng = playback.tick.getMarkers()[0].getLatLng();
  var timestamp = playback.getTime();
  var timeString = new Date().toISOString();

  var points = [{
    date: timeString,
    location: {
      type: 'point',
      position: {
        latitude: latlng.lat,
        longitude: latlng.lng
      }
    },
    client: {
      platform: 'LeafletPlayback',
      hardware: 'browser',
      name: 'LeafletPlayback',
      version: '0.0.1'
    },
    raw: {
      inBrowser: true,
      simulation: true,
      clockTime: timestamp,
      application: 'LeafletPlayback',
      version: '0.0.1'
    }
  }];

  geoloqi.post('location/update', points, function(res, err) {
    // console.log(['location/update',res||err]);
  });
}


GeoTriggers.prototype._poll = function() {
  var updated = false;
  var self = this;
  self.updateLocation();
  geoloqi.get("trigger/history", {}, function(res, err) {
    this.triggerHistory = res.history;
    console.log(['triggerHistory', res.history]);

    // poll timer
    self._timeoutID = window.setTimeout(function(self) {
      self._poll();
    }, 1000, self);
  });
  
}


GeoTriggers.prototype.startPolling = function() {
  if (this._timeoutID) return;
  this._poll();
}


GeoTriggers.prototype.stopPolling = function() {
  if (this._timeoutID) {
    window.clearTimeout(this._timeoutID);
    this._timeoutID = null;
  }
}
