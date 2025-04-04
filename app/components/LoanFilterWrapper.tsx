import { getUsers } from "../data/dbQueries";
import { getLoans } from "../data/loan-queries";
import { LoanFilter } from "./LoanFilter";
import { LoanCards } from "./LoanCards";

export async function LoanFilterWrapper({loanFilter}:any){
  const usersPromise =  getUsers();
  const loansPromise = getLoans(loanFilter)
  const [users, loans] = await Promise.all([usersPromise, loansPromise])
  return(
    <>
      <LoanFilter users={users} />
      <div>
          <LoanCards loans = {loans} />
      </div>
    </>
  )
}