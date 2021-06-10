import axios from 'axios'

const url = `http://localhost:3001/api/projects`

const getProject = () => {
    return axios.get(url)
}

const postProject = (project) => {
    return axios.post(url, project)
}

const deleteProject = (number) => {
    return axios.delete(`${url}/${number}`)
}

const modify = (number, object) => {
    return axios.put(`${url}/${number}`, object)
}

export default { getProject, postProject, deleteProject, modify }