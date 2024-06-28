
import { getLoans } from "../data/loan-queries";
import { LoanCard } from "./LoanCard";

export async function LoanCards({loanFilter}: any){
  const loans = await getLoans(loanFilter)

  return(
    loans.length > 0 ?
    <div className = "loan-cards p-2 rounded-2" >
      {loans.map((loan) => {
        return (
        <LoanCard key = {loan._id} loan = {loan} />
        )
      })}
    </div> : <NoLoans/>
  )
}

function NoLoans() {
  return (
    <div className = "ms-22" >
      <p className="text-muted">No records were found for this filter </p>
    </div>
  )
}