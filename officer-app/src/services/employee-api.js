import axios from './Auth/axios-with-auth'

const get = async function(){
    const res = await axios.get('/employee')
    return res
}

const create = async function(data){
    // const ActivationCode = uuidv4()
    const res = await axios.post('/employee',{...data})
    console.log(res.data)
}

const remove = async function(data){
    const res = await axios.delete('/employee',{data: {data}})
    console.log(res.data)
}

export default {
    get,
    create,
    remove
}