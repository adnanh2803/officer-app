import React, { useEffect, useState } from "react";
import CoreTable from "../../../components/Core/Table/CoreTable";
import "./ReviewersTable.scss";
import userApi from '../../../services/user-api'

function ReviewersTable({setSelectedReviewers, selectedReviewers, actionBar}) {
  const [reviewers, setReviewers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const loadData = async function () {
    try{
      setLoading(true)
      const apiData = await userApi.getReviewers(true);
      setReviewers(apiData);
    }catch(error){
      console.log(error)
      setReviewers([]);
      setError(true);
    }finally{
      setLoading(false)
    }
}
  useEffect(()=>{
    if(reviewers == null && !error) loadData()
  },[reviewers])
  const columns = React.useMemo(
    () => [
      {
        Header: "Full name",
        accessor: "FullName",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Position",
        accessor: "Position",
      }
    ],
    []
  );
  const reviewersConf = {
    FullName: {
        ControlType: "Text",
        Required: true
    },
    Email: {
        ControlType: "Text",
        Required: true
    },
}
  return (
    <>
      {!loading && reviewers != null &&
      (
      <>
      <CoreTable actionBar={actionBar} setSelRows={setSelectedReviewers} selRows={selectedReviewers} createFormConf={reviewersConf} apiService={userApi} setData={setReviewers} data={reviewers} columns={columns} title={'Reviewers'}></CoreTable>
      </>
      )
    }
    </>
  );
}

export default ReviewersTable;
