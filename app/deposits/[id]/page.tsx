import { notFound } from "next/navigation"
import { findDepositById } from "@/app/data/dbQueries"
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { Suspense } from "react"
import { Loader } from "@/app/components/Loader"


export default async function Page({params}: any){

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
      <div className="d-flex align-items-start">
        <h5 className="deposit-field">Comment</h5>
        { deposit.comment? <p> {deposit.comment}</p> : <p className="text-muted">Not Available</p>}
      </div>

      <Link className="btn btn-back btn-secondary mt-5 px-4" href = "/deposits" > Back </Link>
    
    </div>
  )
}