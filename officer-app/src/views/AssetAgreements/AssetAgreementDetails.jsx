import './AssetAgreementView.scss'
import { useEffect, useState, useContext, useMemo } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'
import assetAgreementApi from '../../services/asset-agreement-api';
import assetApi from '../../services/asset-api';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../hooks/Auth/UserContext';
function AssetAgreementDetails() {
    const p = useParams()
    const { user } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAssets, setIsLoadingAssets] = useState(true);
    const [generalInfo, setGeneralInfo] = useState();
    const [assets, setAssets] = useState();
    const [docStatus, setDocStatus] = useState();
    async function generateDoc() {
        await assetAgreementApi.pdf(p.id)
    }
    async function signDoc() {
        const data = await assetAgreementApi.signPdf(p.id)
        window.open(data.url,"_self")
    }
    async function loadData() {
        setIsLoading(true)
        const data = await assetAgreementApi.getDetails(p.id);
        data.assetAgreement.Reviewers = JSON.parse(data.assetAgreement.Reviewers);
        setGeneralInfo(data.assetAgreement)
        setDocStatus(data.envelope?.status || "Unavailable")
        setIsLoading(false)
    }

    useEffect(() => {
        loadData();
    }, [])
    return (
        <div className='AssetAgreementDetails'>
            {!isLoading && (
                <>
                    <Form>
                        <div className='row'>
                            <h4>Asset Agreement Details</h4>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <div className="row">
                                    <Form.Group>
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control value={user.FullName} type="text" disabled></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="row">
                                    <Form.Group>
                                        <Form.Label>OIB</Form.Label>
                                        <Form.Control value={user.OIB} type="text" disabled></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="row">
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control value={user.Email} type="text" disabled></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="row">
                                    <Form.Group>
                                        <Form.Label>Position</Form.Label>
                                        <Form.Control value={user.Position} type="text" disabled></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className='row'>
                                    <FormGroup>
                                        <Form.Label>Asset Agreement Name</Form.Label>
                                        <Form.Control value={generalInfo.Name} type="text" disabled></Form.Control>
                                    </FormGroup>
                                </div>
                                <div className='row'>
                                    <FormGroup>
                                        <Form.Label>Reason</Form.Label>
                                        <Form.Control value={generalInfo.Reason} type="text" disabled></Form.Control>
                                    </FormGroup>
                                </div>
                                <div className='row'>
                                    <FormGroup>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control value={docStatus} type="text" disabled></Form.Control>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className='col'>
                                <h4>Assets</h4>
                                {generalInfo.Assets.split(',').map((a, i) => {
                                    return <p key={i}><b>{a}</b></p>
                                })}
                                {/* <h4>Status</h4> */}

                                {/* {generalInfo.Reviewers.map((a, i) => {
                                    return <p key={i}><b>{a.FullName}</b>{a.Signed ? ' Approved the document' : ' Pending document approval'}</p>
                                })} */}

                            </div>
                        </div>
                    </Form>
                    <br/>
                    {<Button type='button' onClick={() => generateDoc()}>Download document</Button>}
                    &nbsp;
                    {docStatus != "Unavailable" && <Button type='button' onClick={() => signDoc()}>E-sign document</Button>}
                </>
            )

            }
        </div>
    )
}

export default AssetAgreementDetails