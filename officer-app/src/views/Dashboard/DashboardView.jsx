import './DashboardView.scss'
import { useContext,useEffect, useState } from 'react'
import AssetAgreementTable from '../AssetAgreements/components/AssetAgreementTable'
import { UserContext } from '../../hooks/Auth/UserContext'
function DashboardView() {
    const {user} = useContext(UserContext)
    function transformData(data,status){
        const t = data.filter((row)=>{
            return row.UserStatus.some((u)=>{
                return u.email == user.Email && u.status == status
            })
        })
        return t
    }
    function signed(data){
        return transformData(data,'completed')
    }
    function toSign(data){
        return transformData(data,'sent')
    }
    return (
        <>
        <h1>Dashboard</h1>
        <div className='DashboardView'>
            <div className='aggrement-in-progress'>
                <AssetAgreementTable hasCheckbox={false} actionBar={false} title='Agreements to sign' transformData={toSign}></AssetAgreementTable>
            </div>
            {/* <div className='aggrement-done'>
                <AssetAgreementTable hasCheckbox={false} actionBar={false} title='Signed agreements' transformData={signed}></AssetAgreementTable>
            </div> */}
        </div>
        </>
    )
}

export default DashboardView