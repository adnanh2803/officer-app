import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "./components/Navbars/Sidebar/Sidebar";

function AppLayout() {
    const [collapseState, setCollapseState] = useState(false);
    const location = useLocation()
    const excludeSidebar = ['/login', '/register']
    return (
        <>
            {!excludeSidebar.includes(location.pathname) && (
                <Sidebar
                    collapseState={collapseState}
                    setCollapseState={setCollapseState}
                ></Sidebar>
            )}
            <div className={`container ${collapseState ? "collapsed" : ""}`}>
                <Outlet></Outlet>
            </div>
        </>
    )
}

export default AppLayout