

module.exports =
  OpenLastProject: null
  Subscriptions: []
  activate:->
    @OpenLastProject = require('./open-last-project')
    setTimeout =>
      @OpenLastProject.LoadProject() unless atom.project.getPaths().length
      @Subscriptions.push atom.project.onDidChangePaths @OpenLastProject.Save
      @Subscriptions.push atom.workspace.onDidAddPaneItem @OpenLastProject.Save
      @Subscriptions.push atom.workspace.onDidDestroyPaneItem @OpenLastProject.Save
      @Subscriptions.push atom.workspace.observeActivePaneItem @OpenLastProject.Save
    ,500
  deactivate:->
    @OpenLastProject.Save()
    @Subscriptions.forEach (sub)-> sub.dispose()
    @Subscriptions = []
