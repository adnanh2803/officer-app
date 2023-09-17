import axios from './Auth/axios-with-auth'

const get = async function(){
    const res = await axios.get('/asset/group')
    return res.data
}

const create = async function(data){
    const res = await axios.post('/asset/group',data)
    console.log(res.data)
}

const remove = async function(data){
    const res = await axios.delete('/asset/group',{data: {data}})
    console.log(res.data)
}

export default {
    get,
    create,
    remove
}