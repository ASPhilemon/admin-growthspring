import { Paginator } from './Pagination';
import { getTotalDepositsCount } from '../data/dbQueries';

export default async function PaginationWrapper({searchFilter} : any){

  const totalDeposits = await getTotalDepositsCount(searchFilter)
  
  return (
    <Paginator totalDeposits = {totalDeposits} />
  )
}