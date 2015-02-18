

module.exports =
  OpenLastProject: null
  Subscriptions: []
  activate:(state)->
    @OpenLastProject = require('./open-last-project')
    state = @OpenLastProject.LoadProject() unless atom.project.getPath()
    @OpenLastProject.LoadFiles(state) if state and state.Status
    @Subscriptions.push atom.project.onDidChangePaths @OpenLastProject.Save
  deactivate:->
    @OpenLastProject.Save()
    @Subscriptions.forEach (sub)-> sub.dispose()
    @Subscriptions = []
  serialize:->
    Files = []
    ActiveEditor = atom.workspace.getActiveEditor()
    atom.workspace.eachEditor (editor)->
      File = editor.getPath()
      return unless File
      Files.push File
    CurrentFile = ActiveEditor && ActiveEditor.getPath() || null;
    Status: true, Files: Files, CurrentFile: CurrentFile
