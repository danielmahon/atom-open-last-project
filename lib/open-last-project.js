'use strict';

/*
 * This file is the entry point of your package. It will be loaded once as a
 * singleton.
 *
 * For more information: https://atom.io/docs/latest/creating-a-package#source-code
 */

var project = {
  path: '',
  files: []
};

module.exports = {

  /*
   * This required method is called when your package is activated. It is passed
   * the state data from the last time the window was serialized if your module
   * implements the serialize() method. Use this to do initialization work when
   * your package is started (like setting up DOM elements or binding events).
   */
  activate: function() {
    var _this = this;

    if (atom.project.path) {
      // console.log('Loading ' + atom.project.path + '...');
      this.saveProject();
    } else {
      // console.log('Loading last project from memory...');
      this.loadProject();
    }

    atom.project.on('path-changed', function() {
      _this.saveProject();
    });

    atom.workspaceView.on('pane:item-removed', function() {
      _this.saveProject();
    });

    atom.workspaceView.on('pane:item-added', function($, editor) {
      if (editor.buffer && editor.buffer.file && !project.files[editor.buffer.file.path]) _this.saveProject();
    });

    // clean up old config
    if (atom.config.get('open-last-project')) {
      delete atom.config.settings['open-last-project'];
    }

  },

  loadProject: function(path) {
    var lastProject = localStorage.getItem('open-last-project');
    if (lastProject) {
      project = JSON.parse(lastProject);
      atom.project.setPath(project.path);
      project.files.forEach(function(file) {
        atom.workspace.open(file);
      });
    }
  },

  saveProject: function() {
    project.path = atom.project.path;
    project.files = [];
    atom.project.eachBuffer(function(buffer) {
      if (buffer.file) project.files.push(buffer.getPath());
    });
    localStorage.setItem('open-last-project', JSON.stringify(project));
    // console.log('Saved ' + project.path);
  },

  /*
   * This optional method is called when the window is shutting down, allowing
   * you to return JSON to represent the state of your component. When the
   * window is later restored, the data you returned is passed to your module's
   * activate method so you can restore your view to where the user left off.
   */
  serialize: function() {},

  /*
   * This optional method is called when the window is shutting down. If your
   * package is watching any files or holding external resources in any other
   * way, release them here. If you're just subscribing to things on window, you
   * don't need to worry because that's getting torn down anyway.
   */
  deactivate: function() {
    this.saveProject();
  }
};
