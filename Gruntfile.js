module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      withDepsJS: {
        src: [
          'lib/jquery1.9.1.js',
          'lib/jquery-ui/jquery-ui.js',
          'lib/bootstrap/js/bootstrap.js',
          'lib/bootstrap-timepicker/bootstrap-timepicker.js',
          'lib/leaflet/leaflet-src.js',
          'lib/awesome-markers/leaflet.awesome-markers.js',
          'src/Util.js', 
          'src/MoveableMarker.js',
          'src/TickPoint.js',
          'src/Tick.js',
          'src/Clock.js',
          'src/TracksLayer.js',
          'src/Control.js',
          'src/Playback.js'
        ],
        dest: 'dist/LeafletPlaybackWithDeps.js',
      },
      noDeps: {
        src: [
          'src/Util.js', 
          'src/MoveableMarker.js',
          'src/TickPoint.js',
          'src/Tick.js',
          'src/Clock.js',
          'src/TracksLayer.js',
          'src/Control.js',
          'src/Playback.js'
        ],
        dest: 'dist/LeafletPlayback.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat']);
};
