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

interface YearData {
  totalInflow: number;
  totalOutflow: number;
  balance: Number,
  records: Record[];
}

interface Records {
  [year: string]: YearData;
}

export default function ClubFinancials({ records }: { records: Records }) {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [showYearFilters, setShowYearFilters] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState<Records>({});
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [message, setMessage] = useState({ type: "", text: "" }); // Store success/error message


  const [formData, setFormData] = useState({
    transaction_type: "Expense", 
    name: "",
    amount: "",
    reason: "",
    date: ""
  });
  

const handleFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;

  if (name === "transaction_type") {
    setFormData({
      ...formData,
      transaction_type: value,
      name: "",
      amount: "",
      reason: "",
      date: ""
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setMessage({ type: "", text: "" }); // Reset message
  setLoading(true); // Show loading state

  if (!formData.name || !formData.amount || !formData.reason || !formData.date) {
    setMessage({ type: "error", text: "Please fill all the fields." });
    setLoading(false);
    return;
}

  const payload = {
      transaction_type: formData.transaction_type,
      name: formData.name,
      amount: formData.amount,
      reason: formData.reason,
      date: formData.date,
  };


  try {
      const res = await fetch("/api/transactions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });

      setShowTransactionForm(false);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Failed to save the transaction.");
    }

    setMessage({ type: "success", text: "Transaction successfully recorded!" });
    setFormData({
      transaction_type: "Expense",
      name: "",
      amount: "",
      reason: "",
      date: "",
  });
    
  setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3s
       
  } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while saving the transaction.");
  } finally {
    setLoading(false); // Hide loading state
}
};

  const toggleYearFilters = () => setShowYearFilters(!showYearFilters);

  // Initialize with the most recent year
  useEffect(() => {
    const years = Object.keys(records);
    const number = years.length - 1;
    const firstYear = years[number];
    setStartYear(firstYear);
    setEndYear(firstYear);
    setFilteredRecords(filterRecordsByYearRange(records, firstYear, firstYear));
  }, [records]);

const filterRecordsByYearRange = (records: Records, startYear: string, endYear: string) => {
  const sortedYears = Object.keys(records)
    .map(Number) // Convert year keys to numbers
    .sort((a, b) => b - a); // Sort in descending order (latest year first)

  const startIndex = sortedYears.indexOf(Number(startYear));
  const endIndex = sortedYears.indexOf(Number(endYear));

  if (startIndex === -1 || endIndex === -1) return {}; // Return empty object if invalid range

  const start = Math.min(startIndex, endIndex);
  const end = Math.max(startIndex, endIndex);

  const filteredEntries = sortedYears.slice(start, end + 1).map((year) => [year.toString(), records[year.toString()]]);

  // Ensure the final object is sorted correctly
  return Object.fromEntries(filteredEntries.sort(([a], [b]) => Number(b) - Number(a)));
};

  const handleYearChange = (isStart: boolean, value: string) => {
    isStart ? setStartYear(value) : setEndYear(value);
  };

  const handleApplyFilters = () => {
    if (parseInt(startYear) < parseInt(endYear)) [setStartYear(endYear), setEndYear(startYear)];
    setFilteredRecords(filterRecordsByYearRange(records, startYear, endYear));
    console.log(filteredRecords)
    toggleYearFilters();
  };

  const handleDownload = (format: string) => {
    // Apply filters first
    const updatedRecords = filterRecordsByYearRange(records, startYear, endYear);
    setFilteredRecords(updatedRecords);
  
    // Then proceed with download
    if (format === "excel") {
      exportToExcel(updatedRecords);
    } else {
      exportToPDF(updatedRecords);
    }
  };
  

  const exportToExcel = (filteredRecords: Records) => {
    const wb = XLSX.utils.book_new();

    Object.entries(filteredRecords).forEach(([year, data]) => {
      const totalInflow = data.records.filter((rec) => rec.type === "Income").reduce((sum, rec) => sum + rec.amount, 0);
      const totalOutflow = data.records.filter((rec) => rec.type === "Expense").reduce((sum, rec) => sum + rec.amount, 0);

      const wsData = [
        [`Total Inflow: ${totalInflow.toLocaleString()}`, `Total Outflow: ${totalOutflow.toLocaleString()}`, `ACCOUNT BALANCE: ${data.balance.toLocaleString()}`],
        [],
        ["Date", "Type", "Amount", "Source/Destination"],
        ...data.records.map((record) => [
          new Date(record.date).toLocaleDateString(),
          record.type,
          record.amount.toLocaleString(),
          record.destination || record.source,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [{ wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 200 }];
      XLSX.utils.book_append_sheet(wb, ws, year);
    });

    XLSX.writeFile(wb, "financial_records.xlsx");
  };

  const exportToPDF = (filteredRecords: Records) => {
    const doc = new jsPDF();

    Object.entries(filteredRecords).forEach(([year, data], index) => {
      if (index > 0) doc.addPage();

      const totalInflow = data.records.filter((rec) => rec.type === "Income").reduce((sum, rec) => sum + rec.amount, 0);
      const totalOutflow = data.records.filter((rec) => rec.type === "Expense").reduce((sum, rec) => sum + rec.amount, 0);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`Year: ${year}`, 10, 10);

      doc.setFontSize(14);
      doc.text(`Total Inflow: ${totalInflow.toLocaleString()}`, 10, 20);
      doc.text(`Total Outflow: ${totalOutflow.toLocaleString()}`, 10, 30);
      doc.text(`ACCOUNT BALANCE: ${data.balance.toLocaleString()}`, 10, 40);
//console.log(filteredRecords)
      doc.autoTable({
        startY: 60,
        head: [["Date", "Type", "Amount", "Source/Destination"]],
        body: data.records.map((record) => [
          new Date(record.date).toLocaleDateString(),
          record.type,
          record.amount.toLocaleString(),
          record.destination || record.source,
        ]),
      });
    });

    doc.save("financial_records.pdf");
  };

  return (
    <div className="overflow-auto" style={{ maxHeight: "90vh" }}>
      <div className="fixed-top d-flex justify-content-between" style={{width: "100%"}}>
        <button
          onClick={toggleYearFilters}
          className="btn"
          style={{ color: "white", backgroundColor: showYearFilters ? "green" : "teal" }}
        >
          {showYearFilters ? "Hide Year Filters" : "Show Year Filters"}
        </button>
        
        <button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            className="btn ms-2"
            style={{ color: "white", backgroundColor: showTransactionForm ? "darkred" : "darkblue" }}
          >
            {showTransactionForm ? "Close Form" : "Add Item"}
          </button>
      </div>

      {showTransactionForm && (
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
    <form 
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside form
      onSubmit={handleSubmit} 
      className="p-3 bg-light rounded" 
      style={{ width: "400px" }}
    >
      <div className="d-flex justify-content-between">
      <h5 className="mb-2">Add Transaction</h5>
      <p onClick={() => setShowTransactionForm(false)} style={{color:"blue", cursor: "pointer"}}>Close</p>
      </div>
      
      <hr className="mb-2"/>

      <div className="mb-2">
        <label>Type of Transaction:</label>
        <select 
          name="transaction_type"
          className="form-control mb-3"
          value={formData.transaction_type} 
          onChange={handleFormInputChange} 
          required
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
      </div>

      <div className="mb-2">
        <label>{formData.transaction_type} Name:</label>
        <input
          type="text"
          name="name"
          className="form-control mb-3"
          value={formData.name}
          onChange={handleFormInputChange}
          required
        />
      </div>

      <div className="mb-2">
        <label>{formData.transaction_type} Reason:</label>
        <input
          type="text"
          name="reason"
          className="form-control mb-3"
          value={formData.reason}
          onChange={handleFormInputChange}
          required
        />
      </div>

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
        <label>Date of {formData.transaction_type}:</label>
        <input
          type="date"
          name="date"
          className="form-control mb-3"
          value={formData.date}
          onChange={handleFormInputChange}
          required
        />
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


      {showYearFilters && (
        <div className="p-3 bg-light sticky-top">
          <div className="d-flex align-items-center mb-2">
            <h6 className="me-2">Start Year:</h6>
            <input
              type="number"
              value={startYear}
              onChange={(e) => handleYearChange(true, e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="d-flex align-items-center mb-2">
            <h6 className="me-2">End Year:</h6>
            <input
              type="number"
              value={endYear}
              onChange={(e) => handleYearChange(false, e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary me-2" onClick={handleApplyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-success me-2"   onClick={() => {
              handleApplyFilters();
              handleDownload("excel");
            }}>
              Download Excel
            </button>
            <button className="btn btn-danger"   
            onClick={() => {
              handleApplyFilters();
              handleDownload("pdf");
            }}>
              Download PDF
            </button>
          </div>
        </div>
      )}

      {Object.entries(filteredRecords).map(([year, data]) => (
        <div className="year-container mx-3" key={year}>
          <h4 className="mx-3 mt-2">{year}</h4> 
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Total Inflows:</td>
                <td style={{ color: "green", textAlign: "right" }}>
                {data.totalInflow.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Total Outflows:</td>
                <td style={{ color: "blue", textAlign: "right" }}>
                {data.totalOutflow.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td style={{ color: "maroon", fontWeight: "bold", textAlign: "center" }}>ACCOUNT BALANCE:</td>
                <td style={{ color: "maroon",  fontWeight: "bold", textAlign: "left" }}>
                  {(data.balance).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="table-container mt-2">
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
                  <td>{record.type}</td>
                  <td>{record.name}</td>
                  <td>{record.amount.toLocaleString()}</td>
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
