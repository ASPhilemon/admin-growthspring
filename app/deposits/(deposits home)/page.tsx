
import { PlusLg } from "react-bootstrap-icons";
import { Search } from "@/app/components/search";
import { searchFilterDeposit } from "@/app/data/dbQueries";
import { DepositCards } from "@/app/components/DepositCards";
import { Suspense } from "react";
import PaginationWrapper from "@/app/components/PaginationWrapper";
import Link from "next/link";
import { Loader } from "@/app/components/Loader";
import { getUsers } from "@/app/data/dbQueries";

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

  const currentPage = Number(searchParams?.currentPage) || 1;
  const year = Number(searchParams?.year) || 'all';
  const month = Number(searchParams?.month) || 'all';
  const member = searchParams?.member || 'all';
  const sortBy = searchParams?.sortBy || 'deposit_date';
  const order = Number(searchParams?.order) || -1;
  const perPage = Number(searchParams?.perPage) || 20;
 
  const searchFilter : searchFilterDeposit = {
    year, month, member,
    sortBy, order, perPage,
    page: currentPage,
  }

  const users = await getUsers()

  return(
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
        <h5 className="me-4 mb-0  fw-light " >Deposits </h5>
        <Link className="shadow-sm btn btn-primary" href = "/deposits/add" >
          Add Deposit
          <PlusLg color="white" className="fw-bolder ms-2" size = {20} />
        </Link>
      </div>
      <div>
        
        <Suspense fallback = {<Loader/>} key = {`${currentPage} ${year} ${month} ${member} ${sortBy}${order} ${perPage}`}>
          <Search users = {users} />
          <DepositCards searchFilter = {searchFilter} />
        </Suspense>     
      </div>
      <div>
        <PaginationWrapper searchFilter = {searchFilter} />
      </div>
    </div>
  )
}