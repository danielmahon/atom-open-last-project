'use strict';
module.exports = function() {
  this.initConfig({
    jshint: {
      options: {
        node: true
      },
      grunt: {
        src: ['Gruntfile.js']
      },
      lib: {
        src: ['lib/**/*.js']
      },
      spec: {
        options: {
          globals: {
            describe: true,
            it: true,
            expect: true
          }
        },
        src: ['spec/**/*.js']
      }
    },
    lesslint: {
      src: ['stylesheets/**/*.less']
    },
    watch: {
      options: {
        interrupt: true
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:grunt']
      },
      lib: {
        files: ['lib/**/*.js'],
        tasks: ['jshint:lib']
      },
      spec: {
        files: ['spec/**/*.js'],
        tasks: ['jshint:spec']
      },
      stylesheets: {
        files: ['stylesheets/**/*.less'],
        tasks: ['lesslint']
      }
    }
  });
  this.loadNpmTasks('grunt-contrib-jshint');
  this.loadNpmTasks('grunt-lesslint');
  this.loadNpmTasks('grunt-apm');
  this.loadNpmTasks('grunt-contrib-watch');
  this.registerTask('lint', ['lesslint', 'jshint']);
  this.registerTask('link', ['apm-link']);
  this.registerTask('unlink', ['apm-unlink']);
  this.registerTask('test', ['apm-test']);
  this.registerTask('dev', ['apm-link', 'watch']);
  return this.registerTask('default', ['lint', 'test']);
};
