import React, { useEffect, useState } from "react";
import CoreTable from "../../../components/Core/Table/CoreTable";
import "../EmployeeView.scss";

import employeeApi from '../../../services/employee-api'

function EmployeeTable({hasCheckbox, selectedEmployee, setSelectedEmployee, actionBar, title}) {
  const [employees, setEmployees] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async function () {
    try {
      setLoading(true)
      const apiData = await employeeApi.get();
      setEmployees(apiData.data);
    } catch (error) {
      console.log(error)
      setEmployees([]);
      setError(true);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (employees === null) loadData()
  }, [employees])
  const columns = React.useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "FullName",
      },
      {
        Header: "Activation Code",
        accessor: "ActivationCode",
      },
      {
        Header: "Date of birth",
        accessor: "DOB",
      },
      {
        Header: "Email",
        accessor: "Email",
      }
    ],
    []
  );
  const employeeConf = {
    FullName: {
      Name: 'Full Name',
      ControlType: "Text",
      Required: true
    },
    Position: {
      Name: 'Position',
      ControlType: "Text",
      Required: true
    },
    DOB: {
      Name: 'DOB',
      ControlType: "Date",
      Required: true
    },
    Email: {
      Name: 'Email',
      ControlType: "Text",
      Required: true
    },
    Address: {
      Name: 'Address',
      ControlType: "Text",
      Required: true
    },
    OIB: {
      Name: 'OIB',
      ControlType: "Text",
      Required: true
    }
  }
  return (
    <>
      {!loading && employees !== null &&
        (
          <>
            <CoreTable objectName={"Employee"} hasCheckbox={hasCheckbox} selRows={selectedEmployee} setSelRows={setSelectedEmployee} actionBar={actionBar} createFormConf={employeeConf} apiService={employeeApi} setData={setEmployees} data={employees} columns={columns} title={title}></CoreTable>
          </>
        )
      }
    </>
  );
}

export default EmployeeTable;
