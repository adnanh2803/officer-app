import React, { useEffect, useState } from "react";
import CoreTable from "../../../components/Core/Table/CoreTable";
import "./AssetTable.scss";

import assetApi from '../../../services/asset-api'
import assetGroupApi from '../../../services/asset-group-api'

function AssetTable({setSelectedAssets, selectedAssets, unassigned, actionBar}) {
  const [assets, setAssets] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const getGroupOptions = async function () {

  }
  const loadData = async function () {
    try{
      setLoading(true)
      const apiData = unassigned ? await assetApi.getUnassigned() : await assetApi.get();
      setAssets(apiData);
    }catch(error){
      console.log(error)
      setAssets([]);
      setError(true);
    }finally{
      setLoading(false)
    }
}
  useEffect(()=>{
    if(assets == null && !error) loadData()
  },[assets])
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Description",
        accessor: "Description",
      },
      {
        Header: "Label",
        accessor: "Label",
      },
      {
        Header: "Purchase Date",
        accessor: "PurchaseDate",
      }
    ],
    []
  );
  const assetConf = {
    Name: {
      Name: 'Name',
      ControlType: "Text",
      Required: true
    },
    Label: {
      Name: 'Label',
      ControlType: "Text",
      Required: true
    },
    PurchaseDate: {
      Name: 'Purchase Date',
      ControlType: "Date",
      Required: true
    },
    Description: {
      Name: 'Description',
      ControlType: "Text"
    },
    AssetGroupId: {
      Name: 'Asset Group',
      ControlType: "Select",
      DataSource: assetGroupApi,
      Required: true
  }
}
  return (
    <>
      {!loading && assets != null &&
      (
      <>
      <CoreTable objectName={"Asset"} actionBar={actionBar} setSelRows={setSelectedAssets} selRows={selectedAssets} createFormConf={assetConf} apiService={assetApi} setData={setAssets} data={assets} columns={columns} title={'Assets'}></CoreTable>
      </>
      )
    }
    </>
  );
}

export default AssetTable;
