"use client";

import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Record {
  amount: number;
  date: string | Date;
  destination: string;
  balance: number;
  recorder: string;
  source: string;
}

interface MonthlyRecords {
  [month: string]: {
    records: Record[];
  };
}

interface CashTransactionsProps {
  records: {
    groupedRecords: MonthlyRecords;
    clubWorth: number;
    profitsSoFar: number;
    cashLocation: { name: string; amount: number }[];
    moneyInLoans: number;
  };
}

export default function CashTransactions({ records }: CashTransactionsProps) {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [showMonthFilters, setShowMonthFilters] = useState(false);
  const [closed, setAction] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState<MonthlyRecords>({});
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    destination: "",
    date: "",
    movedBy: "",
  });

  const authorizedPeople = ["Mwebe Blaise Adrian", "Omodo Joshua Deo", "Kawuma Andrew"]; // Replace with actual names

  const cashLocations = records.cashLocation.map((loc) => loc.name);

  const handleFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage({ type: "", text: "" }); // Reset message
    setLoading(true); // Show loading state

    if (!formData.amount || !formData.source || !formData.destination || !formData.date || !formData.movedBy) {
      setMessage({ type: "error", text: "Please fill all the fields." });
      setLoading(false);
      return;
    }

    const API = "https://api.growthspringers.com";

    const payload = {
        amount: Number(formData.amount), // Ensure amount is a number
        source: formData.source,
        destination: formData.destination,
        movedBy: formData.movedBy,
        date: formData.date
    };

    console.log("Payload being sent:", JSON.stringify(payload));

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

        setShowTransferForm(false);
        const responseText = await res.text(); // Get response as text (not JSON in case of errors)
    console.log("Server response:", responseText);

    if (!res.ok) {
        console.error(`Error ${res.status}: ${responseText}`);
    }
  
      setMessage({ type: "success", text: "Transfer successfully recorded!" });

        setFormData({
            amount: "",
            source: "",
            destination: "",
            date: "",
            movedBy: "",
        });

        setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3s
      } catch (err) {
          console.error("Error:", err);
          setMessage({ type: "error", text: "An error occurred while saving the transaction." });
      } finally {
          setLoading(false); // Hide loading state
      }
};


// Default to the first month
  useEffect(() => {
    if (records?.groupedRecords) {
      const months = Object.keys(records.groupedRecords);
      if (months.length > 0) {
        const firstMonth = months[0]; // Get the first available month
        setStartMonth(firstMonth);
        setEndMonth(firstMonth);
        filterRecordsByMonthRange(firstMonth, firstMonth); // Filter by the first month
      }
    }
  }, [records]);
  
  

  const toggleMonthFilters = () => setShowMonthFilters(!showMonthFilters);
  const toggleAction = () => setAction(!closed);

  const handleDownload = (format: string) => {
    if (format === "excel") {
      exportToExcel(filteredRecords);
    } else if (format === "pdf") {
      exportToPDF(filteredRecords);
    }
    toggleMonthFilters();
  };

  const filterRecordsByMonthRange = (start: string, end: string) => {
    const months = Object.keys(records.groupedRecords);
    const startIndex = months.findIndex((month) => month === start);
    const endIndex = months.findIndex((month) => month === end);
  
    if (startIndex === -1 || endIndex === -1) return;
  
    const filteredKeys = months.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );
    setFilteredRecords(
      Object.fromEntries(filteredKeys.map((key) => [key, records.groupedRecords[key]]))
    );
  };
  
  
