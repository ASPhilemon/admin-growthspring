import { getAllFinancialRecords } from "@/app/data/dbQueries";

export default async function Home() {
  const records = await getAllFinancialRecords();

  return (
    <div>
      {Object.entries(records).map(([month, data]) => (
        <div className="month-container ms-3" key={month}>
          <div className="month-summary ms-3">
            <h5>{month}</h5>
            <p className="mt-2" style={{color : 'green'}}>Total Inflow: {data.totalInflow.toLocaleString()}</p>
            <p className="outflow" style={{color : 'red'}}>Total Outflow: {data.totalOutflow.toLocaleString()}</p>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Destination/Source</th>
                </tr>
              </thead>
              <tbody>
                {data.records.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td className={record.type === 'payment' || record.type === 'deposit' ? 'inflow' : 'outflow'}>
                      {record.type}
                    </td>
                    <td>{record.name}</td>
                    <td className={record.type === 'payment' || record.type === 'deposit' ? 'inflow' : 'outflow'}>
                      {record.amount.toLocaleString()}
                    </td>
                    <td>{record.destination || record.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
