

module.exports =
  OpenLastProject: null
  Subscriptions: []
  activate:()->
    @OpenLastProject = require('./open-last-project')
    if atom.project.path
      @OpenLastProject.Save()
    else
      @OpenLastProject.Load()
    @Subscriptions.push atom.project.onDidChangePaths @OpenLastProject.Save.bind(@OpenLastProject)
    @Subscriptions.push atom.workspace.onDidAddPaneItem @OpenLastProject.Save.bind(@OpenLastProject)
    @Subscriptions.push atom.workspace.onDidDestroyPaneItem @OpenLastProject.Save.bind(@OpenLastProject)
  deactivate:->
    @Subscriptions.forEach (sub)-> sub.dispose()
    @Subscriptions = []