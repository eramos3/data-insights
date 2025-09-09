import { useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autoTable";
import './App.css';

export default function MissingData({ data }) {
  const [selectedStaff, setSelectedStaff] = useState("");

  // Rows with missing/false values
  const missingRows = data.filter(
    d =>
      d.services === null ||
      d.unit_occupied !== true ||
      d.HSP !== true ||
      d.id_card !== true ||
      d.ss_card !== true
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

  const doc = new jsPDF({ orientation: "landscape" });

  // Define columns
  const columns = [
    { header: "ID", dataKey: "id" },
    { header: "First Name", dataKey: "first_name" },
    { header: "Last Name", dataKey: "last_name" },
    { header: "Notes", dataKey: "notes" },
    { header: "Services", dataKey: "services" },
    { header: "Unit Occupied", dataKey: "unit_occupied" },
    { header: "HSP", dataKey: "HSP" },
    { header: "ID Card", dataKey: "id_card" },
    { header: "SSC", dataKey: "ss_card" },
    { header: "Staff", dataKey: "staff" }
  ];

  // Map data rows, ensuring no nulls
  const rows = filteredRows.map(row => ({
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    notes: row.notes ?? "",
    services: row.services ?? "Missing",
    unit_occupied: row.unit_occupied === true ? "True" : "False/Missing",
    HSP: row.HSP === true ? "True" : "False/Missing",
    id_card: row.id_card === true ? "True" : "False/Missing",
    ss_card: row.ss_card === true ? "True" : "False/Missing",
    staff: row.staff
  }));

  doc.text("Missing/False Data", 14, 15);

  autoTable(doc, {
    columns,
    body: rows,
    startY: 20,
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    styles: { fontSize: 8 },
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
          <button onClick={exportPDF} className="link-button">Export to PDF</button>
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
              <th>ID Card</th>
              <th>SSC</th>
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
                <td className={row.id_card !== true ? "missing" : ""}>
                  {row.id_card ? "True" : "False/Missing"}
                </td>
                <td className={row.ss_card !== true ? "missing" : ""}>
                  {row.ss_card ? "True" : "False/Missing"}
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
