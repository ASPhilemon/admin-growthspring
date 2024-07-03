
import { getLoans } from "../data/loan-queries";
import { LoanCard } from "./LoanCard";
import { LoansFilterSummary } from "./LoansFilterSummary";

export async function LoanCards({loanFilter}: any){
  const loans = await getLoans(loanFilter)
  const loans_summary = summarize_loans(loans)
  // await new Promise(resolve => setTimeout(resolve, 5000));

  return(
    loans.length > 0 ?
    <div className = "loan-cards p-2 rounded-2">
      <div className="mb-2 p-0">
        <LoansFilterSummary loans_summary = {loans_summary} />
      </div>
      {loans.map((loan) => {
        return (
        <LoanCard key = {loan._id} loan = {loan} />
        )
      })}
    </div>
    : <NoLoans/>
  )
}

function NoLoans() {
  return (
    <div className = "px-2 my-2" >
      <p className="text-muted">No loans were found for this filter </p>
    </div>
  )
}


function summarize_loans(loans:any){
  const loans_summary = {
    ongoingLoansCount: 0,
    endedLoansCount: 0,
    totalPrincipal: 0,
    principalLeft: 0,
    interestPaid: 0,
    expectedInterest: 0,
    members: new Set(),
    membersEndedLoans: new Set(),
    membersOngoingLoans:new Set(),
  }

  loans.reduce((acc:any, cur:any)=> {
    cur.loan_status == "Ongoing"? acc.ongoingLoansCount += 1 : acc.endedLoansCount += 1
    acc.totalPrincipal += cur.loan_amount
    acc.principalLeft += cur.principal_left
    cur.loan_status == "Ongoing"? acc.expectedInterest += cur.interest_amount : acc.interestPaid += cur.interest_amount
    acc.members.add(cur.borrower_name)
    cur.loan_status == "Ongoing"? acc.membersOngoingLoans.add(cur.borrower_name) : acc.membersEndedLoans.add(cur.borrower_name)
    return acc
  }, loans_summary)

  console.log(loans_summary)

  return loans_summary
}