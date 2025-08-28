// src/MissingData.jsx
import { Link } from "react-router-dom";

function MissingData({ data }) {
  // Filter rows where services is null OR unit_occupied/HSP is null or false
  const missingRows = data.filter(
    d =>
      d.services === null ||
      d.unit_occupied !== true ||
      d.HSP !== true
  );

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Rows with Missing or False Values</h1>
      <Link to="/">← Back to Dashboard</Link>

      <table style={{ marginTop: "16px", borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>First Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Last Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Notes</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Services</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Unit Occupied</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>HSP</th>
          </tr>
        </thead>
        <tbody>
          {missingRows.map(row => (
            <tr key={row.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.id}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.first_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.last_name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{row.notes ?? ""}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", color: row.services === null ? "red" : "black" }}>
                {row.services ?? "Missing"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", color: row.unit_occupied !== true ? "red" : "black" }}>
                {row.unit_occupied ? "True" : "False/Missing"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", color: row.HSP !== true ? "red" : "black" }}>
                {row.HSP ? "True" : "False/Missing"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MissingData;
