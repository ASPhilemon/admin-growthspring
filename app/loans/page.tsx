import Link from "next/link"
import { PlusLg } from "react-bootstrap-icons"
import { Suspense } from "react"
import { loanCount, getLoans } from "../data/loan-queries"

export default async function Page(){
  let count = await loanCount({loan_status:"Ongoing"})
  let loans = await getLoans({page: 1, order:1, perPage:500, sortBy: "borrower_name" })

    return(
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
        <h5 className="me-4 mb-0  fw-light " >Loans </h5>
        <Link className="btn btn-primary btn-sm"  href = "/loans/requests" >
          Requests
        </Link>
      </div>
      {count}
      {loans.map((loan)=> {
        return <h6 key = {loan._id}>  {loan.borrower_name} {loan.loan_date.toUTCString()} </h6>
      })}
    </div>
    )
}