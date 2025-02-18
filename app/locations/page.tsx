import { getLocationRecords } from "@/app/data/dbQueries";
import CashTransactions from "../components/CashTransactions";

export default async function Locations() {
  const records = await getLocationRecords();

  return (
    <div>
      <CashTransactions records={records} />
    </div>
  );
}
