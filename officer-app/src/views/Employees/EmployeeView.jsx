import EmployeeTable from './components/EmployeeTable'
import './EmployeeView.scss'
import { useEffect, useState } from 'react'

function EmployeeView() {
    return (
        <div className='EmployeeView'>
            <div className='employee-table'>
                <EmployeeTable title={"Employee"}></EmployeeTable>
            </div>
        </div>
    )
}

export default EmployeeView