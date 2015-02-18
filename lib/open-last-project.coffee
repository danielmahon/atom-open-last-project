

module.exports =
  Save:->
    localStorage.setItem('open-last-project',JSON.stringify({Path: atom.project.getPath()}))
  LoadProject:->
    LastProject = localStorage.getItem('open-last-project')
    return unless LastProject
    LastProject = JSON.parse(LastProject)
    atom.project.setPaths [LastProject.Path]
    # Note: We can't use the default state when loading, 'cause the serialization thing is per-project and the
    # Project dir is different from the null one
    return atom.packages.packageStates['open-last-project']
  LoadFiles:(State)->
    Promises = []
    State.Files.forEach (file)-> Promises.push atom.workspace.open(file)
    Promise.all(Promises).then ->
      # Remove the empty pane
      atom.workspace.eachEditor (editor)->
        editor.destroy() unless editor.getPath()
      # Set the last active file
      return unless State.CurrentFile
      atom.workspace.open(State.CurrentFile)
