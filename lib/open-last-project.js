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
      console.log('Loading ' + atom.project.path + '...');
      project.path = atom.project.path;
      project = this.loadProject(atom.project.path);
      this.openFiles();
    } else {
      var lastProjectPath = atom.config.get('open-last-project.path');
      if (lastProjectPath) {
        project = this.loadProject(lastProjectPath);
        console.log('Loading previous project ' + project.path + '...');
        atom.project.setPath(project.path);
        this.openFiles();
      }
    }

    console.log(atom);
    console.log(project);

    this.saveProject();

    // console.log(atom.workspace);
    // atom.workspace.open('/Users/daniel/Projects/atom-last-project/package.json');

    atom.project.on('path-changed', function() {
      project.path = atom.project.path;
      _this.saveFiles();
      console.log('Project: ' + project);
    });

    atom.workspaceView.on('pane:item-removed', function() {
      _this.saveFiles();
    });

    atom.workspaceView.on('pane:item-added', function() {
      _this.saveFiles();
    });

  },

  saveFiles: function() {
    project.files = [];
    atom.project.eachBuffer(function(buffer) {
      if (buffer) project.files.push(buffer.getPath());
    });
    this.saveProject();
  },

  openFiles: function() {
    project.files.forEach(function(file) {
      atom.workspace.open(file);
    });
  },

  loadProject: function(path) {
    var result = localStorage.getItem('open-last-project');
    if (result) {
      return JSON.parse(result)[path];
    } else {
      return project;
    }
  },

  saveProject: function() {
    var projects = JSON.parse(localStorage.getItem('open-last-project'));
    projects = projects || {};
    projects[project.path] = project;
    localStorage.setItem('open-last-project', JSON.stringify(projects));
    atom.config.set('open-last-project.path', project.path);
    console.log('Saved ' + project.path);
    console.log(projects);
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
    this.saveFiles();
  }
};
