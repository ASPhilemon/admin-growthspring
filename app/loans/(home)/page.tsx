import Link from "next/link";
//import { PlusLg } from "react-bootstrap-icons";
import { Suspense } from "react";
import { getLoans } from "@/app/data/loan-queries";
import { LoanCards } from "@/app/components/LoanCards";
import { LoanFilter } from "@/app/components/LoanFilter";
import { getUsers } from "@/app/data/dbQueries";
import { LoanFilterWrapper } from "@/app/components/LoanFilterWrapper";
// import { LoanCardsSkeleton } from "./loading1";
//import { redirect } from "next/navigation";

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

  // // Use Object.entries to compare filters in a stable way
  // const queryString = new URLSearchParams(
  //   Object.entries(loanFilter).reduce((acc, [key, value]) => {
  //     if (value !== undefined && value !== null && value !== "") {
  //       acc[key] = value.toString();
  //     }
  //     return acc;
  //   }, {} as Record<string, string>)
  // ).toString();

  // // Redirect only if the query string differs from current parameters
  // if (
  //   decodeURIComponent(queryString) !== decodeURIComponent(new URLSearchParams(searchParams).toString())
  // ) {
  //   redirect(`/loans?${queryString}`); // Redirects to `/loans` instead of `/deposits`
  // }



  return (
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
      <Link className="me-3 text-warning fw-bold" href="/deposits"> Loans </Link>
        <Link className="btn btn-primary btn-sm" href="/loans/requests">
          Requests
        </Link>
      </div>
      <Suspense fallback = { <h1 style={{fontSize: "100px"}} >LOADING ...</h1> } >
        <LoanFilterWrapper loanFilter={ loanFilter} />
      </Suspense>
    </div>
  );
}
