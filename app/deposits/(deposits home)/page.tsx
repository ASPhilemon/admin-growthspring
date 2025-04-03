import { PlusLg } from "react-bootstrap-icons";
import { Search } from "@/app/components/search";
import { searchFilterDeposit } from "@/app/data/dbQueries";
import { DepositCards } from "@/app/components/DepositCards";
import Link from "next/link";
import { getUsers } from "@/app/data/dbQueries";
import { redirect } from "next/navigation";
import { getDepositsByPage } from "@/app/data/dbQueries";

export default async function DepositsPage({
  searchParams,
}: {
  searchParams?: {
    currentPage?: string;
    year?: string;
    month?: string;
    member?: string;
    sortBy?: 'deposit_amount' | 'deposit_date';
    order?: string;
    perPage?: string;
  };
}) {
  // Default filters
  const defaultFilters = {
    currentPage: 1,
    year: "all",
    month: "all",
    member: "all",
    sortBy: "deposit_date" as 'deposit_amount' | 'deposit_date',
    order: -1,
    perPage: 100,
  };

  // Step 1: Merge searchParams with defaultFilters
  const filters = {
    ...defaultFilters,
    ...searchParams, // Merge searchParams with defaultFilters
  };

  
  const currentPage = Number(filters.currentPage);
  const year = filters.year;
  const month = filters.month;
  const member = filters.member;
  const sortBy = filters.sortBy;
  const order = Number(filters.order);
  const perPage = Number(filters.perPage);

  const searchFilter: searchFilterDeposit = {
    year,
    month,
    member,
    sortBy,
    order,
    perPage,
    page: currentPage,
  };

  // Step 2: Fetch users
  const [ users, deposits] = await Promise.all([
    getUsers(),
    getDepositsByPage(searchFilter)
  ])

  // Step 3: Sync filters with URL if they are different
  const queryString = new URLSearchParams({
    currentPage: filters.currentPage.toString(),
    year: filters.year.toString(),
    month: filters.month.toString(),
    member: filters.member.toString(),
    sortBy: filters.sortBy.toString(),
    order: filters.order.toString(),
    perPage: filters.perPage.toString(),
  }).toString();

  // If current URL parameters differ from the selected filters, update the URL
  // if (JSON.stringify(filters) !== JSON.stringify(searchParams)) {
  //   redirect(`/deposits?${queryString}`);
  // }

  return (
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
        <Link className="me-3 text-primary" href="/deposits"> Deposits </Link>
        <Link className="shadow-sm btn btn-sm btn-primary" href="/deposits/add">
          Add Deposit
          <PlusLg color="white" className="fw-bolder ms-2" size={20} />
        </Link>
      </div>
      <div>
        {/* <Suspense
          fallback={<Loader />}
          key={`${currentPage}-${year}-${month}-${member}-${sortBy}-${order}-${perPage}`}
        > */}
          <Search users={users} />
          <DepositCards deposits = {deposits} searchFilter={searchFilter} />
        {/* </Suspense> */}
      </div>
      {/* <div>
        <PaginationWrapper searchFilter={searchFilter} baseUrl={`/deposits`} />
      </div> */}
    </div>
  );
}
