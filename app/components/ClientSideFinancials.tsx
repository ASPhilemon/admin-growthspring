"use client";

import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [showMonthFilters, setShowMonthFilters] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState<Records>({});

  const toggleMonthFilters = () => setShowMonthFilters(!showMonthFilters);

  // Default to the current month
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
    setStartMonth(currentMonth);
    setEndMonth(currentMonth);
    setFilteredRecords(filterRecordsByMonthRange(records, currentMonth, currentMonth));
  }, [records]);

  const filterRecordsByMonthRange = (records: Records, startMonth: string, endMonth: string) => {
    const months = Object.keys(records);
    const startIndex = months.indexOf(startMonth);
    const endIndex = months.indexOf(endMonth);

    if (startIndex === -1 && endIndex === -1) return {}; // No matching months

    const start = startIndex !== -1 ? startIndex : 0;
    const end = endIndex !== -1 ? endIndex : months.length - 1;

    const filteredKeys = months.slice(Math.min(start, end), Math.max(start, end) + 1);
    return Object.fromEntries(filteredKeys.map((key) => [key, records[key]]));
  };
  

  const handleMonthChange = (isStart: boolean, value: string) => {
    const [year, month] = value.split("-");
    const formattedMonth = `${new Date(`${year}-${month}`).toLocaleString("default", { month: "long", year: "numeric" })}`;

    if (isStart) {
      setStartMonth(formattedMonth);
    } else {
      setEndMonth(formattedMonth);
    }
  };

  const handleApplyFilters = () => {
    if (new Date(startMonth) < new Date(endMonth)) {
      const holderMonth = endMonth;
      setEndMonth(startMonth); // Swap if start > end
      setStartMonth(holderMonth);
    }
    const updatedRecords = filterRecordsByMonthRange(records, startMonth, endMonth);
    setFilteredRecords(updatedRecords);
    toggleMonthFilters();
  };

  const handleDownload = (format: string) => {
    if (format === "excel") {
      exportToExcel(filteredRecords);
    } else if (format === "pdf") {
      exportToPDF(filteredRecords);
    }
    toggleMonthFilters();
  };
  const exportToExcel = (filteredRecords: Records) => {
    const wb = XLSX.utils.book_new();
    Object.entries(filteredRecords).forEach(([month, data]) => {
      let totalInflow = 0;
      let totalOutflow = 0;
      let totalDeposits = 0;
      let totalLoans = 0;
      let totalLoanPayments = 0;
  
      // Calculate totals
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
  
      // Prepare worksheet data
      const wsData = [
        [`Total Inflow: ${totalInflow.toLocaleString()}`, `Total Outflow: ${totalOutflow.toLocaleString()}`],
        [`Total Deposits: ${totalDeposits.toLocaleString()}`, `Total Loans: ${totalLoans.toLocaleString()}`, `Total Loan Payments: ${totalLoanPayments.toLocaleString()}`],
        [],
        ["Date", "Type", "Amount", "Source/Destination"],
        ...data.records.map(record => [
          new Date(record.date).toLocaleDateString(),
          record.type,
          record.amount.toLocaleString(),
          record.destination || record.source,
        ]),
      ];
  
      // Convert data to a worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
  
      // Adjust column widths
      ws['!cols'] = [{ wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 200 }];
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, month);
    });
  
    // Save the workbook
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
  
      // Calculate totals
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
  
      // Add a new page for each month's data
      if (index > 0) doc.addPage();
  
      // Month title with larger font
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`Month: ${month}`, 10, 10);
  
      // Add totals with smaller font
      doc.setFontSize(14);
      doc.text(`Total Inflow: ${totalInflow.toLocaleString()}`, 10, 20);
      doc.text(`Total Outflow: ${totalOutflow.toLocaleString()}`, 10, 30);
      doc.text(`Total Deposits: ${totalDeposits.toLocaleString()}`, 10, 40);
      doc.text(`Total Loans: ${totalLoans.toLocaleString()}`, 10, 50);
      doc.text(`Total Loan Payments: ${totalLoanPayments.toLocaleString()}`, 10, 60);
  
      // Add table for records
      doc.autoTable({
        startY: 70,
        head: [["Date", "Type", "Amount", "Source/Destination"]],
        body: data.records.map(record => [
          new Date(record.date).toLocaleDateString(),
          record.type,
          record.amount.toLocaleString(),
          record.destination || record.source,
        ]),
      });
    });
  
    // Save the PDF
    doc.save('financial_records.pdf');
  };

      // Helper function to format month to YYYY-MM
    const formatMonthForInput = (month: string) => {
      const [monthName, year] = month.split(" ");
      const monthIndex = new Date(`${monthName} 1, 2020`).getMonth(); // Get month index from month name
      return `${year}-${(monthIndex + 1).toString().padStart(2, "0")}`; // Format as YYYY-MM
    };

  return (
    <div className="overflow-auto" style={{maxHeight: '90vh'  }}>
      {/* Button to toggle month filters */}
      <div className="fixed-top">
        <button onClick={toggleMonthFilters} className="btn" style={{color: 'white', backgroundColor : showMonthFilters ? 'green' : 'teal'}}>
          {showMonthFilters ? "Hide Month Filters" : "Show Month Filters"}
        </button>
      </div>

      {/* Month filters */}
      {showMonthFilters && (
        <div className="p-3 bg-light sticky-top">
          <div className="d-flex align-items-center mb-2">
            <h6 className="me-2">Start Month:</h6>
            <input
              type="month"
              value={startMonth ? formatMonthForInput(startMonth) : ""}
              onChange={(e) => handleMonthChange(true, e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center mb-2">
            <h6 className="me-2">End Month:</h6>
            <input
              type="month"
              value={endMonth ? formatMonthForInput(endMonth) : ""}
              onChange={(e) => handleMonthChange(false, e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary me-2" onClick={handleApplyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-success me-2" onClick={() => handleDownload("excel")}>
              Download Excel
            </button>
            <button className="btn btn-danger" onClick={() => handleDownload("pdf")}>
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Render filtered records */}
      {Object.entries(filteredRecords).map(([month, data]) => (
        <div className="month-container mx-3" key={month}>
          <div className="month-summary mx-3">
            <h5>{month}</h5>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Total Inflow:</td>
                  <td style={{ color: "green", textAlign: "right" }}>{data.totalInflow.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Total Outflow/Loans:</td>
                  <td style={{ color: "red", textAlign: "right" }}>{data.totalOutflow.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Total Loan Payments:</td>
                  <td style={{ color: "gold", textAlign: "right" }}>{data.totalLoanPayments.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Total Deposits:</td>
                  <td style={{ color: "blue", textAlign: "right" }}>{data.totalDeposits.toLocaleString()}</td>
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
                    <td
                      className={
                        record.type === "Loan Payment" || record.type === "Deposit" ? "inflow" : "outflow"
                      }
                    >
                      {record.type}
                    </td>
                    <td>{record.name}</td>
                    <td
                      className={
                        record.type === "Loan Payment" || record.type === "Deposit" ? "inflow" : "outflow"
                      }
                    >
                      {record.amount.toLocaleString()}</td>
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
