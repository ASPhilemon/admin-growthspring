import { getTotalDepositsCount, getDepositsByPage } from "../data/dbQueries"


export default async function Deposits (){
  const searchFilter = {depositor_name: "Ariko Stephen Philemon"}
  const depositsCount = await getTotalDepositsCount(searchFilter)
  const deposits = await getDepositsByPage({...searchFilter, page: 2})
  
  return(
    <div>
      <h3 >Deposits</h3>
      <p>Total Deposits {depositsCount} </p>
      <div>
        {
          deposits.map((deposit)=>{
            const month = deposit.deposit_date.toLocaleString('default', { month: 'short' });
            const dayOfMonth = deposit.deposit_date.getDate();
            const year = deposit.deposit_date.getFullYear();
            
            return (
              <div key = {deposit._id} >
                <p>{`${month} ${dayOfMonth} ${year}`}</p>
                <p>{deposit.depositor_name}</p>
                <p>{deposit.deposit_amount}</p>
                <hr />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}