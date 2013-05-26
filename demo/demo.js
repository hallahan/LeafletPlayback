$(function() {
	//creates a new map
	map = new L.Map('map');

	//creates an ocean floor background layer
	var basemapURL = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
	var basemapLayer = new L.TileLayer(basemapURL, {
		maxZoom : 19
	});

	//centers map and default zoom level
	map.setView([44.3, -123.19], 10);

	//adds the background layer to the map
	map.addLayer(basemapLayer);

	var samples = new L.GeoJSON(data, {
		pointToLayer: function(geojson, latlng) {
			var circle = new L.CircleMarker(latlng, {radius:6});
			// circle.bindPopup(i);
			return circle;
		}
	});

	var l = {
		'Samples': samples
	};

	L.control.layers(l).addTo(map);
	map.fitBounds(samples.getBounds());

	playback = new L.Playback(map, data, clockCallback);

	map.on('mousemove', function(e) {
		$('#mouse-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	map.on('click', function(e) {
		$('#click-latlng').html(e.latlng.lat+', '+e.latlng.lng);
	});

	$('#start').click(function() {
		playback.start();
	});
	$('#stop').click(function() {
		playback.stop();
	});

	$('#set-cursor').click(function(){
		var val = $('#cursor-time').val();
		playback.setCursor(val);
		$('#time-slider').slider('value', val);
	});

	$('#start-time-txt').html(new Date(playback.getStartTime()).toString());
	$('#start-time').html(playback.getStartTime().toString());	
	$('#end-time-txt').html(new Date(playback.getEndTime()).toString());
	$('#end-time').html(playback.getEndTime().toString());
	$('#cursor-time-txt').html(new Date(playback.getTime()).toString());

	$('#time-slider').slider({
		min: playback.getStartTime(),
		max: playback.getEndTime(),
		step: playback.getTickLen(),
		value: playback.getTime(),
		slide: function( event, ui ) {
			playback.setCursor(ui.value);
			$('#cursor-time').val(ui.value.toString());
			$('#cursor-time-txt').html(new Date(ui.value).toString());
		}
	});

	$('#cursor-time').val(playback.getTime().toString());
	$('#speed').val(playback.getSpeed().toString());

	$('#speed-slider').slider({
		min: -9,
		max: 9,
		step: .1,
		value: speedToSliderVal(playback.getSpeed()),
		slide: function( event, ui ) {
			var speed = sliderValToSpeed(parseFloat(ui.value));
			playback.setSpeed(speed);
			$('#speed').val(speed);
		}
	});

	$('#set-speed').on('click', function(e) {
		var speed = parseInt($('#speed').val());
		if (!speed) return;
		playback.setSpeed(speed);
		$('#speed-slider').slider('value', speedToSliderVal(speed));
	})

	$('#close-right-panel').click(function(e){
		$('#right-panel').hide();
	});


	// Initialize the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
			draw: {
				position: 'topleft',
				polygon: {
					title: 'Draw a sexy polygon!',
					allowIntersection: false,
					drawError: {
						color: '#b00b00',
						timeout: 1000
					},
					shapeOptions: {
						color: '#bada55'
					}
				},
				circle: {
					shapeOptions: {
						color: '#662d91'
					}
				}
			},
			edit: {
				featureGroup: drawnItems
			}
		});
		map.addControl(drawControl);

		map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;

			if (type === 'marker') {
				layer.bindPopup('A popup!');
			}

			drawnItems.addLayer(layer);
		});

		map.on('draw:edited', function (e) {
			var layers = e.layers;
			var countOfEditedLayers = 0;
			layers.eachLayer(function(layer) {
				countOfEditedLayers++;
			});
			console.log("Edited " + countOfEditedLayers + " layers");
		});

		// NH TODO this doesnt work...
		// L.DomUtil.get('changeColor').onclick = function () {
		// 	drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#004a80' } } });
		// };

		// applicationId = "Pqx3g3egso1lJrbi";
  //   applicationSecret = "617e5841d4064b888ac5ce18f00edd9f";		

    applicationId = "cxo2FcLAFbTPnNfN";
    applicationSecret = "9bae726971fc4e4c909fc9c034d3b0fa";

    geotriggers = new Geotriggers.Session({
      applicationId: applicationId,
      applicationSecret: applicationSecret,
      persistSession: false,
      debug: false
    });

    // geotriggers.post("device/message", {
    //   params: {
    //     tags: ["portland"],
    //     text: "baz",
    //     data: {
    //       foo: "bar"
    //     }
    //   }
    // }).then(function(response){
    //   console.log(response);
    // },function(response){
    //   console.log(response);
    // });

		geotriggers.on("authenticated", function () {
      console.log('deviceId: ' + this.deviceId);
    });

    geotriggers.get('trigger/list').then(function(res){
    	console.log('trigger list resolved:');
    	console.log(res);
    }, function(res) {
    	console.log('trigger list rejected:');
    	console.log(res);
    });

    geotriggers.get('trigger/history').then(function(res) {
    	console.log('trigger history resolved:');
    	console.log(res);
    }, function(res) {
    	console.log('trigger history rejected:');
    	console.log(res);
    })

    navigator.geolocation.getCurrentPosition(function(position) {
    	pos = position;
    	console.log(pos);

    	// freaks out, device id undefined
    	// geotriggers.post('location/update', [{
	    // 	timestamp: pos.timestamp,
	    // 	latitude: pos.coords.latitude,
	    // 	longitude: pos.coords.longitude
	    // }]);

    });

    

});

function clockCallback(ms) {
	$('#cursor-time').val(ms.toString());
	$('#cursor-time-txt').html(new Date(ms).toString());
	$('#time-slider').slider('value', ms);
}

function speedToSliderVal(speed) {
	if (speed < 1) return -10+speed*10;
	return speed - 1;
}

function sliderValToSpeed(val) {
	if (val < 0) return parseFloat((1+val/10).toFixed(2));
	return val + 1;
}