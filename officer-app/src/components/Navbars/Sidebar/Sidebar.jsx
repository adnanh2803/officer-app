import "./Sidebar.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faBoxesStacked, faListCheck, faPeopleGroup, faChevronCircleLeft, faGear, faFileCirclePlus, faTableColumns } from '@fortawesome/free-solid-svg-icons'
import UserCard from "./UserCard";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../hooks/Auth/UserContext";
function Sidebar({ collapseState, setCollapseState }) {
    const { logout, hasPrivilages } = useContext(UserContext)
    const navigate = useNavigate()
    return (
        <div className={`Sidebar ${collapseState ? 'collapsed' : ''}`}>
            <div className="Sidebar-collapse-button" onClick={(e) => { setCollapseState(!collapseState) }}>
                <FontAwesomeIcon className="collapse-icon" icon={collapseState ? faBuilding : faChevronCircleLeft} />
            </div>
            <div className="Sidebar-header">
                <div className="Sidebar-title">
                    <h1>Officer</h1>
                    {/* <FontAwesomeIcon className="title-icon" icon={faBuilding} /> */}
                </div>
                <div className="Sidebar-body">
                    <UserCard collapseState={collapseState}></UserCard>
                    <div className="Sidebar-list">
                        {hasPrivilages(["MANAGER","ADMIN"]) && <NavLink to={'/dashboard'} className="list-item">
                            <FontAwesomeIcon className="list-icon" icon={faTableColumns} />
                            <div className="list-name">Dashboard</div>
                        </NavLink>}
                        <NavLink to={'/new-user-agreement'} className="list-item">
                            <FontAwesomeIcon className="list-icon" icon={faFileCirclePlus} />
                            <div className="list-name">New request</div>
                        </NavLink>
                        <NavLink to={'/assets'} className="list-item">
                            <FontAwesomeIcon className="list-icon" icon={faBoxesStacked} />
                            <div className="list-name">Assets</div>
                        </NavLink>
                        <NavLink to={'/asset-agreements'} className="list-item">
                            <FontAwesomeIcon className="list-icon" icon={faListCheck} />
                            <div className="list-name">Requests</div>
                        </NavLink>
                        {hasPrivilages(["MANAGER","ADMIN"]) && <NavLink to={'/employees'} className="list-item">
                            <FontAwesomeIcon className="list-icon" icon={faPeopleGroup} />
                            <div className="list-name">Employees</div>
                        </NavLink>}
                    </div>
                </div>
            </div>
            <div className="Sidebar-footer">
                {hasPrivilages(["ADMIN"]) && <FontAwesomeIcon onClick={()=> navigate('/application-settings')} icon={faGear} />}
            </div>
        </div>
    );
}

export default Sidebar;
