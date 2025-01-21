"use client";

import { useState } from "react";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Record {
  date: string | number | Date;
  type: string;
  name: string;
  amount: number;
  destination?: string;
  source?: string;
}

interface MonthData {
  totalInflow: number;
  totalOutflow: number;
  totalLoanPayments: number;
  totalDeposits: number;
  records: Record[];
}

interface Records {
  [month: string]: MonthData;
}


export default function ClientSideFinancials({ records }: { records: Records }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');  
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleDownload = (format: string) => {
    const filteredRecords = filterRecordsByDate(records, startDate, endDate);
    if (format === 'excel') {
      exportToExcel(filteredRecords);
    } else if (format === 'pdf') {
      exportToPDF(filteredRecords);
    }
  };

  const filterRecordsByDate = (records: Records, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Object.fromEntries(
      Object.entries(records).filter(([month, data]) => {
        return data.records.some(record => {
          const recordDate = new Date(record.date);
          return recordDate >= start && recordDate <= end;
        });
      })
    );
  };
  const exportToExcel = (filteredRecords: Records) => {
    const wb = XLSX.utils.book_new();
    Object.entries(filteredRecords).forEach(([month, data]) => {
      let totalInflow = 0;
      let totalOutflow = 0;
      let totalDeposits = 0;
      let totalLoans = 0;
      let totalLoanPayments = 0;
  
      data.records.forEach(record => {
        if ('isOutflow' in record && record.isOutflow) {
          totalOutflow += record.amount;
        } else {
          totalInflow += record.amount;
        }
        if (record.type === 'Loan Payment') {
          totalLoanPayments += record.amount;
        } else if (record.type === 'Loan') {
          totalLoans += record.amount;
        } else if (record.type === 'Deposit') {
          totalDeposits += record.amount;
        }
      });
  
      const wsData = [
        [`Total Inflow: ${totalInflow.toLocaleString()}`, `Total Outflow: ${totalOutflow.toLocaleString()}`],
        [`Total Deposits: ${totalDeposits.toLocaleString()}`, `Total Loans: ${totalLoans.toLocaleString()}`, `Total Loan Payments: ${totalLoanPayments.toLocaleString()}`],
        [],
        ["Date", "Type", "Amount", "Source/Destination"],
        ...data.records.map(record => [
          new Date(record.date).toLocaleDateString(),
          record.type,
          record.amount.toLocaleString(),
          record.destination || record.source
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      // Adjust column widths
      ws['!cols'] = [{ wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 200 }];

      XLSX.utils.book_append_sheet(wb, ws, month);
    });
    XLSX.writeFile(wb, 'financial_records.xlsx');
  };
  
  const exportToPDF = (filteredRecords: Records) => {
    const doc = new jsPDF();
    Object.entries(filteredRecords).forEach(([month, data], index) => {
      let totalInflow = 0;
      let totalOutflow = 0;
      let totalDeposits = 0;
      let totalLoans = 0;
      let totalLoanPayments = 0;
  
      data.records.forEach(record => {
        if ('isOutflow' in record && record.isOutflow) {
          totalOutflow += record.amount;
        } else {
          totalInflow += record.amount;
        }
        if (record.type === 'Loan Payment') {
          totalLoanPayments += record.amount;
        } else if (record.type === 'Loan') {
          totalLoans += record.amount;
        } else if (record.type === 'Deposit') {
          totalDeposits += record.amount;
        }
      });
  
      if (index > 0) doc.addPage();
      // Larger font for the month
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`Month: ${month}`, 10, 10);

      // Reset font size for the totals
      doc.setFontSize(14);
      doc.text(`Total Inflow: ${totalInflow.toLocaleString()}`, 10, 20);
      doc.text(`Total Outflow: ${totalOutflow.toLocaleString()}`, 10, 30);
      doc.text(`Total Deposits: ${totalDeposits.toLocaleString()}`, 10, 40);
      doc.text(`Total Loans: ${totalLoans.toLocaleString()}`, 10, 50);
      doc.text(`Total Loan Payments: ${totalLoanPayments.toLocaleString()}`, 10, 60);
  
      doc.autoTable({
        startY: 70,
        head: [["Date", "Type", "Amount", "Source/Destination"]],
        body: data.records.map(record => [
          new Date(record.date).toLocaleDateString(),
          record.type,
          record.amount.toLocaleString(),
          record.destination || record.source
        ]),
      });
    });
    doc.save('financial_records.pdf');
  };
    
  return (
    <div>
      {/* Button to toggle filters */}
      <div className="fixed-top">
        <button onClick={toggleFilters} className="btn btn-primary">
          {showFilters ? "Hide Download Filters" : "Show Download Filters"}
        </button>
      </div>
      {/* Filters section */}
      {showFilters && (
        <div className="p-3 bg-light sticky-top">
        <div className = "d-flex">
          <h6 className = "mt-2 me-2"> Start Date:</h6>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className = "d-flex">
          <h6 className = "mt-2 me-2"> End Date:</h6>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="d-flex justify-content-between">
        <button className="btn me-2 btn-success" onClick={() => handleDownload('excel')}>Download Excel</button>
        <button className="btn me-2 btn-danger" onClick={() => handleDownload('pdf')}>Download PDF</button>
        </div>
        </div>
      )}
      {Object.entries(records).map(([month, data]) => (
        <div className="month-container mx-3" key={month}>
<div className="month-summary mx-3">
  <h5>{month}</h5>
  <table className="summary-table">
    <tbody>
      <tr>
        <td>Total Inflow:</td>
        <td style={{color: 'green', textAlign: 'right'}}>{data.totalInflow.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Total Outflow/Loans:</td>
        <td style={{color: 'red', textAlign: 'right'}}>{data.totalOutflow.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Total Loan Payments:</td>
        <td style={{color: 'gold', textAlign: 'right'}}>{data.totalLoanPayments.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Total Deposits:</td>
        <td style={{color: 'blue', textAlign: 'right'}}>{data.totalDeposits.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
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
                    <td className={record.type === 'Loan Payment' || record.type === 'Deposit' ? 'inflow' : 'outflow'}>
                      {record.type}
                    </td>
                    <td>{record.name}</td>
                    <td className={record.type === 'Loan Payment' || record.type === 'Deposit' ? 'inflow' : 'outflow'}>
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
