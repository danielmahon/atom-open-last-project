
module.exports =
  OpenLastProject: null
  Subscriptions: []
  activate:->
    @OpenLastProject = require('./open-last-project')
    setTimeout =>
      @OpenLastProject.LoadProject() unless atom.project.getPaths().length
      @Subscriptions.push atom.workspace.onDidChangeActivePane @OpenLastProject.Save
    ,500
  deactivate:->
    @OpenLastProject.Save()
    @Subscriptions.forEach (sub)-> sub.dispose()
    @Subscriptions = []
