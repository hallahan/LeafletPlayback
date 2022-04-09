L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({    
    initialize: function (startLatLng, options, feature) {
        this.index = 0;
        this.feature = feature;
        this.marker_options = options.marker || {};

        if (jQuery.isFunction(this.marker_options)){        
            this.marker_options = this.marker_options(this.feature, this.index);
        }
        
        L.Marker.prototype.initialize.call(this, startLatLng, this.marker_options);
        
        this.popupContent = '';
		        
        if(this.marker_options.popups)
        {
            this.bindPopup(this.getPopupContent() + startLatLng.toString());
        }

        if (this.marker_options.getPopup) {
            this.bindPopup(this.getPopupContent());            
        }
        	
        if(this.marker_options.labels)
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
        // if (this.popupContent !== '') {
        //     return this.popupContent;
        // }

        if (this.marker_options.getPopup) {
            this.popupContent = this.marker_options.getPopup(
              this.feature,
              this.index
            );
            return this.popupContent
        }
        // If no getPopup function is found in the options a default popup content is set
        return this._latlng.toString();
    },

    move: function (latLng, transitionTime, index) {
        if (index > -1) this.index = index;
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
        
        if (this.marker_options.getIcon) {
            icon = this.marker_options.getIcon(this.feature, this.index);
            this.setIcon(icon);
        }

        if (this._popup) {
            this._popup.setContent(this.getPopupContent());
        }    
    },
    
    // modify leaflet markers to add our rotation code
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
