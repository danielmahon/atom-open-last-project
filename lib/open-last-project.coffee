

module.exports =
  Save:->
    Files = []
    ActiveEditor = atom.workspace.getActiveEditor()
    atom.workspace.eachEditor (editor)->
      File = editor.getPath()
      return unless File
      Files.push File
    CurrentFile = ActiveEditor && ActiveEditor.getPath() || null;
    localStorage.setItem('open-last-project',JSON.stringify({Path: atom.project.getPath(), Files: Files, CurrentFile: CurrentFile}))
  LoadProject:->
    LastProject = localStorage.getItem('open-last-project')
    return unless LastProject
    LastProject = JSON.parse(LastProject)
    atom.project.setPaths [LastProject.Path]
    Promises = []
    LastProject.Files.forEach (file)-> Promises.push atom.workspace.open(file)
    Promise.all(Promises).then ->
      # Remove the empty pane
      atom.workspace.eachEditor (editor)->
        editor.destroy() unless editor.getPath()
      # Set the last active file
      return unless LastProject.CurrentFile
      atom.workspace.open(LastProject.CurrentFile)
