module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      dist: {
        src: [
          'src/prologue.js',
          'src/Util.js', 
          'src/MoveableMarker.js',
          'src/Track.js',
          'src/TrackController.js',
          'src/Clock.js',
          'src/TracksLayer.js',
          'src/Control.js',
          'src/Playback.js',
          'src/epilogue.js'
        ],
        dest: 'dist/LeafletPlayback.js'
      }
    },
    
    uglify: {
        dist: {
            options: {
                mangle: true,
                compress: true
            },
            src: 'dist/LeafletPlayback.js',
            dest: 'dist/LeafletPlayback.min.js'
        }
    },
    
    writeBowerJson: {
        options: {
            bowerJsonTemplate: 'config/bower-template.json'
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-write-bower-json');
  
  grunt.registerTask('default', ['concat', 'uglify', 'writeBowerJson']);
};
