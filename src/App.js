import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AddProject from "./components/AddProject"
import ProjectDisplay from "./components/ProjectDisplay"
import TaskLengthTitle from "./components/TaskLengthTitle"
import AddTask from "./components/AddTask"
import TaskDisplay from "./components/TaskDisplay"
import projectService from "./services/projects"


const App = () => {
  const [projectName, setProjectName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [projectId, setProjectId] = useState(0)
  const [taskLength, setTaskLength] = useState(0)
  const [taskName, setTaskName] = useState("")
  const [filterProject, setFilterProject] = useState([])
  const [project, setProject] = useState([])

  const hook = () => {
    projectService
      .getProject()
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
    //console.log(tempProject[0].projects)
    setTaskLength(tempProject[0].projects.length)
    setProjectTitle(tempProject[0].projectName)
    setFilterProject(tempProject[0].projects)
    setProjectId(e.target.id)
  }

  const handleTaskName = (e) => {
    //console.log(e.target.value)
    setTaskName(e.target.value)
  }

  const addTaskName = (e) => {
    //console.log(e.target.value)
    e.preventDefault()
    const projectIdentify = project.filter(p => p.id === Number(projectId))
    //console.log(projectIdentify)
    const asArray = Object.entries(projectIdentify[0])
    const withoutProjects = asArray.filter(([key, value]) => key !== "projects")
    //console.log(withoutProjects)
    const backToObject = Object.fromEntries(withoutProjects)

    let empty = false
    let contains = false

    for (let i = 0; i < projectIdentify[0].projects.length; i++) {
      if (projectIdentify[0].projects[i].task === taskName) {
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
      backToObject["task"] = taskName
      projectIdentify[0].projects.push({ task: taskName })
      //console.log(backToObject)

      projectService
        .modify(projectId, backToObject)
        .then(response => {
          //console.log(response)
          setTaskLength(projectIdentify[0].projects.length)
          setFilterProject(projectIdentify[0].projects)
        })
    }

    setTaskName("")

  }

  const deleteTask = (e) => {
    const deleteObj = { task: e.target.id }
    const currentProject = project.filter(p => p.id === Number(projectId))
    const remainingTasks = currentProject[0].projects.filter(p => p.task !== e.target.id)
    const currentIndex = project.findIndex(p => p.id === Number(projectId))

    projectService
      .modify(projectId, deleteObj)
      .then(response => {
        //console.log(response)
        const tempArr = [...project]
        tempArr[currentIndex].projects = remainingTasks
        setProject(tempArr)
        setFilterProject(remainingTasks)
        setTaskLength(remainingTasks.length)
      })
  }

  const deleteProject = (e) => {
    //console.log(e.target.id)
    const filterProjectList = project.filter(p => p.id !== Number(e.target.id))
    //console.log(filterProjectList)

    projectService
      .deleteProject(e.target.id)
      .then(response => {
        console.log(response)
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
      projectService
        .postProject(newProject)
        .then(response => {
          console.log(response)
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
        <AddProject addProjectName={addProjectName} handleProjectName={handleProjectName} projectName={projectName} />
        <ProjectDisplay getIdAndTitle={getIdAndTitle} deleteProject={deleteProject} project={project} />
      </div>

      <div className="todo-list">
        <h1>{projectTitle}</h1>

        <div className="add-elements">
          <AddTask addTaskName={addTaskName} handleTaskName={handleTaskName} taskName={taskName} />
          <TaskLengthTitle taskLength={taskLength} />
        </div>

        <div className="todo-list-display">
          <TaskDisplay deleteTask={deleteTask} filterProject={filterProject} />
        </div>
      </div>
    </div>
  )
}

export default App;
