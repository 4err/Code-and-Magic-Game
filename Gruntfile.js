module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-http-server');

  //grunt.registerTask('browserify123', ['browserify']);
  grunt.registerTask('default', ['http-server:dev', 'watch']);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      main: {
        src: 'js/demo.js',
        dest: 'js/main.js'
      }
    },
    watch: {
      files: ['js/*', '!js/main.js'],
      tasks: ['browserify']
    },
    'http-server': {
      'dev': {
        root: 'E:/HtmlAcademy/Code-and-Magick-Game',
        port: 8282,
        host: '127.0.0.1',
        cache: 10,
        showDir: true,
        autoIndex: true,
        ext: "html",
        runInBackground: true,
        openBrowser: true
      }
    }
  });
}
