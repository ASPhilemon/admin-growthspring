'use client';

//next imports
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
//react imports
//installed components imports
import { Pagination} from "react-bootstrap";
//custom components imports
import { generatePagination } from '@/app/utils';

const PageEllipsis = Pagination.Ellipsis
const PagePrevArrow = Pagination.Prev
const PageNextArrow = Pagination.Next
const PageItem = Pagination.Item

export function Paginator({ totalPages }: { totalPages: number }) {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('currentPage')) || 1;
  const prevPage = Number(searchParams.get('prevPage')) || -1;

  function createPageURL (newPage: number | string) {
    const params = new URLSearchParams(searchParams);
    params.set('currentPage', newPage.toString());
    params.set('prevPage', currentPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(totalPages, currentPage, prevPage);

  return (
    <Pagination className="d-flex" >
      <PagePrevArrow
        as = {Link}
        href = { createPageURL(currentPage - 1)}
        className = { currentPage <= 1 || totalPages == 0? 'disabled': '' } 
      />

      {allPages.map((page, index) => {
        const isLeftEllipsis = index == 1 &&  page != 2 
        const isRightEllipsis = index == 4 && totalPages >= 6 && page != totalPages - 1
        if (isLeftEllipsis ) return (
          <PageEllipsis key = {page} href = {createPageURL(page)} />
        )
        if (isRightEllipsis) return (
          <PageEllipsis key = {page} href = {createPageURL(page)} />
        )
        return (
          <PageItem
            key = {page}
            href = { createPageURL(page) }
            active = {page === currentPage}
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
  );
}