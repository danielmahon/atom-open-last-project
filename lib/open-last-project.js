'use strict';

/*
 * This file is the entry point of your package. It will be loaded once as a
 * singleton.
 *
 * For more information: https://atom.io/docs/latest/creating-a-package#source-code
 */

var $ = require('atom').$;

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

    // Only load previous project when no project is defined
    if (atom.project.path) {
      this.saveProject();
    } else {
      this.loadProject();
    }

    atom.project.on('path-changed', this.saveProject);
    atom.workspaceView.on('pane:item-removed', this.saveProject);
    atom.workspaceView.on('pane:item-added', this.saveProject);

    // Update project when window changes focus
    $(window).on('focus', this.saveProject);

    // clean up old config
    if (atom.config.get('open-last-project')) {
      delete atom.config.settings['open-last-project'];
    }

  },

  /**
   * Loads the previous project state from LocalStorage
   */
  loadProject: function() {
    var lastProject = localStorage.getItem('open-last-project');
    if (lastProject) {
      project = JSON.parse(lastProject);
      // set new project path
      atom.project.setPath(project.path);
      // open previous files
      project.files.forEach(function(file) {
        atom.workspace.open(file);
      });
      // Remove blank "untitled" tab
      // TODO: This probably isnt the best way to handle this
      var removeUntitled = function($, editor) {
        if (editor.buffer && editor.buffer.file) {
          var items = atom.workspace.activePane.getItems();
          atom.workspace.activePane.destroyItem(items[0]);
          atom.workspaceView.off('pane:item-added', removeUntitled);
        }
      };
      if (project.files.length) {
        atom.workspaceView.on('pane:item-added', removeUntitled);
      }
      // console.log('open-last-project: Loaded ' + project.path + ' from memory');
    }
  },

  /**
   * Saves the current project state to LocalStorage
   */
  saveProject: function(e, editor) {
    // No need to add files that already exist
    if (editor && editor.buffer && editor.buffer.file && project.files[editor.buffer.file.path]) {
      return;
    }
    // Don't save on blank files
    if (editor && editor.buffer && !editor.buffer.file) {
      return;
    }
    project.path = atom.project.path;
    project.files = [];
    atom.project.eachBuffer(function(buffer) {
      if (buffer.file) project.files.push(buffer.getPath());
    });
    localStorage.setItem('open-last-project', JSON.stringify(project));
    // console.log('open-last-project: Saved ' + project.path);
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
    // remove listeners
    atom.project.off('path-changed', this.saveProject);
    atom.workspaceView.off('pane:item-removed', this.saveProject);
    atom.workspaceView.off('pane:item-added', this.saveProject);
    $(window).off('focus', this.saveProject);
  }
};
