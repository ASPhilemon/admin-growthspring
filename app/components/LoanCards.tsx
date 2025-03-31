import { LoanCard } from "./LoanCard";
import { LoansFilterSummary } from "./LoansFilterSummary";

export async function LoanCards({ loans, scrollPos }: any) {
  const loansSummary = summarizeLoans(loans);
//console.log(scrollPos)
  return loans.length > 0 ? (
    <div className="loan-cards p-2 rounded-2">
      <div className="mb-2 p-0">
        {/* Button to show/hide summary */}
        <details>
          <summary className="btn btn-sm fw-bold" style={{backgroundColor: 'white', width: '100%', color: 'gold', borderColor: 'grey'}}>
            Filter Summary
          </summary>
          <div className="mt-2">
            <LoansFilterSummary loans_summary={loansSummary} />
          </div>
        </details>
      </div>
      <div className="overflow-auto" style={{ maxHeight: "90vh" }}>
        {loans.map((loan:any) => (
          <LoanCard key={loan._id} loan={loan} />
        ))}
      </div>
    </div>
  ) : (
    <NoLoans />
  );
}

function NoLoans() {
  return (
    <div className="px-2 my-2">
      <p className="text-muted">No loans were found for this filter</p>
    </div>
  );
}

function summarizeLoans(loans: any) {
  const loansSummary = {
    ongoingLoansCount: 0,
    endedLoansCount: 0,
    totalPrincipal: 0,
    principalLeft: 0,
    interestPaid: 0,
    expectedInterest: 0,
    members: new Set(),
    membersEndedLoans: new Set(),
    membersOngoingLoans: new Set(),
  };

  loans.reduce((acc: any, cur: any) => {
    cur.loan_status === "Ongoing"
      ? (acc.ongoingLoansCount += 1)
      : (acc.endedLoansCount += 1);
    acc.totalPrincipal += cur.loan_amount;
    acc.principalLeft += cur.principal_left;
    cur.loan_status === "Ongoing"
      ? (acc.expectedInterest += cur.interest_amount)
      : (acc.interestPaid += cur.interest_amount);
    acc.members.add(cur.borrower_name);
    cur.loan_status === "Ongoing"
      ? acc.membersOngoingLoans.add(cur.borrower_name)
      : acc.membersEndedLoans.add(cur.borrower_name);
    return acc;
  }, loansSummary);

  console.log(loansSummary);

  return loansSummary;
}
