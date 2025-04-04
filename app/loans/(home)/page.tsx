import Link from "next/link";
import { Suspense } from "react";
import { LoanFilterWrapper } from "@/app/components/LoanFilterWrapper";


export default async function Page({ searchParams }: any) {
  const loanFilter = {
    year: Number(searchParams.year) || "",
    month: Number(searchParams.month) || "",
    member: searchParams.member || "",
    loan_status: searchParams.loan_status || "",
    page: Number(searchParams?.page) || 1,
    sortBy: searchParams.sortBy || "loan_date",
    order: Number(searchParams?.order) || -1,
    perPage: Number(searchParams?.perPage) || 100,
  };

  return (
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
      <Link className="me-3 text-warning fw-bold" href="/deposits"> Loans </Link>
        <Link className="btn btn-primary btn-sm" href="/loans/requests">
          Requests
        </Link>
      </div>
      {/* <Suspense fallback = { <h1 style={{fontSize: "100px"}} >LOADING ...</h1> } > */}
        <LoanFilterWrapper loanFilter={ loanFilter} />
      {/* </Suspense> */}
    </div>
  );
}
