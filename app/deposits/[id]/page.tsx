import { notFound } from "next/navigation"
import { findDepositById } from "@/app/data/dbQueries"
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { cookies } from "next/headers"
import { getUser } from "@/app/utils"
import { redirect } from "next/navigation"


export default async function Page({params}: any){

  const cookieStore = cookies()
  const token = cookieStore.get('jwt')?.value
  const user = getUser(token)
  if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
  if (user && user.isAdmin == "false") redirect('https://growthspringers.com/signin')


  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }

  const deposit = await findDepositById(params.id)
  if (!deposit) notFound()

  return(
    <div className="px-md-5 px-3 py-3 my-2">
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href="/deposits"> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Deposit Details</BreadcrumbItem>
      </Breadcrumb>
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

        <Link className="btn btn-back btn-secondary mt-5 px-4" href = "/deposits" > Back </Link>
      
      </div>
    </div>
  )
}