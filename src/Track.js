L.Playback = L.Playback || {};
function search(o, v, i){
    var h = o.length, l = -1, m;
    while(h - l > 1)
        if(o[m = h + l >> 1] < v) l = m;
        else h = m;
    return o[h] != v ? i ? h : -1 : h;
}
L.Playback.Track = L.Class.extend({

        initialize : function (geoJSON, options) {
            options = options || {};
            var tickLen = options.tickLen || 250;
            var sampleTimes = geoJSON.properties.time;
            var samples = geoJSON.geometry.coordinates;
            this._staleTime = options.staleTime || 60*60*1000;
            this._fadeMarkersWhenStale = options.fadeMarkersWhenStale || false;
            
            this._geoJSON = geoJSON;
            this._tickLen = tickLen;
            this._ticks = samples;
            this._times = sampleTimes;
            this._marker = null;
            this._orientIcon = options.orientIcons;
            this._startTime = sampleTimes[0];
            this._endTime = sampleTimes[sampleTimes.length - 1];
        },

        _interpolatePoint : function (start, end, ratio) {
            try {
                var delta = [end[0] - start[0], end[1] - start[1]];
                var offset = [delta[0] * ratio, delta[1] * ratio];
                return [start[0] + offset[0], start[1] + offset[1]];
            } catch (e) {
                console.log('err: cant interpolate a point');
                console.log(['start', start]);
                console.log(['end', end]);
                console.log(['ratio', ratio]);
            }
        },
        
        _directionOfPoint:function(start,end){
            return this._getBearing(start[1],start[0],end[1],end[0]);
        },
        
        _getBearing:function(startLat,startLong,endLat,endLong){
              startLat = this._radians(startLat);
              startLong = this._radians(startLong);
              endLat = this._radians(endLat);
              endLong = this._radians(endLong);

              var dLong = endLong - startLong;

              var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
              if (Math.abs(dLong) > Math.PI){
                if (dLong > 0.0)
                   dLong = -(2.0 * Math.PI - dLong);
                else
                   dLong = (2.0 * Math.PI + dLong);
              }

              return (this._degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
        },
        
        _radians:function(n) {
          return n * (Math.PI / 180);
        },
        _degrees:function(n) {
          return n * (180 / Math.PI);
        },

        getFirstTick : function () {
            return this._ticks[0];
        },

        getLastTick : function () {
            return this._ticks[this._ticks.length - 1];
        },

        getStartTime : function () {
            return this._startTime;
        },

        getEndTime : function () {
            return this._endTime;
        },

        getTickMultiPoint : function () {
            return this._geoJSON;
        },
		
        trackPresentAtTick : function(timestamp)
        {
            return (timestamp >= this._startTime);
        },
        
        trackStaleAtTick : function(timestamp)
        {
            return ((this._endTime + this._staleTime) <= timestamp);
        },

        tick : function (timestamp) {
            if (timestamp >= this._endTime)
                return this.getLastTick();
            if (timestamp <= this._startTime)
                return this.getFirstTick();

            var samples = this._ticks;

            var times = this._times;

            var index = search(times, timestamp, true);

            var currSampleTime = times[index - 1],
                nextSampleTime = times[index],
                currSample = samples[index - 1],
                nextSample = samples[index];

            if (nextSampleTime === timestamp) {
                return nextSample;
            }

            var ratio = (timestamp - currSampleTime) / (nextSampleTime - currSampleTime);

            return this._interpolatePoint(currSample, nextSample, ratio);
        },
		
        courseAtTime: function(timestamp)
        {
            var samples = this._ticks;

            var times = this._times;

            var index = search(times, timestamp, true);

            var currSample = samples[index - 1],
                nextSample = samples[index];

            return currSample && nextSample ? this._directionOfPoint(currSample,nextSample) : 0;
        },
        
        setMarker : function(timestamp, options){
            var lngLat = null;
            
            // if time stamp is not set, then get first tick
            if (timestamp) {
                lngLat = this.tick(timestamp);
            }
            else {
                lngLat = this.getFirstTick();
            }        
        
            if (lngLat) {
                var latLng = new L.LatLng(lngLat[1], lngLat[0]);
                this._marker = new L.Playback.MoveableMarker(latLng, options, this._geoJSON);     
				if(options.mouseOverCallback) {
                    this._marker.on('mouseover',options.mouseOverCallback);
                }
				if(options.clickCallback) {
                    this._marker.on('click',options.clickCallback);
                }
				
				//hide the marker if its not present yet and fadeMarkersWhenStale is true
				if(this._fadeMarkersWhenStale && !this.trackPresentAtTick(timestamp))
				{
					this._marker.setOpacity(0);
				}
            }
            
            return this._marker;
        },
        
        moveMarker : function(latLng, transitionTime,timestamp) {
            if (this._marker) {
                if(this._fadeMarkersWhenStale) {
                    //show the marker if its now present
                    if(this.trackPresentAtTick(timestamp)) {
                        this._marker.setOpacity(1);
                    } else {
                        this._marker.setOpacity(0);
                    }
                    
                    if(this.trackStaleAtTick(timestamp)) {
                        this._marker.setOpacity(0.25);
                    }
                }
				
                if(this._orientIcon){
                    this._marker.setIconAngle(this.courseAtTime(timestamp));
                }
				
                this._marker.move(latLng, transitionTime);
            }
        },
        
        getMarker : function() {
            return this._marker;
        }

    });
