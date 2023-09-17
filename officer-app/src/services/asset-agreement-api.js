import axios from './Auth/axios-with-auth'

const get = async function(){
    const url = '/asset-agreement'
    const res = await axios.get(url)
    return res.data
}

const getDetails = async function(id){
    const url = `/asset-agreement/details/${id}`
    const res = await axios.get(url)
    return res.data
}

const create = async function(data){
    const res = await axios.post('/asset-agreement',data)
    return res.data
}

const remove = async function(data){
    const res = await axios.delete('/asset-agreement',{data: {data}})
    console.log(res.data)
}

const pdf = async function(id){
    const res = await axios.get('/asset-agreement/pdf',{params: {_id: id},responseType: 'blob'})
    const fileName = res.headers['content-disposition'].split('filename=')[1].split(';')[0].replace(/['"]+/g,'');
    const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement('a');

    link.href = downloadUrl;

    link.setAttribute('download', fileName);

    document.body.appendChild(link);

    link.click();

    link.remove();
}

const signPdf = async function(id){
    const data = await axios.post('/asset-agreement/sign',{id});
    return data.data
}


export default {
    get,
    getDetails,
    create,
    remove,
    pdf,
    signPdf
}