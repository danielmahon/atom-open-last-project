

module.exports =
  Save:->
    ProjectPaths = atom.project.getPaths()
    if ProjectPaths.length
      localStorage.setItem('open-last-project',JSON.stringify({Path: ProjectPaths[0]}))
  LoadProject:->
    LastProject = localStorage.getItem('open-last-project')
    return unless LastProject
    LastProject = JSON.parse(LastProject)
    atom.project.setPaths [LastProject.Path]
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
