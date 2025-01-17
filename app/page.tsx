import { getAllFinancialRecords } from "@/app/data/dbQueries";
import ClientSideFinancials from "./components/ClientSideFinancials";

export default async function Home() {
  const records = await getAllFinancialRecords();
  
  return (
    <div>
      <ClientSideFinancials records={records} />
    </div>
  );
}
