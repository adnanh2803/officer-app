import ImageUploader from '../../components/Core/ImageUploader/ImageUploader'
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../hooks/Auth/UserContext';
import './UserSettingsView.scss'
import userController from '../../services/user-api.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
function UserSettingsView() {
    const { user } = useContext(UserContext);
    const [userObj, setUserObj] = useState()
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(true)
    async function loadImage(){
        const img = await userController.getImage();
        setImage(URL.createObjectURL(img));
        setLoading(false);
    }
    useEffect(() => {
        setLoading(true)
        setUserObj(user);
        loadImage();
    }, [user])
    return (
        <div className="UserSettingsView">
            <div className='image-uploader'>
                {!loading && 
                <>
                    <ImageUploader currentImage={image} uploadImage={userController.uploadImage} fileName={user._id}></ImageUploader>
                </>
                }
            </div>
            {userObj && <div className='user-info'>
                <p className='name'>{userObj.FullName}</p>
                <p className='role'>{userObj.Position}</p>
            </div>}
        </div>
    )
}

export default UserSettingsView