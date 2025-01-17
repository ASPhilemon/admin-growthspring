"use client";

import { useEffect, useState } from "react";
import { DepositCards } from "@/app/components/DepositCards";
import PaginationWrapper from "@/app/components/PaginationWrapper";

export default function ClientDeposits({ searchParams, users }) {
  const [filters, setFilters] = useState(() => {
    const savedFilters = JSON.parse(localStorage.getItem("depositsFilters"));
    return savedFilters || {
      currentPage: 1,
      year: "all",
      month: "all",
      member: "all",
      sortBy: "deposit_date",
      order: -1,
      perPage: 20,
    };
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem("depositsFilters", JSON.stringify(filters));
    setDataLoaded(true); // Indicate that data is ready
  }, [filters]);

  const { currentPage, year, month, member, sortBy, order, perPage } = {
    ...filters,
    ...searchParams,
  };

  const searchFilter = {
    year,
    month,
    member,
    sortBy,
    order,
    perPage,
    page: currentPage,
  };
console.log(searchFilter)
  if (!dataLoaded) {
    return <p>Loading...</p>; // Show a loading message or spinner while data is being prepared
  }

  return (
    <>
      <DepositCards searchFilter={searchFilter} />
      <PaginationWrapper searchFilter={searchFilter} />
    </>
  );
}
