L.Playback = L.Playback || {};

L.Playback.MoveableMarker = L.Marker.extend({
    initialize: function (startLatLng, options, feature) {
        var marker_options = options.marker || {};

        if (jQuery.isFunction(marker_options)) {
            marker_options = marker_options(feature);
        }

        L.Marker.prototype.initialize.call(this, startLatLng, marker_options);

        this.popupContent = '';
        this.popupOptions = {};
        this.tooltipContent = '';
        this.locationWrapper = {};
        this.tooltipOptions = {};
        this.feature = feature;

        if (marker_options.getPopup) {
            this.popupContent = marker_options.getPopup(feature);
        }

        if (marker_options.getTooltip) {
            this.tooltipContent = marker_options.getTooltip(feature);
        }

        if (marker_options.getLocationWrapper) {
            this.locationWrapper = marker_options.getLocationWrapper(feature);
        }

        if (marker_options.getTooltipOptions) {
            this.tooltipOptions = marker_options.getTooltipOptions(feature);
        }

        newLatLng = this.latlngCoords(startLatLng, null);
        if (options.getLocationWrapper) {
            this.locationWrapper = marker_options.getLocationWrapper;
            newLatLng = this.latlngCoords(startLatLng, this.locationWrapper);
        }

        if (options.popups) {
            popupLabel = this.getPopupContent() + this.newLatLng;
            this.bindPopup(popupLabel, this.getPopupOptions());
        }

        if (options.tooltips) {
            tooltipLabel = this.getTooltipContent() + this.newLatLng;
            this.bindTooltip(tooltipLabel, this.getTooltipOptions());
        }
    },

    getPopupContent: function () {
        if (this.popupContent !== '') {
            return this.popupContent;
        } else {
            return "";
        }

    },

    getPopupOptions: function () {
        if (this.popupOptions !== "") {
            return this.popupOptions;
        } else {
            return null;
        }
    },

    getTooltipContent: function () {
        if (this.tooltipContent !== "") {
            return this.tooltipContent;
        } else {
            return "";
        }
    },

    getLocationWrapper: function () {
        if (this.locationWrapper !== "") {
            return this.locationWrapper;
        } else {
            return null;
        }
    },

    getTooltipOptions: function () {
        if (this.tooltipOptions !== "") {
            return this.tooltipOptions;
        } else {
            return null;
        }
    },

    latlngCoords: function (latLng, options) {
        removeExtras = latLng.toString()
        if (options !== null) {
            if (options.start !== undefined && options.end !== undefined) {
                removeExtras = options.start + latLng.toString().replace("LatLng(", "").replace(")", "") + options.end
            }
        }
        return removeExtras;
    },

    move: function (latLng, transitionTime) {
        // Only if CSS3 transitions are supported
        if (L.DomUtil.TRANSITION) {
            if (this._icon) {
                this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
                if (this._popup && this._popup._wrapper)
                    this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
                if (this._tooltip && this._tooltip._wrapper)
                    this._tooltip._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
            }
            if (this._shadow) {
                this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
            }
        }
        this.setLatLng(latLng);
        this._newLatLng = this.latlngCoords(this._latlng, this.locationWrapper)
        if (this._popup) {
            this._popup.setContent(this.getPopupContent() + this._newLatLng);
        }
        if (this._tooltip) {
            this._tooltip.setContent(this.getTooltipContent() + this._newLatLng);
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
