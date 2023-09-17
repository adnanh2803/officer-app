import axios from "axios"
import { showToast } from "../../views/ApplicationSettings/Components/ToastUtils";
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + '/api'
})

instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error.response?.status == 401){
      showToast(error.response.data,{type: "warning"})
    }
    return Promise.reject(error);
  });

const login = async function(email, password){
    try{
        const res = await instance.get('/login',{
            params: {
                email,
                password
            }
        })
        return res
    }catch(err){
        return err
    }
}

const register = async function(activationCode, password, email){
    return await instance.post('/register',{
        activationCode,
        password,
        email
    })
}

export default {
    login,
    register
}