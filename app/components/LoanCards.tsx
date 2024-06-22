
import { getLoans } from "../data/loan-queries";
import { LoanCard } from "./LoanCard";
import { Search } from "react-bootstrap-icons";

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
      <Search className="ms-4 my-4" size = {70} />
      <p>No records were found for this filter </p>
    </div>
  )
}