import axios from './Auth/axios-with-auth'

const get = async function(){
    const res = await axios.get('/user')
    return res.data
}

const getReviewers = async function(notAssigned = false){
    const res = await axios.get('/user/reviewers',{params: {notAssigned}})
    return res.data
}

const updateReviewers = async function(userIds, isReviewer){
    await axios.put('/user/reviewers', {userIds, isReviewer})
}

const uploadImage = async function (file, fileName) {
    let data = new FormData();
    data.append('fileName', fileName)
    data.append("file", file, file.name);

    const response = await axios.post("/user/image", data, {
        headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
    });
};

const getImage = async function(){
    const res = await axios.get('/user/image',{responseType: 'blob'})
    return res.data
}

export default {
    uploadImage,
    getImage,
    getReviewers,
    updateReviewers,
    get,
};
