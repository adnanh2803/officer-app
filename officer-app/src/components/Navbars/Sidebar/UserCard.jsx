import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import './UserCard.scss'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../hooks/Auth/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import userController from '../../../services/user-api'
function UserCard({ collapseState }) {
    const navigate = useNavigate()
    const { user, logout } = useContext(UserContext);
    const [userObj, setUserObj] = useState()
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(true)
    async function loadImage(){
        const img = await userController.getImage();
        setImage(URL.createObjectURL(img));
        setLoading(false);
    }
    useEffect(() => {
        setUserObj(user);
        loadImage();
    }, [user])
    return (
        <>
            {userObj && (
                <div className={`UserCard ${collapseState ? 'collapsed' : ''}`}>
                    <div className='user-container' onClick={()=>{navigate('/user-settings')}}>
                    <div className="user-icon">
                        {!loading && <img src={image} alt="" /> || 
                        <img src="https://source.unsplash.com/featured/50x50?profile" alt="" />}
                    </div>
                    <div className="user-info">
                        <p className='name'>{userObj.FullName}</p>
                        <p className='role'>{userObj.Position}</p>
                    </div>
                    </div>
                   
                    <div className='user-logout'>
                        <FontAwesomeIcon onClick={()=>{logout()}} icon={faRightFromBracket} />
                    </div>
                </div>
            )}
        </>
    )
}

export default UserCard