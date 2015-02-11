

module.exports =
  new class OpenLastProject
    Save:->
      Files = []
      ActiveEditor = atom.workspace.getActiveEditor()
      atom.workspace.eachEditor (editor)->
        File = editor.getPath()
        return unless File
        Files.push File
      CurrentFile = ActiveEditor && ActiveEditor.getPath() || null;
      Data = Path: atom.project.path, Files: Files, CurrentFile: CurrentFile
      localStorage.setItem('open-last-project', JSON.stringify(Data));
    Load:->
      LastProject = localStorage.getItem('open-last-project')
      return unless LastProject
      LastProject = JSON.parse(LastProject)
      LastProject = @Migrate(LastProject) unless LastProject.Path
      atom.project.setPaths([LastProject.Path])
      Promises = []
      LastProject.Files.forEach (file)-> Promises.push atom.workspace.open(file)
      Promise.all(Promises).then ->
        # Remove the empty pane
        atom.workspace.eachEditor (editor)->
          editor.destroy() unless editor.getPath()
        return unless LastProject.CurrentFile
        atom.workspace.open(LastProject.CurrentFile)
    Migrate:(LastProject)->
      Path: LastProject.path, Files: LastProject.files, CurrentFile: LastProject.files[0]