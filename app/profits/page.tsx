import { getProfitRecords } from "@/app/data/dbQueries";
import Profits from "../components/Profits";

export default async function Locations() {
  const records = await getProfitRecords();

  return (
    <div>
      <Profits profitData={records} />
    </div>
  );
}
