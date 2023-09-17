import axios from './Auth/axios-with-auth'
const get = async function(name){
    const res = await axios.get('/application-settings',{ params: { name: name } })
    return res.data
}

const create = async function(data){
    const res = await axios.post('/application-settings',data)
    return res
}
const update = async function(data){
    const res = await axios.put('/application-settings',{data})
    return res
}

export default {
    get,
    create,
    update
}