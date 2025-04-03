import ClientSideFinancials from "./ClientSideFinancials";
import { getAllFinancialRecords } from "../data/dbQueries";

export async function ClientSideFinancialsFetcher(){
  const records = await getAllFinancialRecords()
  return(
    <ClientSideFinancials records={ records}  />
  )
}