const AddProject = ({ addProjectName, handleProjectName, projectName }) => {

    return (
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
    )
}

export default AddProject