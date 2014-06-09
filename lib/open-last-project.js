'use strict';

/*
 * This file is the entry point of your package. It will be loaded once as a
 * singleton.
 *
 * For more information: https://atom.io/docs/latest/creating-a-package#source-code
 */

var _this = {
  lastProjectPath: null,
  projects: {}
};

module.exports = {

  /*
   * This required method is called when your package is activated. It is passed
   * the state data from the last time the window was serialized if your module
   * implements the serialize() method. Use this to do initialization work when
   * your package is started (like setting up DOM elements or binding events).
   */
  activate: function(state) {
    _this = state;
    console.log(atom);
    console.log(atom.config.get('open-last-project.path'));
    console.log(state);

    _this.lastProjectPath = atom.config.get('open-last-project.path') || atom.config.get('core.projectHome');

    if (atom.project.path) {
      // atom.config.set('open-last-project.path', atom.project.path);
      this.save();
    } else {
      atom.project.setPath(this.lastProjectPath);
    }

    atom.project.on('path-changed', function() {
      _this.lastProjectPath = atom.project.path;
      this.save();
    });

  },

  save: function() {
    localStorage.setItem('open-last-project', JSON.stringify(_this));
  },

  /*
   * This optional method is called when the window is shutting down, allowing
   * you to return JSON to represent the state of your component. When the
   * window is later restored, the data you returned is passed to your module's
   * activate method so you can restore your view to where the user left off.
   */
  serialize: function() {
    return _this;
  },

  /*
   * This optional method is called when the window is shutting down. If your
   * package is watching any files or holding external resources in any other
   * way, release them here. If you're just subscribing to things on window, you
   * don't need to worry because that's getting torn down anyway.
   */
  deactivate: function() {}
};
