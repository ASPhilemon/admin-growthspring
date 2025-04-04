//import { getAllFinancialRecords } from "@/app/data/dbQueries";
//import ClientSideFinancials from "./components/ClientSideFinancials";
import { ClientSideFinancialsFetcher } from "./components/ClientSideFinancialsFetcher";
import { Suspense } from "react";

export default function Home() {
  
  
  return (
    <div>
      <Suspense fallback = "loading ..." >
        <ClientSideFinancialsFetcher />
      </Suspense>
    </div>
  );
}
