
import { getFundRecords } from "@/app/data/dbQueries";
import ClubFund from "../components/ClubFund";

export default async function Locations() {
  // Fetch fund records (server-side)
  const records = await getFundRecords();

  return (
    <div>
      <ClubFund records={records} />
    </div>
  );
}
