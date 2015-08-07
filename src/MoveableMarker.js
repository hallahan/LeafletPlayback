L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({    
    initialize: function (startLatLng, options, feature) {    
        var marker_options = options.marker || {};

        if (jQuery.isFunction(marker_options)){        
            marker_options = marker_options(feature);
        }
        
        L.Marker.prototype.initialize.call(this, startLatLng, marker_options);
        
        this.popupContent = '';
        this.feature = feature;
		
        if (marker_options.getPopup){
            this.popupContent = marker_options.getPopup(feature);            
        }
        
        if(options.popups)
        {
            this.bindPopup(this.getPopupContent() + startLatLng.toString());
        }
        	
        if(options.labels)
        {
            if(this.bindLabel)
            {
                this.bindLabel(this.getPopupContent());
            }
            else
            {
                console.log("Label binding requires leaflet-label (https://github.com/Leaflet/Leaflet.label)");
            }
        }
    },
    
    getPopupContent: function() {
        if (this.popupContent !== ''){
            return '<b>' + this.popupContent + '</b><br/>';
        }
        
        return '';
    },

    move: function (latLng, transitionTime) {
        // Only if CSS3 transitions are supported
        if (L.DomUtil.TRANSITION) {
            if (this._icon) { 
                this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
                if (this._popup && this._popup._wrapper)
                    this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
            }
            if (this._shadow) { 
                this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear'; 
            }
        }
        this.setLatLng(latLng);
        if (this._popup) {
            this._popup.setContent(this.getPopupContent() + this._latlng.toString());
        }    
    },
    
    // modify leaflet markers to add our roration code
    /*
     * Based on comments by @runanet and @coomsie 
     * https://github.com/CloudMade/Leaflet/issues/386
     *
     * Wrapping function is needed to preserve L.Marker.update function
     */
    _old__setPos:L.Marker.prototype._setPos,
    
    _updateImg: function (i, a, s) {
        a = L.point(s).divideBy(2)._subtract(L.point(a));
        var transform = '';
        transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
        transform += ' rotate(' + this.options.iconAngle + 'deg)';
        transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
        i.style[L.DomUtil.TRANSFORM] += transform;
    },
    setIconAngle: function (iconAngle) {
        this.options.iconAngle = iconAngle;
        if (this._map)
            this.update();
    },
    _setPos: function (pos) {
        if (this._icon) {
            this._icon.style[L.DomUtil.TRANSFORM] = "";
        }
        if (this._shadow) {
            this._shadow.style[L.DomUtil.TRANSFORM] = "";
        }

        this._old__setPos.apply(this, [pos]);
        if (this.options.iconAngle) {
            var a = this.options.icon.options.iconAnchor;
            var s = this.options.icon.options.iconSize;
            var i;
            if (this._icon) {
                i = this._icon;
                this._updateImg(i, a, s);
            }

            if (this._shadow) {
                // Rotate around the icons anchor.
                s = this.options.icon.options.shadowSize;
                i = this._shadow;
                this._updateImg(i, a, s);
            }

        }
    }
});
