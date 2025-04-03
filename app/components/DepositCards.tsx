//import { getDepositsByPage } from "../data/dbQueries";
import { DepositCard } from "./DepositCard";

export async function DepositCards({ searchFilter, deposits } : any) {
  let monthlyTotal = 0;
  let currentMonth = '';

  return (
    deposits.length > 0 ? (
      <div className="deposit-cards overflow-auto" style={{ maxHeight: "70vh" }}>
        {deposits.map((deposit:any, index:any) => {
          const month = new Date(deposit.deposit_date).toLocaleString('default', { month: 'long', year: 'numeric' });
          const isNewMonth = month !== currentMonth;

          if (isNewMonth) {
            currentMonth = month;
            monthlyTotal = deposits
              .filter((d: { deposit_date: string | number | Date; }) => new Date(d.deposit_date).toLocaleString('default', { month: 'long', year: 'numeric' }) === month)
              .reduce((sum: any, d: { deposit_amount: any; }) => sum + d.deposit_amount, 0);
          }

          return (
            <div key={deposit._id}>
              {isNewMonth && (
                <h5 className="ms-3 my-3 pt-2">
                  {month} - Total: {monthlyTotal.toLocaleString()}
                </h5>
              )}
              <DepositCard deposit={deposit} params = {searchFilter} />
            </div>
          );
        })}
      </div>
    ) : (
      <NoDeposits />
    )
  );
}

function NoDeposits() {
  return (
    <div className="ms-2">
      <p>No deposits were found for this filter.</p>
    </div>
  );
}
