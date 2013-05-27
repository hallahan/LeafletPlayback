
function GeoTriggers(featureGroup) {
  this.featureGroup = featureGroup;

  geoloqi.init({
    client_id: "d1aaa02788a021d52a2a3677da339a3f"
  });

  // geoloqi.auth = {'access_token': 'a9751-351dce0d5fc8974c1dda3425653b8410691ac22e'};

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
  geoloqi.login({username:"nick",password:"sempervirens"});
}

//"7gWX" NickTriggers
GeoTriggers.prototype.logLayers = function() {
  geoloqi.get('layer/list', function(res) {
    console.log(['layer/list', res]);
  });
}

GeoTriggers.prototype.logPlaces = function() {
  geoloqi.get("place/list", {
    "layer_id": "7gWX"
  }, function(response, error) {
    console.log(['place/list', response || error]);
  });
}

GeoTriggers.prototype.logTriggers = function() {
  geoloqi.get("place/list", {
    "layer_id": "7gWX"
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
    "layer_id": "7gWX"
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