

module.exports =
  new class OpenLastProject
    Save:->
      Files = []
      atom.workspace.eachEditor (editor)->
        Files.push editor.getPath()
      Data = Path: atom.project.path, Files: Files
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
    Migrate:(LastProject)->
      Path: LastProject.path, Files: LastProject.files