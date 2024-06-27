import { getDepositsByPage } from "../data/dbQueries";
import { DepositCard } from "./DepositCard";

export async function DepositCards({searchFilter}: any){
  const deposits = await getDepositsByPage(searchFilter)

  return(
    deposits.length > 0 ?
    <div className = " deposit-cards" >
      {deposits.map((deposit, index) => {
        return (
        <DepositCard key = {deposit._id} deposit = {deposit} />
        )
      })}
    </div> : <NoDeposits/>
  )
}

function NoDeposits() {
  return (
    <div className = "ms-2" >
      <p>No deposits were found for this filter </p>
    </div>
  )
}