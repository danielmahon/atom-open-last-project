'use strict';

var CompositeDisposable = require('atom').CompositeDisposable;

/**
 * Constructor
 * @param {object} data Serialized data from Atom.io
 */
function OpenLastProject(data) {
	this.data = data || {};

	// Only load previous project when no project is defined
	if (atom.project.path) {
		this.saveProject();
	} else {
		this.loadProject();
	}

	this.registerHandlers();
}

/**
 * Register event handlers
 */
OpenLastProject.prototype.registerHandlers = function() {
	this.disposables = new CompositeDisposable();
	// Save on project path change
	this.disposables.add(atom.project.onDidChangePaths(this.saveProject.bind(this)));
	// Save on new or removed Pane item
	this.disposables.add(atom.workspace.onDidAddPaneItem(this.saveProject.bind(this)));
	this.disposables.add(atom.workspace.onDidDestroyPaneItem(this.saveProject.bind(this)));
};

/**
 * Loads the previous project state from LocalStorage
 */
OpenLastProject.prototype.loadProject = function() {
	var lastProject = localStorage.getItem('open-last-project');
	if (lastProject) {
		this.data = JSON.parse(lastProject);
		// set new project path
		atom.project.setPaths([this.data.path]);
		// open previous files
		this.data.files.forEach(function(file) {
			atom.workspace.open(file);
		});

		// console.log('open-last-project:load ' + this.data.path);

		// Remove blank "untitled" tab
		// TODO: This probably isnt the best way to handle this
		var removeUntitledListener;
		var removeUntitled = function(e) {
			var item = e.item;
			// Find untitled buffer
			if (item.buffer && item.buffer.file === null) {
				e.pane.destroyItem(item);
				removeUntitledListener.dispose();
			}
		};
		if (this.data.files.length) {
			removeUntitledListener = atom.workspace.onDidAddPaneItem(removeUntitled);
		}
	}
};

/**
 * Save data to LocalStorage
 */
OpenLastProject.prototype.saveProject = function() {
	var _this = this;
	// Set project path
	this.data.path = atom.project.path;
	// Reset files
	this.data.files = [];
	// Add each open file path
	atom.workspace.getPaneItems().forEach(function(item) {
		if (item.buffer && item.buffer.file) {
			_this.data.files.push(item.getPath());
			// console.log('open-last-project:add', item.getPath());
		}
	});
	// Store project state
	localStorage.setItem('open-last-project', JSON.stringify(this.data));
	// console.log('open-last-project:save ' + this.data.path);
};

/**
 * Serialize data to store
 * TODO: This doesnt seem to be stored between sessions
 * so we still need to use LocalStorage for the time being
 * @return {object} Object to store
 */
OpenLastProject.prototype.serialize = function() {
	return {
		deserializer: 'MyPackageView',
		data: this.data
	}
};

/**
 * This is supposed to be run by Atom.io on init
 * @param  {object} data Serialized data from Atom.io
 * @return {OpenLastProject} Returns instance of OpenLastProject
 */
OpenLastProject.deserialize = function(data) {
	return new OpenLastProject(data);
};

/**
 * Remove event handlers
 */
OpenLastProject.prototype.destroy = function() {
	// remove listeners
	this.disposables.dispose();
};

module.exports = OpenLastProject;
