import { Button } from "react-bootstrap"
import { PlusLg } from "react-bootstrap-icons";
import { getTotalDepositsCount, getDepositsByPage } from "../data/dbQueries"
import { Search } from "../components/search"
import { searchFilterDeposit } from "../data/dbQueries";
import { DepositCards } from "../components/DepositCards";
import { Suspense } from "react";
import PaginationWrapper from "../components/PaginationWrapper";



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
    year, month, member,
    sortBy, order, perPage,
    page: currentPage,
  }


  return(
    <div>
      <div className="d-flex align-items-center py-3 px-3">
        <h5 className="me-4 mb-0  fw-light " >Deposits</h5>
        <Button className="shadow-sm"  variant = 'primary' >Add Deposit <PlusLg color="white" className="fw-bolder ms-2" size = {20} /> </Button>
      </div>
      
      <Search/>
      <div>
        <Suspense key = {`${currentPage} ${year} ${month} ${member} ${sortBy}${order} ${perPage}`}
          fallback = ''
        >
          <DepositCards searchFilter = {searchFilter} />
        </Suspense>
      </div>
      <div>
        <PaginationWrapper searchFilter = {searchFilter} />
      </div>
    </div>
  )
}