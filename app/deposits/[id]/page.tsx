import { notFound } from "next/navigation"
import { findDepositById } from "@/app/data/dbQueries"
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { Suspense } from "react"
import { Loader } from "@/app/components/Loader"
import BackButton from "@/app/components/BackButton";


export default async function Page({params}: any){
console.log(params)
  return(
    <div className="px-md-5 px-3 py-3 my-2">
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href="/deposits"> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Details</BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback = {<Loader/>} >
        <DepositDetails id = {params.id} />
      </Suspense>
    </div>
  )
}

async function DepositDetails({id}:any){

  const deposit = await findDepositById(id)
  if (!deposit) notFound()


  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }
  // Handle back navigation using window.history
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back(); // Mimic browser back button
    } else {
      // Optional fallback if there is no previous page in the browser history
      window.location.href = "/"; // Redirect to a default route
    }
  };
    
  return(
    <div>
      <div className="d-flex  mb-3 align-items-start">
        <h5 className="deposit-field" >Depositor</h5>
        <p>{deposit.depositor_name}</p>
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field">Amount</h5>
        <p>UGX {deposit.deposit_amount.toLocaleString()}</p>
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field" >Date</h5>
        <p>{getDateString(deposit.deposit_date)}</p>
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field">Recorded By</h5>
        <p>{deposit.recorded_by}</p>
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field">Source</h5>
        <p>{deposit.source}</p>
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field">Balance Before</h5>
        <p>UGX {deposit.balance_before.toLocaleString()}</p>
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field">Cash Location</h5>
        { deposit.cashLocation? <p> {deposit.cashLocation}</p> : <p className="text-muted">Not Available</p>}
      </div>
      <div className="d-flex align-items-start mb-3">
        <h5 className="deposit-field">Comment</h5>
        { deposit.comment? <p> {deposit.comment}</p> : <p className="text-muted mb-3">Not Available</p>}
      </div>

      <BackButton/>
    </div>
  )
}