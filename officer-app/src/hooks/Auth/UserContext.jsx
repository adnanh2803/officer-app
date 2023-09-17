import { createContext, useEffect, useState } from "react"
import { json, useNavigate } from "react-router-dom";

const UserContext = createContext()

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true
  } catch (err) {
    console.log(err.message);
    return false
  }
}

const UserProvider = ({ children }) => {
  var navigate = useNavigate();
  const [user, setUser] = useState(-1);
  const [token, setToken] = useState(null);
  const rawUser = sessionStorage.getItem('user');
  const rawToken = sessionStorage.getItem('token');
  useEffect(() => {
    if (!isValidJSON(rawUser) || !isValidJSON(rawToken)){
      clearUserAndToken();
      navigate('/login');
    }
    const jsonUser = JSON.parse(rawUser);
    const jsonToken = JSON.parse(rawToken);
    setUser(jsonUser);
    setToken(jsonToken);
  }, [])

  function login(data) {
    sessionStorage.setItem('token', JSON.stringify(data.Token))
    sessionStorage.setItem('user', JSON.stringify(data.User))
    setUser(data.User)
  }

  function logout() {
    clearUserAndToken()
    navigate('/login');
  }

  function hasActionPrivilagesForObject(objectName){
    if(user != null && user != -1){
      const jsonPrivilages = JSON.parse(user.Privilages)
      const privilagesForObject = jsonPrivilages.filter((obj)=>{return obj.Object == objectName})
      const actionPrivilages = privilagesForObject.map((ap)=> ap.Act)
      return actionPrivilages
    }
    return []
  }

  function hasPrivilages(privilages){
    if(user != null && user != -1){
      return privilages.some((p)=>p.toLowerCase() == user.RoleName.toLowerCase())
    }
    return false
  }

  function clearUserAndToken() {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }
  return (
    <UserContext.Provider value={{ user, login, logout, hasPrivilages, hasActionPrivilagesForObject }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider }