import { useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './App.css';

export default function MissingData({ data }) {
  const [selectedStaff, setSelectedStaff] = useState("");

  // Rows with missing/false values
  const missingRows = data.filter(
    d =>
      d.services === null ||
      d.unit_occupied !== true ||
      d.HSP !== true
  );

  // Apply staff filter
  const filteredRows = selectedStaff
    ? missingRows.filter(row => row.staff === selectedStaff)
    : missingRows;

  // Unique staff names for dropdown
  const staffList = Array.from(new Set(missingRows.map(row => row.staff)));

  // Export to Excel
  const exportExcel = () => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MissingData");
    XLSX.writeFile(wb, "MissingData.xlsx");
  };

  // Export to PDF
  const exportPDF = () => {
    if (!filteredRows || filteredRows.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["ID","First Name","Last Name","Notes","Services","Unit Occupied","HSP","Staff"];
    const tableRows = filteredRows.map(row => [
      row.id,
      row.first_name,
      row.last_name,
      row.notes ?? "",
      row.services ?? "Missing",
      row.unit_occupied === true ? "True" : "False/Missing",
      row.HSP === true ? "True" : "False/Missing",
      row.staff
    ]);

    doc.text("Missing/False Data", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] } // optional styling
    });

    doc.save("MissingData.pdf");
  };

  return (
    <div className="container">
      <h1 className="header">Rows with Missing or False Values</h1>
      <Link to="/" className="link-button">← Back to Dashboard</Link>

      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <label>
          Filter by Staff:{" "}
          <select
            value={selectedStaff}
            onChange={e => setSelectedStaff(e.target.value)}
            className="input"
          >
            <option value="">All</option>
            {staffList.map(staff => (
              <option key={staff} value={staff}>{staff}</option>
            ))}
          </select>
        </label>

        <div style={{ marginTop: "8px" }}>
          <button onClick={exportExcel} className="link-button" style={{ marginRight: "8px" }}>
            Export to Excel
          </button>
          <button onClick={exportPDF} className="link-button">
            Export to PDF
          </button>
        </div>
      </div>

      <div className="card chart-card" style={{ padding: "16px" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Notes</th>
              <th>Services</th>
              <th>Unit Occupied</th>
              <th>HSP</th>
              <th>Staff</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
                <td>{row.notes ?? ""}</td>
                <td className={row.services === null ? "missing" : ""}>
                  {row.services ?? "Missing"}
                </td>
                <td className={row.unit_occupied !== true ? "missing" : ""}>
                  {row.unit_occupied ? "True" : "False/Missing"}
                </td>
                <td className={row.HSP !== true ? "missing" : ""}>
                  {row.HSP ? "True" : "False/Missing"}
                </td>
                <td>{row.staff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
