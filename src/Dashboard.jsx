import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function Dashboard({ data }) {
    const [selectedProgram, setSelectedProgram] = useState("");

  if (!data.length) return <p className="container">Loading data...</p>;

  // Get unique program names for the dropdown
  const programList = Array.from(new Set(data.map(d => d.program_name)));

  // Filter data by selected program (if any)
  const filteredData = selectedProgram
    ? data.filter(d => d.program_name === selectedProgram)
    : data;

    // Recalculate metrics based on filtered data
   const filteredInsights = useMemo(() => {
    return {
      totalRows: filteredData.length,
      countNotes: filteredData.filter(d => !!d.notes).length,
      countServices: filteredData.filter(d => !!d.services).length,
      unitOccupiedTrue: filteredData.filter(d => d.unit_occupied === true).length,
      HSPTrue: filteredData.filter(d => d.HSP === true).length,
      IdTrue: filteredData.filter(d => d.id_card === true).length,
      sscTrue: filteredData.filter(d => d.ss_card === true).length
    };
  }, [filteredData]);

  const chartData = [
    { name: "Notes", value: filteredInsights.countNotes || 0 },
    { name: "Services", value: filteredInsights.countServices || 0 },
    { name: "Units Occupied", value: filteredInsights.unitOccupiedTrue || 0 },
    { name: "HSP", value: filteredInsights.HSPTrue || 0 },
    { name: "ID Card", value: filteredInsights.IdTrue || 0 },
    { name: "SSC", value: filteredInsights.sscTrue || 0 }
  ];

  return (
    <div className="container">
      <h1 className="header">📊 Data Insights Dashboard</h1>

       {/* Program filter dropdown */}
      <div style={{ marginBottom: "16px" }}>
        <label>
          Filter by Program:{" "}
          <select
            value={selectedProgram}
            onChange={e => setSelectedProgram(e.target.value)}
            className="input"
          >
            <option value="">All</option>
            {programList.map(prog => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
        </label>
      </div>
      {filteredData.length === 0 ? (
        <p>No data available for the selected program.</p>
      ) : (
        <>
      <div className="card">
        <h2>Insights {selectedProgram && `(${selectedProgram})`}</h2>
        <p>Total Rows: {filteredInsights.totalRows}</p>
        <p>Notes Count: {filteredInsights.countNotes}</p>
        <p>Services Count: {filteredInsights.countServices}</p>
        <p>Units Occupied: {filteredInsights.unitOccupiedTrue}</p>
        <p>HSP: {filteredInsights.HSPTrue}</p>
        <p>ID Cards: {filteredInsights.IdTrue}</p>
        <p>SSC Card: {filteredInsights.sscTrue}</p>
        <Link to="/missing" className="link-button">
          View rows with missing values →
        </Link>
      </div>

      <div className="card chart-card" style={{ height: "400px" }}>
        <h2>Chart</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </>
      )}
    </div>
  );
}
