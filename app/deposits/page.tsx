import { Button } from "react-bootstrap"
import { PlusLg } from "react-bootstrap-icons";
import { Search } from "../components/search"
import { searchFilterDeposit } from "../data/dbQueries";
import { DepositCards } from "../components/DepositCards";
import { Suspense } from "react";
import PaginationWrapper from "../components/PaginationWrapper";
import { getUser } from "../utils";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

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
  //admin authorization
  const cookieStore = cookies()
  const token = cookieStore.get('jwt')?.value
  const user = getUser(token)
  if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
  if (user && user.isAdmin == "false") redirect('https://auth.growthspringers.com/signin')


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

  // const url = headers().get('x-url')
  // // Stuff with the URL


  return(
    <div>
      <div className="d-flex align-items-center py-3 px-3">
        <h5 className="me-4 mb-0  fw-light " >Deposits</h5>
        <Button className="shadow-sm"  variant = 'primary' >Add Deposit <PlusLg color="white" className="fw-bolder ms-2" size = {20} /> </Button>
      </div>
      
      <Search key = {`${currentPage} ${year} ${month} ${member} ${sortBy}${order} ${perPage}`} />
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