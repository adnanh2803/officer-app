import axios from './Auth/axios-with-auth'

const get = async function(){
    const res = await axios.get('/asset')
    return res.data
}

const create = async function(data){
    const res = await axios.post('/asset',data)
    console.log(res.data)
}

const remove = async function(data){
    const res = await axios.delete('/asset',{data: {data}})
    console.log(res.data)
}

const getUnassigned = async function(){
    const res = await axios.get('/asset?unassigned=true');
    return res.data;
}
export default {
    get,
    getUnassigned,
    create,
    remove
}