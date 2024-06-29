import Link from "next/link"
import { PlusLg } from "react-bootstrap-icons"
import { Suspense } from "react"
import { loanCount, getLoans } from "@/app/data/loan-queries"
import { LoanCards } from "@/app/components/LoanCards"
import { LoanFilter } from "@/app/components/LoanFilter"
import { getUsers } from "@/app/data/dbQueries"
import { LoanCardsSkeleton } from "./loading"

export default async function Page({searchParams}: any){

  const loanFilter = {
    year: Number(searchParams.year),
    member: searchParams.member,
    loan_status: searchParams.loan_status,
    page: Number(searchParams?.page) || 1,
    sortBy: searchParams.sortBy || 'loan_date',
    order: Number(searchParams?.order) || -1,
    perPage: Number(searchParams?.perPage) || 500
  }

  const users = await getUsers()

    return(
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
        <h5 className="me-4 mb-0  fw-light " >Loans </h5>
        <Link className="btn btn-primary btn-sm"  href = "/loans/requests" >
          Requests
        </Link>
      </div>
      <LoanFilter users = {users} />
      <Suspense fallback = {<LoanCardsSkeleton/>} key = {loanFilter.toString()} >
        <LoanCards loanFilter = {loanFilter} />
      </Suspense>
    </div>
    )
}