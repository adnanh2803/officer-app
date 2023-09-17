import ImageUploading from 'react-images-uploading';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useState, useRef, useEffect } from 'react'
import './ImageUploader.scss'
import { imgPreview } from './croppedImage'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faPlus, faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons'

function ImageUploader({ currentImage, uploadImage, fileName }) {
    const initCrop = {
        unit: 'px',
        width: 100,
        height: 100,
        x: 50,
        y: 50
    }
    const [images, setImages] = useState([]);
    const [croppedImage, setCroppedImage] = useState();
    const [crop, setCrop] = useState(initCrop);
    const [cropDone, setCropDone] = useState(false)

    useEffect(()=>{
        if(currentImage){
            setCroppedImage(currentImage);
            setCropDone(true)
        }
    },[])

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
    };

    const getCroppedImage = async () => {
        let image = new Image();
        let croppedObj = document.getElementById("cropped");
        image.width = croppedObj.width
        image.height = croppedObj.height
        image.src = images[0].data_url
        let data = await imgPreview(image, crop);
        setCropDone(true);
        setCroppedImage(data.previewUrl);
        console.log(data.blob)
        uploadImage(data.blob, fileName);
    }

    return (
        <>
            <ImageUploading
                multiple="false"
                value={images}
                onChange={onChange}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                        {(!cropDone && imageList.length <= 0) && (
                            <div
                                className={'dropable-zone cropped' + (isDragging ? ' draging' : '')}

                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        )}
                        {images.length > 0 && !cropDone && (
                            <>
                                <div className="dropable-zone">
                                    <ReactCrop
                                        keepSelection={true}
                                        aspect={1}
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        circularCrop={true}
                                    >
                                        <img
                                            style={{
                                                maxWidth: "200px",
                                                maxHeight: "200px",
                                                width: "auto",
                                                height: "auto",
                                            }}
                                            id="cropped"
                                            width={200}
                                            height={200}
                                            src={images[0].data_url}
                                        />
                                        {console.log(
                                            document.getElementById("cropped")
                                        )}
                                    </ReactCrop>
                                </div>
                                <div className="upload-toolbar">
                                    <div onClick={() => onImageRemove(0)}>
                                        <FontAwesomeIcon className='discard-btn' icon={faTrash} />
                                    </div>

                                    <div onClick={(e) => { e.preventDefault(); getCroppedImage() }}>
                                        <FontAwesomeIcon className='save-btn' icon={faFloppyDisk} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </ImageUploading>
            {(cropDone && croppedImage) && (
                <div className="cropped-done-wrapper">
                    <img onClick={()=>{setCropDone(false); setImages([]);}} className="cropped-preview" src={croppedImage}></img>
                    <FontAwesomeIcon className='overlay' icon={faUserPen}></FontAwesomeIcon>   
                </div>
            )}
        </>
    );
}

export default ImageUploader;
