import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { findDepositById } from "@/app/data/dbQueries"
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { cookies } from "next/headers"
import { getUser } from "@/app/utils"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Loader } from "@/app/components/Loader"


export default async function Page({params, req}: any){

  const cookieStore = cookies()
  const token = cookieStore.get('jwt')?.value
  const user = getUser(token)
  if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
  if (user && user.isAdmin == "false") redirect('https://growthspringers.com/signin')

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
  const headerList = headers()
  const referer = headerList.get('referer') || "/deposits"

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
      <div className="d-flex align-items-start">
        <h5 className="deposit-field">Balance Before</h5>
        <p>UGX {deposit.balance_before.toLocaleString()}</p>
      </div>

      <Link className="btn btn-back btn-secondary mt-5 px-4" href = {referer} > Back </Link>
    
    </div>
  )
}