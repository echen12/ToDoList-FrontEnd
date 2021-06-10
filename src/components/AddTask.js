const AddTask = ({ addTaskName, handleTaskName, taskName }) => {

    return (
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
    )
}


export default AddTask