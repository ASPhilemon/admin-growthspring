import { PlusLg } from "react-bootstrap-icons";
import { Search } from "@/app/components/search";
import { searchFilterDeposit } from "@/app/data/dbQueries";
import { DepositCards } from "@/app/components/DepositCards";
import { Suspense } from "react";
import PaginationWrapper from "@/app/components/PaginationWrapper";
import Link from "next/link";
import { Loader } from "@/app/components/Loader";
import { getUsers } from "@/app/data/dbQueries";
import { redirect } from "next/navigation";

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
    perPage: 50,
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
  const users = await getUsers();

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
  if (JSON.stringify(filters) !== JSON.stringify(searchParams)) {
    redirect(`/deposits?${queryString}`);
  }

  return (
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
        <h5 className="me-4 mb-0 fw-light">Deposits</h5>
        <Link className="shadow-sm btn btn-primary" href="/deposits/add">
          Add Deposit
          <PlusLg color="white" className="fw-bolder ms-2" size={20} />
        </Link>
      </div>
      <div>
        <Suspense
          fallback={<Loader />}
          key={`${currentPage}-${year}-${month}-${member}-${sortBy}-${order}-${perPage}`}
        >
          <Search users={users} />
          <DepositCards searchFilter={searchFilter} />
        </Suspense>
      </div>
      <div>
        <PaginationWrapper searchFilter={searchFilter} baseUrl={`/deposits`} />
      </div>
    </div>
  );
}
