
import { getLoans } from "../data/loan-queries";
import { LoanRequestCard } from "./LoanRequestCard";

export async function LoanRequestCards(){
  const loans = await getLoans({loan_status: "Initiation", sortBy:"latest_date", order: 1, page: 1, perPage: 100})

  return(
    loans.length > 0 ?
    <div className = "loan-cards p-2 rounded-2" >
      {loans.map((loan) => {
        return (
        <LoanRequestCard key = {loan._id} loan = {loan} />
        )
      })}
    </div> : <p>There are no pending requests at the moment</p>
  )
}