import { useContext, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

function hasRoute(location,routes){
  return routes.some(route=> location.includes(route))
}

function ProtectedRoute(){
  const {user, hasPrivilages} = useContext(UserContext)
  const location = useLocation()
  
  if(user){
    if((hasRoute(location.pathname,['/dashboard','/employees'])) && !hasPrivilages(["ADMIN","MANAGER"])){
      return <Navigate to={'/new-user-agreement'}/>
    }
    if((hasRoute(location.pathname,['/application-settings'])) && !hasPrivilages(["ADMIN"])){
      return <Navigate to={'/new-user-agreement'}/>
    }
    return user == -1? <div></div>: <Outlet/>
  }else{
    return <Navigate to={'/login'}></Navigate>
  }
}

export default ProtectedRoute