import React from 'react';
import PropTypes from 'prop-types';

const Profits = ({ profitData } : any) => {
  return (
    <div className="profits-container p-3">
    <h4 className="ms-3 my-2">Profit Projections for This Year</h4>
    <h6 className="ms-3"> Assumptions:</h6> 
    <div className='mb-3 ms-3' style={{fontStyle: "italic", color: "blue"}}>
      <p className='mb-2'>1. The currently Ongoing loans are the last for the Year.</p>
      <p className='mb-2'>2. It considers if all loans are cleared today. So only interest received already is used, not the future one.</p>
      <p className='mb-2'>3. Therefore, it assumes that from Today to end of the Year, all interest is from Unit Trusts. 10% Annual rate is used.</p>
      <p className='mb-2'>4. No losses occur within the Year.</p>
    </div>
    <hr />
    <table className="summary-table">
      <tbody>
        <tr>
          <td>
            <div>
              <p>Interest from Loans:</p>
              <p style={{ fontStyle: "italic", fontSize: "small", color: "blue" }}>
                (Interest already earned)
              </p>
            </div>
          </td>
          <td style={{ color: "green", textAlign: "right" }}>
            {profitData?.loanInterest?.toLocaleString() || "0"}
          </td>
        </tr>
        <tr>
          <td>
            <div>
              <p>Interest from Unit Trusts:</p>
              <p style={{ fontStyle: "italic", fontSize: "small", color: "blue" }}>
                (Based on assumptions above)
              </p>
            </div>
          </td>
          <td style={{ color: "green", textAlign: "right" }}>
            {profitData?.trustIncome?.toLocaleString() || "0"}
          </td>
        </tr>
        <tr>
        <td style={{ color: "maroon", fontWeight: "bold", textAlign: "left" }}>
            <div>
              <p>TOTAL PROJECTION :</p>
              <p style={{ fontStyle: "italic", fontSize: "small", color: "blue" }}>
                (Without more Savings)
              </p>
            </div>
          </td>
          <td style={{ color: "maroon",  fontWeight: "bold", textAlign: "right" }}>
            {(profitData.totalIncome).toLocaleString()}
          </td>
        </tr>
        <tr>
        <td style={{ color: "maroon", fontWeight: "bold", textAlign: "left" }}>
            <div>
              <p>TOTAL PROJECTION :</p>
              <p style={{ fontStyle: "italic", fontSize: "small", color: "blue" }}>
                (With 2m monthly Savings)
              </p>
            </div>
          </td>
          <td style={{ color: "maroon",  fontWeight: "bold", textAlign: "right" }}>
            {(profitData.totalIncomeWithDeposits).toLocaleString()}
          </td>
        </tr>
        <tr>
          <td style={{ color: "maroon", fontWeight: "bold", textAlign: "left" }}>
            <p>CLUB FUND</p>  
            <p>INCOME PROJECTION</p> 
            </td>
          <td style={{fontWeight: "bold", textAlign: "right" }}>
            <p style={{ color: "blue"}}>{Math.round(profitData.totalIncome * .2).toLocaleString()}</p>
            <p className = "me-3 pe-1" style={{ color: "maroon"}}>OR</p>
            <p style={{ color: "green"}}>{Math.round(profitData.totalIncomeWithDeposits * .2).toLocaleString()}</p>
          </td>
        </tr>
      </tbody>
    </table>
          <div className="table-container mt-2">
            <h5 className='mt-3 mb-2'>Earnings By Year</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Earnings</th>
                <th>Club Fund Income</th>
                {/*<th>ROI</th>*/}
              </tr>
            </thead>
            <tbody>
              {profitData?.clubEarningsRecords.map((record: number[], index: React.Key | null | undefined) => (
                <tr key={index}>
                  <td>{record[0]}</td>
                  <td>{Math.round(record[1] / 0.8).toLocaleString()}</td>
                  <td>{Math.round(record[1] * .25).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
    </div>
  );
};

export default Profits;
