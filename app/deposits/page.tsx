import { Button } from "react-bootstrap"
import { getTotalDepositsCount, getDepositsByPage } from "../data/dbQueries"
import { Search } from "../components/search"
import { searchFilterDeposit } from "../data/dbQueries";


export default async function DepositsPage ({
  searchParams
}:  {
  searchParams?: {
    currentPage?: string;
    prevPage?: string;
    year?: string;
    month?: string;
    member?: string;
    sortBy?: 'deposit_amount' | 'deposit_date';
    order?: string;
    perPage?: string;
  };
})

{

  const prevPage = Number(searchParams?.prevPage) || -1;
  const currentPage = Number(searchParams?.currentPage) || 1;
  const year = Number(searchParams?.year) || 'all';
  const month = Number(searchParams?.month) || 'all';
  const member = searchParams?.member || 'all';
  const sortBy = searchParams?.sortBy || 'deposit_date';
  const order = Number(searchParams?.order) || -1;
  const perPage = Number(searchParams?.perPage) || 5;
 

  const searchFilter : searchFilterDeposit = {
    page: currentPage,
    year,
    month,
    member,
    sortBy,
    order,
    perPage
  }
  const depositsCount = await getTotalDepositsCount(searchFilter)
  const deposits = await getDepositsByPage(searchFilter)

  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }

  
  return(
    <div>
      <div className="d-flex align-items-center py-3">
        <h5 className="me-4 mb-0" >Deposits</h5>
        <Button variant = 'primary' >Add Deposit + </Button>
      </div>
      
      <Search/>
      <h4>Deposits Count: {depositsCount} </h4>
      <div>
        {deposits.map((deposit, index) => {
          return (
            <div key={index}>
              <h5>{deposit.depositor_name}</h5>
              <p>{deposit.deposit_amount}</p>
              <p>{getDateString(deposit.deposit_date)}</p>
              <p>{index}</p>
              <hr />
            </div>
          )
        })}
      </div>
    </div>
  )
}