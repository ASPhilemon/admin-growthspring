'use client';

//next imports
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
import {Col} from "react-bootstrap";
//react imports
//installed components imports
import { Pagination} from "react-bootstrap";
//custom components imports
import { generatePagination } from '@/app/utils';

const PageEllipsis = Pagination.Ellipsis
const PagePrevArrow = Pagination.Prev
const PageNextArrow = Pagination.Next
const PageItem = Pagination.Item

export function Paginator({ totalDeposits }: { totalDeposits: number }) {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('currentPage')) || 1;
  const prevPage = Number(searchParams.get('prevPage')) || -1;
  const perPage = Number(searchParams.get('perPage')) || 20;

  const totalPages = Math.ceil(totalDeposits /perPage )

  function createPageURL (newPage: number | string) {
    const params = new URLSearchParams(searchParams);
    params.set('currentPage', newPage.toString());
    params.set('prevPage', currentPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(totalPages, currentPage, prevPage);
  console.log(allPages);

  return (
    <Col lg = {{  offset: 3 }} className = 'fixed-bottom d-flex justify-content-center overflow-x-auto'  >
      <Pagination className="d-flex justify-content-center shadow-lg" >
      <PagePrevArrow
        as = {Link}
        href = { createPageURL(currentPage - 1)}
        className = { currentPage <= 1 || totalPages == 0? 'disabled': '' } 
      />

      {allPages.map((page, index) => {
        const isLeftEllipsis = index == 1 &&  page != 2 
        const isRightEllipsis = index == 4 && totalPages >= 6 && page != totalPages - 1
        if (isLeftEllipsis ) return (
          <PageEllipsis className="bg-dark-subtle" as = {Link} key = {page} href = {createPageURL(page)} />
        )
        if (isRightEllipsis) return (
          <PageEllipsis className="bg-dark-subtle" as = {Link} key = {page} href = {createPageURL(page)} />
        )
        return (
          <PageItem
            as = {Link}
            key = {page}
            href = { createPageURL(page) }
            active = {page === currentPage}
            className="bg-dark"
            
          >
            {page}
          </PageItem> 
        )
      })}

      <PageNextArrow
        as = {Link}
        href = { createPageURL(currentPage + 1)}
        className = { currentPage >= totalPages || totalPages == 0? 'disabled': '' }  
        />
      </Pagination>
    </Col>
    
  );
}