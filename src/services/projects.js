import axios from 'axios'

const url = `http://localhost:3001/api/projects`

const getProject = () => {
    return axios.get(url)
}

export {getProject}