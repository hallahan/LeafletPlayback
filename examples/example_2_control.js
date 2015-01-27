L.Playback = L.Playback || {};

L.Playback.Control = L.Control.extend({

  _html: 
'<footer class="lp">' +
'  <div class="transport">' +
'    <div class="navbar">' +
'      <div class="navbar-inner">' +
'        <ul class="nav">' +
'          <li class="ctrl">' +
'            <a id="play-pause" href="#"><i id="play-pause-icon" class="fa fa-play fa-lg"></i></a>' +
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
'                <span class="add-on"><i class="fa fa-clock-o"></i></span>' +
'              </div>' +
'              <div id="calendar"></div>' +
'              <div class="input-append">' +
'                <input id="date-input" type="text" class="input-small">' +
'                <span class="add-on"><i class="fa fa-calendar"></i></span>' +
'              </div>' +
'            </div>' +
'          </li>' +
'        </ul>' +
'        <ul class="nav pull-right">' +
'          <li>' +
'            <div id="time-slider"></div>' +
'          </li>' +
'          <li class="ctrl dropup">' +
'            <a id="speed-btn" data-toggle="dropdown" href="#"><i class="fa fa-dashboard fa-lg"></i> <span id="speed-icon-val" class="speed">1</span>x</a>' +
'            <div class="speed-menu dropdown-menu" role="menu" aria-labelledby="speed-btn">' +
'              <label>Playback<br/>Speed</label>' +
'              <input id="speed-input" class="span1 speed" type="text" value="1" />' +
'              <div id="speed-slider"></div>' +
'            </div>' +
'          </li>' +
'          <li class="ctrl">' +
'            <a id="load-tracks-btn" href="#"><i class="fa fa-map-marker fa-lg"></i> Tracks</a>' +
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
'      Leaflet Playback supports GeoJSON and GPX files. CSV support coming soon!' +
'    </p>' +
'    <label>Upload a File</label>' +
'    <input type="file" id="load-tracks-file" />' +
'  </div>' +
'  <div class="modal-footer">' +
'    <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
'    <button id="load-tracks-save" class="btn btn-primary">Load</button>' +
'  </div>' +
'</div>',

  initialize: function(playback) {
    this.playback = playback;
    playback.addCallback(this._clockCallback);
  },

  onAdd: function(map) {
    var html = this._html;
    $('#map').after(html);
    this._setup();

    // just an empty container
    // TODO: dont do this
    return L.DomUtil.create('div');
  },

  _setup: function() {
    var self = this;
    var playback = this.playback;
    $('#play-pause').click(function() {
      if (playback.isPlaying() === false) {
        playback.start();
        $('#play-pause-icon').removeClass('fa-play');
        $('#play-pause-icon').addClass('fa-pause');
      } else {
        playback.stop();
        $('#play-pause-icon').removeClass('fa-pause');
        $('#play-pause-icon').addClass('fa-play');
      }
    });

    var startTime = playback.getStartTime();
    $('#cursor-date').html(L.Playback.Util.DateStr(startTime));
    $('#cursor-time').html(L.Playback.Util.TimeStr(startTime));

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

    $('#speed-slider').slider({
      min: -9,
      max: 9,
      step: .1,
      value: self._speedToSliderVal(this.playback.getSpeed()),
      orientation: 'vertical',
      slide: function( event, ui ) {
        var speed = self._sliderValToSpeed(parseFloat(ui.value));
        playback.setSpeed(speed);
        $('.speed').html(speed).val(speed);
      }
    });

    $('#speed-input').on('keyup', function(e) {
      var speed = parseFloat($('#speed-input').val());
      if (!speed) return;
      playback.setSpeed(speed);
      $('#speed-slider').slider('value', speedToSliderVal(speed));
      $('#speed-icon-val').html(speed);
      if (e.keyCode === 13) {
        $('.speed-menu').dropdown('toggle');
      }
    });

    $('#calendar').datepicker({
      changeMonth: true,
      changeYear: true,
      altField: '#date-input',
      altFormat: 'mm/dd/yy',
      defaultDate: new Date(playback.getTime()),
      onSelect: function(date) {
        var date = new Date(date);
        var time = $('#timepicker').data('timepicker');
        var ts = self._combineDateAndTime(date, time);
        playback.setCursor(ts);
        $('#time-slider').slider('value', ts);
      }
    }); 

    $('#date-input').on('keyup', function(e) {
      $('#calendar').datepicker('setDate', $('#date-input').val());
    });

    $('.dropdown-menu').on('click', function(e) {
      e.stopPropagation();
    });

    $('#timepicker').timepicker({
      showSeconds: true
    });
    
    $('#timepicker').timepicker('setTime', 
        new Date(playback.getTime()).toTimeString());

    $('#timepicker').timepicker().on('changeTime.timepicker', function(e) {
      var date = $('#calendar').datepicker('getDate');
      var ts = self._combineDateAndTime(date, e.time);
      playback.setCursor(ts);
      $('#time-slider').slider('value', ts);
    });

    $('#load-tracks-btn').on('click', function(e) {
      $('#load-tracks-modal').modal();
    });

    $('#load-tracks-save').on('click', function(e) {
      var file = $('#load-tracks-file').get(0).files[0];
      self._loadTracksFromFile(file);
    });

  },

  _clockCallback: function(ms) {
    $('#cursor-date').html(L.Playback.Util.DateStr(ms));
    $('#cursor-time').html(L.Playback.Util.TimeStr(ms));
    $('#time-slider').slider('value', ms);
  },

  _speedToSliderVal: function(speed) {
    if (speed < 1) return -10+speed*10;
    return speed - 1;    
  },

  _sliderValToSpeed: function(val) {
    if (val < 0) return parseFloat((1+val/10).toFixed(2));
    return val + 1;    
  },

  _combineDateAndTime: function(date, time) {
    var yr = date.getFullYear();
    var mo = date.getMonth();
    var dy = date.getDate();
    // the calendar uses hour and the timepicker uses hours...
    var hr = time.hours || time.hour;
    if (time.meridian === 'PM' && hr !== 12) hr += 12;
    var min = time.minutes || time.minute;
    var sec = time.seconds || time.second;
    return new Date(yr, mo, dy, hr, min, sec).getTime();    
  },

  _loadTracksFromFile: function(file) {
    var self = this;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var fileStr = e.target.result;

      /**
       * See if we can do GeoJSON...
       */
      try {
        var tracks = JSON.parse(fileStr);
      } catch (e) {
        /**
         * See if we can do GPX...
         */
        try {
          var tracks = L.Playback.Util.ParseGPX(fileStr);
        } catch (e) {
          console.error('Unable to load tracks!');
          return;
        }
      }

      self.playback.addData(tracks);
      $('#load-tracks-modal').modal('hide');
    };    
  }

});