'use strict';

var OpenLastProject = require('./open-last-project');
  
module.exports = {

  openLastProject: null,

  activate: function(state) {
    
    console.log('open-last-project:activate');
    
    // clean up old config
    if (atom.config.get('open-last-project')) {
      delete atom.config.settings['open-last-project'];
    }
    
    if (state && state.data) {
      this.openLastProject = OpenLastProject.deserialize(state.data);
    } else {
      this.openLastProject = new OpenLastProject();
    }
    
    return this.openLastProject;
  },

  deactivate: function() {
    return this.openLastProject.destroy();
  },

  serialize: function() {
    return this.openLastProject.serialize();
  }
};
