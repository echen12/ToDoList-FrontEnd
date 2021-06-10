const TaskDisplay = ({ deleteTask, filterProject }) => {

    if (filterProject.length !== 0) {
        return (
            <div>
                {filterProject.map(a => {
                    return (
                        <div className="individual-todo" key={a.task}>
                            <label>{a.task}</label>
                            <br></br>
                            <button className="task-button" onClick={deleteTask} id={a.task}>Finished task</button>
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

export default TaskDisplay