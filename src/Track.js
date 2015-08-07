L.Playback = L.Playback || {};


        
L.Playback.Track = L.Class.extend({

        initialize : function (geoJSON, options) {
            options = options || {};
            var tickLen = options.tickLen || 250;
            this._staleTime = options.staleTime || 60*60*1000;
            this._fadeMarkersWhenStale = options.fadeMarkersWhenStale || false;
            
            this._geoJSON = geoJSON;
            this._tickLen = tickLen;
            this._ticks = [];
            this._marker = null;
			this._orientations = [];
			
            var sampleTimes = geoJSON.properties.time;
			
            this._orientIcon = options.orientIcons;
            var previousOrientation;
			
            var samples = geoJSON.geometry.coordinates;
            var currSample = samples[0];
            var nextSample = samples[1];
			
            var currSampleTime = sampleTimes[0];
            var t = currSampleTime;  // t is used to iterate through tick times
            var nextSampleTime = sampleTimes[1];
            var tmod = t % tickLen; // ms past a tick time
            var rem,
            ratio;

            // handle edge case of only one t sample
            if (sampleTimes.length === 1) {
                if (tmod !== 0)
                    t += tickLen - tmod;
                this._ticks[t] = samples[0];
				this._orientations[t] = 0;
                this._startTime = t;
                this._endTime = t;
                return;
            }

            // interpolate first tick if t not a tick time
            if (tmod !== 0) {
                rem = tickLen - tmod;
                ratio = rem / (nextSampleTime - currSampleTime);
                t += rem;
                this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
				this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                previousOrientation = this._orientations[t];
            } else {
                this._ticks[t] = currSample;
				this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                previousOrientation = this._orientations[t];
            }

            this._startTime = t;
            t += tickLen;
            while (t < nextSampleTime) {
                ratio = (t - currSampleTime) / (nextSampleTime - currSampleTime);
                this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
				this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                previousOrientation = this._orientations[t];
                t += tickLen;
            }

            // iterating through the rest of the samples
            for (var i = 1, len = samples.length; i < len; i++) {
                currSample = samples[i];
                nextSample = samples[i + 1];
                t = currSampleTime = sampleTimes[i];
                nextSampleTime = sampleTimes[i + 1];

                tmod = t % tickLen;
                if (tmod !== 0 && nextSampleTime) {
                    rem = tickLen - tmod;
                    ratio = rem / (nextSampleTime - currSampleTime);
                    t += rem;
                    this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
					if(nextSample){
                        this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                        previousOrientation = this._orientations[t];
                    } else {
                        this._orientations[t] = previousOrientation;    
                    }
                } else {
                    this._ticks[t] = currSample;
                    if(nextSample){
                        this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                        previousOrientation = this._orientations[t];
                    } else {
                        this._orientations[t] = previousOrientation;    
                    }
                }

                t += tickLen;
                while (t < nextSampleTime) {
                    ratio = (t - currSampleTime) / (nextSampleTime - currSampleTime);
                    
                    if (nextSampleTime - currSampleTime > options.maxInterpolationTime){
                        this._ticks[t] = currSample;
                        
						if(nextSample){
                            this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                            previousOrientation = this._orientations[t];
                        } else {
                            this._orientations[t] = previousOrientation;    
                        }
                    }
                    else {
                        this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
						if(nextSample) {
                            this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                            previousOrientation = this._orientations[t];
                        } else {
                            this._orientations[t] = previousOrientation;    
                        }
                    }
                    
                    t += tickLen;
                }
            }

            // the last t in the while would be past bounds
            this._endTime = t - tickLen;
            this._lastTick = this._ticks[this._endTime];

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
            return this._ticks[this._startTime];
        },

        getLastTick : function () {
            return this._ticks[this._endTime];
        },

        getStartTime : function () {
            return this._startTime;
        },

        getEndTime : function () {
            return this._endTime;
        },

        getTickMultiPoint : function () {
            var t = this.getStartTime();
            var endT = this.getEndTime();
            var coordinates = [];
            var time = [];
            while (t <= endT) {
                time.push(t);
                coordinates.push(this.tick(t));
                t += this._tickLen;
            }

            return {
                type : 'Feature',
                geometry : {
                    type : 'MultiPoint',
                    coordinates : coordinates
                },
                properties : {
                    time : time
                }
            };
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
            if (timestamp > this._endTime)
                timestamp = this._endTime;
            if (timestamp < this._startTime)
                timestamp = this._startTime;
            return this._ticks[timestamp];
        },
		
        courseAtTime: function(timestamp)
        {
            //return 90;
            if (timestamp > this._endTime)
               timestamp = this._endTime;
            if (timestamp < this._startTime)
                timestamp = this._startTime;
            return this._orientations[timestamp];
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
