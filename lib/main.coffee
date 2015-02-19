

module.exports =
  OpenLastProject: null
  Subscriptions: []
  activate:->
    @OpenLastProject = require('./open-last-project')
    @OpenLastProject.LoadProject() unless atom.project.getPath()
    return ;
    @OpenLastProject.LoadFiles()
    @Subscriptions.push atom.project.onDidChangePaths @OpenLastProject.Save
    @Subscriptions.push atom.workspace.onDidAddPaneItem @OpenLastProject.Save
    @Subscriptions.push atom.workspace.onDidDestroyPaneItem @OpenLastProject.Save
    @Subscriptions.push atom.workspace.observeActivePaneItem @OpenLastProject.Save
  deactivate:->
    @OpenLastProject.Save()
    @Subscriptions.forEach (sub)-> sub.dispose()
    @Subscriptions = []
