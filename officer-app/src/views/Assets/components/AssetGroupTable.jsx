import React, { useState, useEffect } from "react";
import CoreTable from "../../../components/Core/Table/CoreTable";
import "./AssetTable.scss";

import assetGroupApi from "../../../services/asset-group-api";

function AssetGroupTable(actionBar) {
  const [assetGroups, setAssetGroups] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const loadData = async function () {
    try{
      setLoading(true)
      const apiData = await assetGroupApi.get();
      setAssetGroups(apiData);
      console.log(apiData)
    }catch(error){
      console.log(error)
      setAssetGroups([]);
      setError(true)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    if (assetGroups == null && !error) loadData()
  }, [assetGroups])
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
    ],
    []
  );
  const assetGroupConf = {
    Name: {
      Name: "Name",
      ControlType: "Text",
      Required: true
    },
    Description: {
      Name: "Description",
      ControlType: "Text",
      Required: true
    }
  }
  return (
    <>
      {!loading &&
        (
          <>
            <CoreTable objectName={"AssetGroup"} actionBar={actionBar} createFormConf={assetGroupConf} apiService={assetGroupApi} setData={setAssetGroups} data={assetGroups} columns={columns} title={'Asset Groups'}></CoreTable>
          </>
        )
      }
    </>
  );
}

export default AssetGroupTable;
