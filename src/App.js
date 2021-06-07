import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [projectName, setProjectName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [projectId, setProjectId] = useState(0)
  const [taskLength, setTaskLength] = useState(0)
  const [taskName, setTaskName] = useState("")
  const [filterProject, setFilterProject] = useState([])
  const [project, setProject] = useState([])

  const hook = () => {
    //console.log('effect')
    axios
      .get('http://localhost:3001/project')
      .then(response => {
        //console.log('promise fulfilled')
        setProject(response.data)
      })
  }

  useEffect(hook, [])


  const handleProjectName = (e) => {
    //console.log(e.target.value)
    setProjectName(e.target.value)
  }

  const getIdAndTitle = (e) => {
    const tempProject = project.filter(p => p.id === Number(e.target.id))
    const keyLength = Object.keys(tempProject[0]).filter(p => p !== "id" && p !== "projectName").length
    setTaskLength(keyLength)
    setProjectTitle(tempProject[0].projectName)
    setFilterProject(tempProject)
    setProjectId(e.target.id)
  }

  const handleTaskName = (e) => {
    //console.log(e.target.value)
    setTaskName(e.target.value)
  }

  const addTaskName = (e) => {
    //console.log(e.target.value)
    e.preventDefault()
    const filterArr = project.filter(p => p.id === Number(projectId))
    const tempObject = filterArr[0]
    const keys = Object.keys(tempObject)
    const keyLength = keys.filter(p => p !== "id" && p !== "projectName").length
    //console.log(keyLength)
    //console.log(keys)
    let empty = false
    let contains = false

    for (let i = 0; i < keys.length; i++) {
      if (filterArr[0][keys[i]] === taskName) {
        alert("This task has already been entered!")
        contains = true;
        break;
      }
    }

    if (taskName === "") {
      alert("Please enter a task!")
      empty = true;
    }

    if (!empty && !contains) {
      filterArr[0][taskName.split(" ").join("")] = taskName
      axios
        .put(`http://localhost:3001/project/${projectId}`, filterArr[0])
        .then(response => {
          //console.log(response)
          const keys = Object.keys(tempObject)
          const keyLength = keys.filter(p => p !== "id" && p !== "projectName").length
          setTaskLength(keyLength)
          setFilterProject(filterArr)
        })
    }

    setTaskName("")

  }

  const deleteTask = (e) => {
    //console.log(e.target.id)
    const keys = Object.keys(filterProject[0]).filter(p => p !== e.target.id)
    const findIndex = project.findIndex(p => p.id === Number(projectId))
    const keyLength = keys.filter(p => p !== "id" && p !== "projectName").length
    setTaskLength(keyLength)
    //console.log(findIndex)

    const tempObject = {}
    for (let i = 0; i < keys.length; i++) {
      tempObject[keys[i]] = filterProject[0][keys[i]]
    }

    axios
      .put(`http://localhost:3001/project/${projectId}`, tempObject)
      .then(response => {
        //console.log(response)
        project[findIndex] = tempObject
        setFilterProject([tempObject])
      })

  }

  const deleteProject = (e) => {
    //console.log(e.target.id)
    const filterProjectList = project.filter(p => p.id !== Number(e.target.id))
    axios
      .delete(`http://localhost:3001/project/${e.target.id}`)
      .then(response => {
        //console.log(response)
        setProject(filterProjectList)
        setProjectTitle("")
        setFilterProject([])
      })
    //console.log(filterProjectList)
    setTaskLength(0)
  }

  const addProjectName = (e) => {
    e.preventDefault()
    let containsProject = false;
    let emptyField = false;

    const generateId = () => {
      if (project.length === 0) {
        return 1;
      } else {
        return project[project.length - 1].id + 1
      }
    }

    const newProject = {
      projectName: projectName,
      id: generateId()
    }

    for (let i = 0; i < project.length; i++) {
      if (project[i].projectName === projectName) {
        alert("Please enter a different project!")
        containsProject = true;
        break;
      }
    }

    if (projectName === "") {
      alert("Please add a project!")
      emptyField = true;
    }

    if (!emptyField && !containsProject) {
      axios
        .post("http://localhost:3001/project", newProject)
        .then(response => {
          //console.log(response)
          setProject(project.concat(response.data))
        })
    }

    setProjectName("")

    //console.log(project)
  }





  return (
    <div className="whole-project">

      <div className="add-projects-container">
        <h1>Add Project</h1>
        
        <div className="add-elements">
          <form onSubmit={addProjectName}>
            <input
              type="text"
              placeholder="add a project"
              className="task-adder"
              onChange={handleProjectName}
              value={projectName}

            >
            </input>
            <button>Add</button>
          </form>
        </div>

        <div className="project-list-display">

          {project.map(p => {
            return (
              <div className="individual-project">
                <label className="project-label" onClick={getIdAndTitle} id={p.id} key={p.id}>
                  {p.projectName}
                </label>
                <button className="task-button" onClick={deleteProject} id={p.id}>Delete Project</button>
              </div>
            )
          })}

        </div>

      </div>

      <div className="todo-list">
        <h1>{projectTitle}</h1>
        <div className="add-elements">
          <form onSubmit={addTaskName}>
            <input
              id="add"
              type="text"
              placeholder="add a task to this project"
              className="task-adder"
              onChange={handleTaskName}
              value={taskName}
            >

            </input>
            <button>Add</button>
          </form>
          <p>You have {taskLength} things left to do!</p>
        </div>

        <div className="todo-list-display">
          <TaskDisplay deleteTask={deleteTask} filterProject={filterProject} />
        </div>
      </div>
    </div>
  )
}

const TaskDisplay = ({ deleteTask, filterProject }) => {

  let filteredKeys = []

  if (filterProject.length !== 0) {
    filteredKeys = Object.keys(filterProject[0]).filter(p => p !== "id" && p !== "projectName")
    //console.log(filteredKeys)
  }

  if (filterProject.length !== 0) {
    return (
      <div>
        {filteredKeys.map(a => {
          return (
            <div className="individual-todo" key={a}>
              <label>{filterProject[0][a]}</label>
              <br></br>
              <button className="task-button" onClick={deleteTask} id={a}>Finished task</button>
            </div>
          )
        })
        }
      </div>
    )
  }

  return (
    <div>

    </div>
  )
}

export default App;
