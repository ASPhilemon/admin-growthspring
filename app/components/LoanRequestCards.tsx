"use client"

import { LoanRequestCard } from "./LoanRequestCard";
import { useState} from "react";

export async function LoanRequestCards({initialLoans}:any){
const [loans, setLoans] = useState(initialLoans)

  function handleLoanDelete(loan_id:string){
    setLoans(loans.filter((loan:any) => loan._id != loan_id))
  }

  return(
    loans.length > 0 ?
    <div className = "loan-cards p-2 rounded-2" >
      {loans.map((loan:any) => {
        return (
        <LoanRequestCard handleLoanDelete = {handleLoanDelete} key = {loan._id} loan = {loan} />
        )
      })}
    </div> : <p className="text-muted mt-2">There are no pending requests at the moment</p>
  )
}