import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./CompanyInfo.scss";
import { showToast } from "./ToastUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPen, faPenClip, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import apiService from '../../../services/application-settings-api'
function CompanyInfo() {
    const [info,setInfo] = useState(null);
    const [edit, setEdit] = useState(false);
    const [nameChange,setNameChange] = useState("");
    const [addressChange, setAddressChange] = useState("");
    const [oibChange, setOibChange] = useState("");
    async function loadData(){
        const data = await apiService.get('CompanyInfo');
        const parsedData = JSON.parse(data.Value)
        setInfo({...parsedData,_id: data._id});
        setNameChange(parsedData.Name);
        setAddressChange(parsedData.Address);
        setOibChange(parsedData.OIB);
    }
    useEffect(()=>{
        loadData();
    },[])

    async function submitData(e){
        e.preventDefault();
        if(oibChange.match(/^[0-9]+$/) == null || oibChange.length != 11){return showToast("OIB must contain 11 numbers",{type: "warning"})}
        setEdit(false);
        let value = JSON.stringify({
            Name: nameChange,
            Address: addressChange,
            OIB: oibChange
        })
        let res = null
        if(info.length <= 0){
            res = await apiService.create({Name:'CompanyInfo',Value: value})
        }else{
            res = await apiService.update({_id: info._id,Name:'CompanyInfo',Value: value})
        }
        if(res.status == 200){
            showToast("Successfuly saved",{type: "success"})
        }
    }

    return (
        <div className="CompanyInfo">
            <div className="title-container">
            <h4>Company Info</h4>
            <button onClick={()=> setEdit(!edit)} className="edit-button">
                <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
            </button>
            </div>
            
            {!edit && (
                <div>
                    <p>Name: {info?.Name || ""}</p>
                    <p>Address: {info?.Address || ""}</p>
                    <p>OIB: {info?.OIB || ""}</p>
                </div>
            )}
            {edit && (<Form id="group-form" onSubmit={submitData}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#333", fontWeight: 500 }}>
                        Name
                    </Form.Label>

                    <Form.Control
                        name="CompanyName"
                        type="Text"
                        value={nameChange}
                        placeholder={
                            "Enter Company Name"
                        }
                        required
                        onChange={(e) => setNameChange(e.target.value)}
                    />
                    <Form.Label style={{ color: "#333", fontWeight: 500 }}>
                        Address
                    </Form.Label>

                    <Form.Control
                        name="CompanyAddress"
                        type="Text"
                        value={addressChange}
                        placeholder={
                            "Enter Company Address"
                        }
                        required
                        onChange={(e) => setAddressChange(e.target.value)}
                    />
                    <Form.Label style={{ color: "#333", fontWeight: 500 }}>
                        OIB
                    </Form.Label>

                    <Form.Control
                        name="CompanyOIB"
                        type="Text"
                        value={oibChange}
                        placeholder={
                            "Enter Company OIB"
                        }
                        required
                        onChange={(e) => setOibChange(e.target.value)}
                    />

                </Form.Group>
                <div>
                <Button variant="success" type="submit">Save</Button>
                <Button onClick={()=> setEdit(false)} variant="danger" type="button">Cancel</Button>
                </div>
                
            </Form>)}
        </div>
    );
}

export default CompanyInfo;
