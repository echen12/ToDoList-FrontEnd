const ProjectDisplay = ({ getIdAndTitle, deleteProject, project }) => {
    return (
        <div className="project-list-display">

            {project.map(p => {
                return (
                    <div className="individual-project" key={p.projectName}>
                        <label className="project-label" onClick={getIdAndTitle} id={p.id}>
                            {p.projectName}
                        </label>
                        <button className="task-button" onClick={deleteProject} id={p.id}>Delete Project</button>
                    </div>
                )
            })}

        </div>
    )
}

export default ProjectDisplay