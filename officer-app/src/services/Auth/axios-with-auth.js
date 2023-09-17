import axios, { AxiosError } from 'axios'
import { showToast } from '../../views/ApplicationSettings/Components/ToastUtils';
function getToken(){
    return JSON.parse(sessionStorage.getItem('token'))
}
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + '/api',
})

instance.interceptors.request.use(function (config) {
    let token = getToken()
    if(!token){
      console.log("Token is unavaliable or invalid");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = window.location.origin + '/login'
    }
    config.headers.Authorization = `Bearer ${token}`
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error.response?.status == 401){
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = window.location.origin + '/login'
    }else if(error.response?.status == 400){
      showToast(error.response.data,{type: "error"})
    }
    return Promise.reject(error);
  });
export default  instance