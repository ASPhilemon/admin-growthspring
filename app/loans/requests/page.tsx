import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { PlusLg } from "react-bootstrap-icons"
import { LoanRequestCards } from "@/app/components/LoanRequestCards"
import { getLoans } from "@/app/data/loan-queries"


export default async  function Page(){
  const loans = await getLoans({loan_status: "Initiation", sortBy:"latest_date", order: 1, page: 1, perPage: 100})

  return (
    <div className="px-md-5 px-3 py-3 my-2" >
      <Breadcrumb className="d-inline-block">
        <BreadcrumbItem linkAs = {Link} href="/loans" > Loans </BreadcrumbItem>
        <BreadcrumbItem  active>Requests</BreadcrumbItem>
      </Breadcrumb>
      <Link className="btn btn-primary btn-sm ms-3 " href = "/loans/requests/add" >
        Add Request <PlusLg color="white" className="fw-bolder ms-2" size = {20} />
      </Link>
      <LoanRequestCards initialLoans = {loans} />
    </div>
  )
}