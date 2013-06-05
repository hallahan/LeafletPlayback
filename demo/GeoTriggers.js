LAYER_ID = "7j6V";

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
  this.showTriggers();
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
    "layer_id": LAYER_ID
  }, function(response, error) {
    console.log(['place/list', response || error]);
  });
}

// NOTE: Requesting triggers with 'trigger/list' does NOT
// work. Something is broken with the API.
GeoTriggers.prototype.logTriggers = function() {
  geoloqi.get("place/list", {
    "layer_id": LAYER_ID
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


// I have to do it this way, because we can only get 
// triggers by the place_id. layer_id does not work
GeoTriggers.prototype.showTriggers = function() {
  var self = this;
  geoloqi.get("place/list", {
    "layer_id": LAYER_ID
  }, function(res, err) {
    if (err) {
      console.log(["place/list ERROR for showTriggers", err]);
      return;
    }
    var places = res.places;
    for (var i=0, len=places.length; i<len; i++) {
      var place = places[i];
      geoloqi.get("trigger/list", {
        "place_id": place.place_id
      }, function(res, err) {
        if (err) {
          console.log(['err showTriggers', err]);
          return;
        }
        var triggers = res.triggers;
        for(var i=0, len=triggers.length; i < len; i++) {
          self._displayTrigger(triggers[i]);
        }
      });
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
    var history = this.triggerHistory = res.history;
    console.log(['triggerHistory', res.history]);

    for(var i=0, len = history.length; i<len; i++) {
      var trigger = history[i];
      var time = new Date(trigger.date);
      var title = trigger.place.name;
      var message = trigger.trigger.text;
      var visits = trigger.place.visits || 0;
      
    }

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


GeoTriggers.prototype.createTrigger = function(args) {
  var self = this;
  geoloqi.post("place/create", {
    layer_id: LAYER_ID,
    latitude: args.lat,
    longitude: args.lng,
    radius: args.radius,
    name: args.name
  }, function(res, err){
      console.log('place/create');
      if (err) {
        console.log('err');
        console.log(err);
        return;
      }
      if (res) {
        console.log(res);

        geoloqi.post('trigger/create', {
          place_id: res.place_id,
          type: 'message',
          text: args.message,
          one_time: 0
        }, function(res,err) {
          console.log('trigger/create');
          console.log(res||err);
          if (res)
            self._displayTrigger(res);
    
        });
      }
  });
}


GeoTriggers.prototype._displayTrigger = function(trigger) {
  var place = trigger.place;
  var latlng = new L.LatLng(place.latitude,place.longitude);
  var radius = place.radius;
  var circle = new L.Circle(latlng, radius, {
    color: '#FF9500',
    fillColor: '#FF9500'
  });
  var popup = new L.Popup();
  console.log(['trigger', trigger]);

  var title = trigger.place.name;
  var message = trigger.text;
  var visits = trigger.place.visits || 0;

  var html = 
'<legend>' + title + '</legend>' +
'<p>' + message + '</p>' +
'<p>Visits: <span class="badge badge-info">' + visits + '</span></p>' +
'<div class="btn-group">' +
'  <button class="btn btn-danger"><i class="icon-trash"></i> Delete</button>' +
'  <button class="btn btn-info"><i class="icon-edit"></i> Edit Details</button>' +
'  <button class="btn btn-success"><i class="icon-move"></i> Move</button>' +
'</div>';

  popup.setContent(html);
  circle.bindPopup(popup);
  circle.placeId = place.place_id;
  this.featureGroup.addLayer(circle);
}


GeoTriggers.prototype.editTrigger = function(args) {
  geoloqi.post('place/update/' + args.placeId, {
    latitude: args.latlng.lat,
    longitude: args.latlng.lng,
    radius: args.radius
  }, function(res,err) {
    console.log('place/update/' + args.placeId);
    console.log(res||err);
  });
}


GeoTriggers.prototype.deleteTrigger = function(placeId) {
  geoloqi.post('place/delete/'+placeId, {}, function(res,err) {
    console.log('place/delete/'+placeId);
    console.log(res||err);
  });
}
