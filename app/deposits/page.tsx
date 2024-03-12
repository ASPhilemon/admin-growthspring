import { Button } from "react-bootstrap"
import { getTotalDepositsCount, getDepositsByPage } from "../data/dbQueries"
import { Search } from "../components/search"


export default async function Deposits (){
  const searchFilter = {}
  const depositsCount = await getTotalDepositsCount(searchFilter)
  const deposits = await getDepositsByPage({...searchFilter, page: 1})
  
  return(
    <div>
      <div className="d-flex align-items-center py-4">
        <h5 className="me-4" >Deposits</h5>
        <Button variant = 'primary' >Add Deposit + </Button>
      </div>
      
      <Search/>
    </div>
  )
}