L.Playback = L.Playback || {};

L.Playback.Control = L.Control.extend({

  _html: 
'<footer class="lp">' +
'  <div class="transport">' +
'    <div class="navbar">' +
'      <div class="navbar-inner">' +
'        <ul class="nav">' +
'          <li class="ctrl">' +
'            <a id="play-pause" href="#"><i id="play-pause-icon" class="icon-play icon-large"></i></a>' +
'          </li>' +
'          <li class="ctrl dropup">' +
'            <a id="clock-btn" class="clock" data-toggle="dropdown" href="#">' +
'              <span id="cursor-date"></span><br/>' +
'              <span id="cursor-time"></span>' +
'            </a>' +
'            <div class="dropdown-menu" role="menu" aria-labelledby="clock-btn">' +
'              <label>Playback Cursor Time</label>' +
'              <div class="input-append bootstrap-timepicker">' +
'                <input id="timepicker" type="text" class="input-small span2">' +
'                <span class="add-on"><i class="icon-time"></i></span>' +
'              </div>' +
'              <div id="calendar"></div>' +
'              <div class="input-append">' +
'                <input id="date-input" type="text" class="input-small">' +
'                <span class="add-on"><i class="icon-calendar"></i></span>' +
'              </div>' +
'            </div>' +
'          </li>' +
'        </ul>' +
'        <ul class="nav pull-right">' +
'          <li>' +
'            <div id="time-slider"></div>' +
'          </li>' +
'          <li class="ctrl dropup">' +
'            <a id="speed-btn" data-toggle="dropdown" href="#"><i class="icon-dashboard icon-large"></i> <span id="speed-icon-val" class="speed">1</span>x</a>' +
'            <div class="speed-menu dropdown-menu" role="menu" aria-labelledby="speed-btn">' +
'              <label>Playback<br/>Speed</label>' +
'              <input id="speed-input" class="span1 speed" type="text" value="1" />' +
'              <div id="speed-slider"></div>' +
'            </div>' +
'          </li>' +
'          <li class="ctrl">' +
'            <a id="load-tracks-btn" href="#"><i class="icon-map-marker icon-large"></i> Tracks</a>' +
'          </li>' +
'        </ul>' +
'      </div>' +
'    </div>' +
'  </div>' +
'</footer>' +
'<div id="load-tracks-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="load-tracks-label" aria-hidden="true">' +
'  <div class="modal-header">' +
'    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
'    <h3 id="load-tracks-label">Load GPS Tracks</h3>' +
'  </div>' +
'  <div class="modal-body">' +
'    <p>' +
'      At the current moment, LeafletPlayback only supports GeoJSON files.' +
'    </p>' +
'    <label>Upload a File</label>' +
'    <input type="file" id="load-tracks-file" />' +
'  </div>' +
'  <div class="modal-footer">' +
'    <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
'    <button id="load-tracks-save" class="btn btn-primary">Load</button>' +
'  </div>' +
'</div>',


  onAdd: function(map) {
    var html = this._html;
    $('#map').after(html);
    this._setup();

    // just an empty container
    // TODO: dont do this
    return L.DomUtil.create('div');
  },

  _setup: function() {
    
  }

});