import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function Dashboard({ data, insights }) {
  if (!data.length) return <p className="container">Loading data...</p>;

  const chartData = [
    { name: "Notes", value: insights.countNotes || 0 },
    { name: "Services", value: insights.countServices || 0 },
    { name: "Units Occupied", value: insights.unitOccupiedTrue || 0 },
    { name: "HSP", value: insights.HSPTrue || 0 },
    { name: "ID Card", value: insights.IdTrue || 0 },
    { name: "SSC", value: insights.sscTrue || 0 }
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
        <p>ID Cards: {insights.IdTrue}</p>
        <p>SSC Card: {insights.sscTrue}</p>
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
    </div>
  );
}
