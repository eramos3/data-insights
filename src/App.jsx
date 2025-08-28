import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import MissingData from "./MissingData";

function Dashboard({ data, insights }) {
  const chartData = [
    { name: "Notes", value: insights.countNotes || 0 },
    { name: "Services", value: insights.countServices || 0 },
    { name: "Units Occupied", value: insights.unitOccupiedTrue || 0 },
    { name: "HSP", value: insights.HSPTrue || 0 }
  ];

  return (
    <div className="container">
      <h1 className="header">📊 Data Insights Dashboard</h1>

      <div className="card">
        <h2>Insights</h2>
        <p>Total Rows: {insights.totalRows}</p>
        <p>Notes Count: {insights.countNotes}</p>
        <p>Services Count: {insights.countServices}</p>
        <p>Units Occupied: {insights.unitOccupiedTrue}</p>
        <p>HSP: {insights.HSPTrue}</p>
        <Link to="/missing" style={{ marginTop: "12px", display: "inline-block" }}>
          View rows with missing values →
        </Link>
      </div>

      <div className="card chart-card">
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
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYMOG1mn-DoLAkaSN2yP1Br8m4vPAgIPoqc7CAVetUymvQuYyJfuI9a6fCCCQR0g2AQxcszSmc5G-b/pub?output=csv";

    fetch(sheetUrl)
      .then(res => res.text())
      .then(text => {
        const rows = text.split("\n").slice(1);
        const parsedData = rows.map(row => {
          const [
            id,
            first_name,
            last_name,
            enroll_date,
            exit_date,
            notes,
            services,
            unit_occupied,
            HSP,
            staff
          ] = row.split(",");

          return {
            id,
            first_name,
            last_name,
            enroll_date,
            exit_date,
            notes: notes ? Number(notes) : null,
            services: services ? Number(services) : null,
            unit_occupied: unit_occupied?.trim().toLowerCase() === "true" ? true : null,
            HSP: HSP?.trim().toLowerCase() === "true" ? true : null,
            staff: staff?.trim() || null

          };
        }).filter(d => d.id);

        setData(parsedData);

        const countNotes = parsedData.filter(d => d.notes !== null).length;
        const countServices = parsedData.filter(d => d.services !== null).length;
        const unitOccupiedTrue = parsedData.filter(d => d.unit_occupied).length;
        const HSPTrue = parsedData.filter(d => d.HSP).length;

        setInsights({
          totalRows: parsedData.length,
          countNotes,
          countServices,
          unitOccupiedTrue,
          HSPTrue
        });
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard data={data} insights={insights} />} />
        <Route path="/missing" element={<MissingData data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;