const handleMonthChange = (isStart: boolean, value: string) => {
  const [year, month] = value.split("-");
  const formattedMonth = new Date(`${year}-${month}-01`).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (isStart) setStartMonth(formattedMonth);
  else setEndMonth(formattedMonth);
};

      // Helper function to format month to YYYY-MM
      const formatMonthForInput = (month: string) => {
        const [monthName, year] = month.split(" ");
        const monthIndex = new Date(`${monthName} 1, 2020`).getMonth(); // Get month index from month name
        return `${year}-${(monthIndex + 1).toString().padStart(2, "0")}`; // Format as YYYY-MM
      };

  const handleApplyFilters = () => {
    if (startMonth && endMonth) filterRecordsByMonthRange(startMonth, endMonth);
    toggleMonthFilters();
  };

  const exportToExcel = (filteredRecords: MonthlyRecords) => {
    const wb = XLSX.utils.book_new();
    Object.entries(filteredRecords).forEach(([month, data]) => {
      const wsData = [
        [`UAP: ${records.cashLocation.find(
        (location) => location.name === "Unit Trusts"
      )?.amount.toLocaleString() || 0}`, `Standard Chartered: ${records.cashLocation.find(
        (location) => location.name === "Standard Chartered"
      )?.amount.toLocaleString() || 0}`],
        [`Mobile Money: ${records.cashLocation.find(
        (location) => location.name === "Mobile Money"
      )?.amount.toLocaleString() || 0}`, `Loans: ${records.moneyInLoans.toLocaleString()}`],
        [],
        ["Date", "Amount", "From", "To", "Balance in Source", "Moved By"],
        ...data.records.map((record) => [
            new Date(record.date).toLocaleDateString(),
            record.amount,
            record.source,
            record.destination,
            record.balance,
            record.recorder,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, month);
    });
    XLSX.writeFile(wb, "cash_transactions.xlsx");
  };

  const exportToPDF = (filteredRecords: MonthlyRecords) => {
    const doc = new jsPDF();
    Object.entries(filteredRecords).forEach(([month, data], index) => {
      if (index > 0) doc.addPage();
      
      // Month title with larger font
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`Month: ${month}`, 10, 20);
  
      // Add totals with smaller font
      doc.setFontSize(14);
      doc.text(`LOCATION BALANCES:`, 10, 30);

      doc.setFontSize(14);
      doc.text(`UAP: ${records.cashLocation.find(
        (location) => location.name === "Unit Trusts"
      )?.amount.toLocaleString() || 0}`, 10, 40);
      doc.text(`Standard Chartered: ${records.cashLocation.find(
        (location) => location.name === "Standard Chartered"
      )?.amount.toLocaleString() || 0}`, 10, 50);
      doc.text(`Mobile Money: ${records.cashLocation.find(
        (location) => location.name === "Mobile Money"
      )?.amount.toLocaleString() || 0}`, 10, 60);
      doc.text(`Loans: ${records.moneyInLoans.toLocaleString()}`, 10, 70);

      doc.autoTable({
        startY: 80,
        head: [["Date", "Amount", "From", "To", "Balance in Source", "Moved By"]],
        body: data.records.map((record) => [
          new Date(record.date).toLocaleDateString(),
          record.amount,
          record.source,
          record.destination,
          record.balance,
          record.recorder,
        ]),
      });
    });
    doc.save("cash_transactions.pdf");
  };
 const UAP = records.cashLocation.find(
    (location) => location.name === "Unit Trusts"
  )?.amount || 0;

 const mobileMoney = records.cashLocation.find(
    (location) => location.name === "Mobile Money"
  )?.amount || 0;

 const bank = records.cashLocation.find(
    (location) => location.name === "Standard Chartered"
  )?.amount || 0;

  return (
    <div>
      {/* Button to toggle month filters */}
      <div className="fixed-top d-flex justify-content-between" style={{width: "100%"}}>
        <button onClick={toggleMonthFilters} className="btn" style={{color: 'white', backgroundColor : showMonthFilters ? 'teal' : 'green'}}>
          {showMonthFilters ? "Hide Month Filters" : "Show Month Filters"}
        </button>
        
        <button
            onClick={() => setShowTransferForm(!showTransferForm)}
            className="btn ms-2"
            style={{ color: "white", backgroundColor: showTransferForm ? "darkred" : "darkblue" }}
          >
            {showTransferForm ? "Close Transfer Form" : "Add Transfer"}
          </button>
      </div>
  

      {showTransferForm && (
        <div 
        className="overlay" 
        style={{
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
          backdropFilter: "blur(5px)", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          zIndex: 1000
        }}
        >
        <form onSubmit={handleSubmit} className="p-3 mt-3 bg-light rounded" style={{ width: "400px" }}>
      <div className="d-flex justify-content-between">
      <h5 className="mb-2">Add Cash Transfer</h5>
      <p onClick={() => setShowTransferForm(false)} style={{color:"blue", cursor: "pointer"}}>Close</p>
      </div>
          
          <hr className="mb-2"/>
          <div className="mb-2">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              className="form-control mb-3"
              value={formData.amount}
              onChange={handleFormInputChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Source:</label>
            <select name="source" className="form-control mb-3" value={formData.source} onChange={handleFormInputChange} required>
              <option value="">Select Source</option>
              {cashLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label>Destination:</label>
            <select name="destination" className="form-control mb-3" value={formData.destination} onChange={handleFormInputChange} required>
              <option value="">Select Destination</option>
              {cashLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              className="form-control mb-3"
              value={formData.date}
              onChange={handleFormInputChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Moved By:</label>
            <select name="movedBy" className="form-control mb-3" value={formData.movedBy} onChange={handleFormInputChange} required>
              <option value="">Select Mover</option>
              {authorizedPeople.map((person, index) => (
                <option key={index} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>
          {/* Loading Spinner */}
          {loading && (
                        <div className="text-center text-blue-500 font-semibold mt-2">
                            Transaction being added...
                        </div>
                    )}

                    {/* Success/Error Message */}
                    {message.text && (
                        <div
                            className={`mt-2 p-2 text-center text-white rounded ${
                                message.type === "success" ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

          <button type="submit" className="btn btn-success mt-2 mb-3">
            Submit
          </button>
        </form>
        </div>
      )}

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
    
    <details className="px-3" open>
    <summary className="btn btn-md fw-bold mb-3"  onClick={toggleAction} style={{backgroundColor: 'white', width: '100%', color: 'gold', borderColor: 'grey'}}>
            Cash Locations <span className="ms-3" style={{color: "blue"}}>(Click to {!closed? "Close": "Open"})</span> 
    </summary>

    <div className="m-3">
        <h5>Money Under Custody: </h5>
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Club Savings:</td>
                <td style={{ color: "green", textAlign: "right" }}>
                  {records.clubWorth.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Profit Received So Far:</td>
                <td style={{ color: "blue", textAlign: "right" }}>
                  {records.profitsSoFar.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style={{ color: "maroon", fontWeight: "bold", textAlign: "center" }}>TOTAL:</td>
                <td style={{ color: "maroon",  fontWeight: "bold", textAlign: "left" }}>
                  {(records.profitsSoFar + records.clubWorth).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <hr className="mx-3" />

          <div className="month-summary my-3">
            <h5>Location Balances</h5>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>UAP:</td>
                  <td style={{ color: "green", textAlign: "right" }}>
                    {UAP.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Standard Chartered:</td>
                  <td style={{ color: "blue", textAlign: "right" }}>
                    {bank.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Mobile Money:</td>
                  <td style={{ color: "gold", textAlign: "right" }}>
                    {mobileMoney.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Loans:</td>
                  <td style={{ color: "red", textAlign: "right" }}>
                    {records.moneyInLoans.toLocaleString()}
                  </td>
                </tr>
              <tr>
                <td style={{ color: "maroon", fontWeight: "bold", textAlign: "center" }}>TOTAL:</td>
                <td style={{ color: "maroon",  fontWeight: "bold", textAlign: "left" }}>
                  {(records.moneyInLoans + mobileMoney + bank + UAP).toLocaleString()}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <hr className="mx-3" style={{marginBottom: "30vh"}}/>
          </div> 

          </details>

      {Object.entries(filteredRecords).map(([month, data]) => (
        <div className="month-container mx-3 overflow-auto" key={month} style={{maxHeight: '90vh'}}> 
          <h6 className="my-2 m-3 fw-bold" style={{color: 'blue'}}>{month} Cash Transfers</h6>
          <div className="table-container" >
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Moved By</th>
                </tr>
              </thead>
              <tbody>
                {data.records.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{Math.round(record.amount).toLocaleString()}</td>
                    <td>{record.source}</td>
                    <td>{record.destination}</td>
                    <td>{record.recorder}</td>
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
