import React, { useEffect, useState } from "react";
import CoreTable from "../../../components/Core/Table/CoreTable";
import '../AssetAgreementView.scss'
import { NavLink  } from "react-router-dom"
import BLink from "react-bootstrap/NavLink";
import AssetAgreementApi from '../../../services/asset-agreement-api'
import loader from '../../../assets/loader.svg'
function AssetAgreementTable({hasCheckbox, actionBar, details, transformData, title = 'Asset Agreements'}) {
  const [AssetAgreements, setAssetAgreements] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async function () {
    try {
      setLoading(true)
      const apiData = await AssetAgreementApi.get();
      const transformedData = transformData ? transformData(apiData) : apiData;
      setAssetAgreements(transformedData);
    } catch (error) {
      console.log(error)
      setAssetAgreements([]);
      setError(true);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (AssetAgreements === null) loadData()
  }, [AssetAgreements])
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "Name",
        Cell: props => <BLink as={NavLink} to={`/asset-agreements/details/${props.row.original._id}`}>{props.value}</BLink>
      },
      {
        Header: "Employee",
        accessor: "FullName"
      },
      {
        Header: "Reason",
        accessor: "Reason"
      },
      {
        Header: "Status",
        accessor: "Status"
      }
    ],
    []
  );
  const AssetAgreementConf = {
    Name: {
      Name: 'Name',
      ControlType: "Text",
      Required: true
    },
    Reason: {
      Name: 'Reason',
      ControlType: "Text",
      Required: true
    }
  }
  return (
    <div className="asset-agremment-wrap">
      <h3>{title}</h3>
      {!loading && AssetAgreements !== null &&
        (
          <>
            <CoreTable hasCheckbox={hasCheckbox} objectName={"AssetAgreement"} actionBar={actionBar} details={details} createFormConf={AssetAgreementConf} apiService={AssetAgreementApi} setData={setAssetAgreements} data={AssetAgreements} columns={columns}></CoreTable>
          </>
        ) ||
        <div className="loader">
            <div className="spinner">
              <img src={loader} alt="loading..."></img>
            </div>
        </div>
      }
    </div>
  );
}

export default AssetAgreementTable;
