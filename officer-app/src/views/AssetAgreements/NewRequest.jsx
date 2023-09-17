import { useEffect, useState } from "react"
import { Form, Modal, Button, Alert, Toast, ToastContainer } from "react-bootstrap"
import assetAgreementApi from '../../services/asset-agreement-api'
import AssetTable from "../Assets/components/AssetTable"
import EmployeeTable from "../Employees/components/EmployeeTable"
import { useContext } from "react";
import { UserContext } from "../../hooks/Auth/UserContext";
import './AssetAgreementView.scss'
import { useNavigate } from 'react-router-dom'
import loader from '../../assets/loader.svg'
import { showToast } from "../ApplicationSettings/Components/ToastUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlusCircle, faRemove } from "@fortawesome/free-solid-svg-icons";
function NewRequest() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext);
    const [selectedAssets, setSelectedAssets] = useState([])
    const [show, setShow] = useState(false)
    const [showEmployee, setShowEmployee] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState([])
    const [reason, setReason] = useState()
    const [loading, setLoading] = useState(false)

    function handleClose() {
        setShow(false)
    }
    function handleCloseEmployee() {
        setShowEmployee(false)
    }
    function removeAssetFromList(id) {
        const newSelectedAssets = selectedAssets.filter((a) => { return a.original._id != id })
        setSelectedAssets(newSelectedAssets);
    }
    async function createRequest(e) {
        e.preventDefault()
        if (selectedAssets.length <= 0) {
            showToast("Please select at least one asset !", { type: "warning" })
            return
        }
        setLoading(true)
        const assets = selectedAssets.map(a => {
            return { _id: a.original._id, Name: a.original.Name }
        })
        let newAgrement = {
            Reason: reason,
            Assets: assets
        }
        if(selectedEmployee) newAgrement.Employee = selectedEmployee.original;
        const data = await assetAgreementApi.create(newAgrement)

        console.log(data.scope, data.scope?.["lastID"])
        if (data?.scope?.lastID <= 0) return
        // window.open(data.envelopeUrl, '_blank').focus();
        navigate(`/asset-agreements/details/${data.scope.lastID}`)
    }
    return (
        <div className='NewRequest'>
            {loading && <div className="loader">
                <img src={loader} alt="loading..."></img>
            </div>}
            <h1>New asset request</h1>
            <Form onSubmit={createRequest}>
                <div className="row">
                    <div className="col">
                        <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control value={selectedEmployee?.original?.FullName || user?.FullName} type="text" disabled></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col">
                        <Form.Group>
                            <Form.Label>OIB</Form.Label>
                            <Form.Control value={selectedEmployee?.original?.OIB || user?.OIB} type="text" disabled></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control value={selectedEmployee?.original?.Email || user?.Email} type="text" disabled></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col">
                        <Form.Group>
                            <Form.Label>Position</Form.Label>
                            <Form.Control value={selectedEmployee?.original?.Position || user?.Position} type="text" disabled></Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <Form.Group>
                        <Button variant="warning" onClick={() => setShowEmployee(true)} className="select-employee-button">Select different employee</Button>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group>
                        <Form.Label>Reason</Form.Label>
                        <Form.Control onChange={(e) =>
                            setReason(e.target.value)
                        } type="text" disabled={loading} required></Form.Control>
                    </Form.Group>
                </div>
                <div className="row">
                    <Form.Group>
                        <div className="title-container">
                            <Form.Label>Select assets</Form.Label>
                            {selectedAssets.length > 0 && <button onClick={() => setShow(true)} className="edit-button">
                                <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
                            </button>}
                        </div>
                        {selectedAssets.length > 0 && <div className="selected-asset-list">
                            {console.log(selectedAssets)}
                            {selectedAssets.map(a => {
                                return (
                                    <div key={a.original._id} className="selected-asset">
                                        <p>{a.original.Name}</p>
                                        <FontAwesomeIcon className="remove-asset" onClick={() => removeAssetFromList(a.original._id)} icon={faRemove}></FontAwesomeIcon>
                                    </div>
                                )
                            })}
                        </div> || <div className="selected-list-empty">
                            <div className="add-assets" onClick={() => setShow(true)}>
                                <p>Add assets</p>
                                <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
                            </div>
                            </div>}
                        {/* <Button disabled={loading} onClick={() => setShow(true)} >Add assets</Button> */}
                    </Form.Group>
                </div>
                <div className="row create-button">
                    <Form.Group>
                        <Button disabled={loading} type="submit" >Create request</Button>
                    </Form.Group>
                </div>
            </Form>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Include equipment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AssetTable unassigned={true} setSelectedAssets={setSelectedAssets} selectedAssets={selectedAssets} actionBar={false}></AssetTable>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button
                        form="group-form"
                        variant="primary"
                        onClick={(e) => { e.preventDefault(); handleClose(true) }}
                    >
                        Add selected
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEmployee} onHide={handleCloseEmployee} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Select employee
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EmployeeTable hasCheckbox={false} setSelectedEmployee={setSelectedEmployee} selectedEmployee={selectedEmployee} actionBar={false} title={""}></EmployeeTable>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseEmployee}
                    >
                        Close
                    </Button>
                    {/* <Button
                        form="group-form"
                        variant="primary"
                        onClick={(e) => { e.preventDefault(); handleCloseEmployee(true) }}
                    >
                        Add selected
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default NewRequest