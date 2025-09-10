import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from "./Dashboard";
import MissingData from "./MissingData";

function App() {
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYMOG1mn-DoLAkaSN2yP1Br8m4vPAgIPoqc7CAVetUymvQuYyJfuI9a6fCCCQR0g2AQxcszSmc5G-b/pub?output=csv";

    fetch(sheetUrl)
      .then(res => res.text())
      .then(text => {
        const rows = text.split("\n").slice(1); // skip header

        const parsedData = rows
          .map(row => {
            const columns = row.split(",");
            if (columns.length < 10) return null; // skip incomplete rows

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
              staff,
              id_card,
              ss_card,
              program_name
            ] = columns;

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
              staff: staff?.trim() || "",
              id_card: id_card?.trim().toLowerCase() === "true" ? true : null,
              ss_card: ss_card?.trim().toLowerCase() === "true" ? true : null,
              program_name: program_name?.trim() || "",
            };
          })
          .filter(d => d !== null && d.id);

        setData(parsedData);

        const countNotes = parsedData.filter(d => d.notes !== null).length;
        const countServices = parsedData.filter(d => d.services !== null).length;
        const unitOccupiedTrue = parsedData.filter(d => d.unit_occupied).length;
        const HSPTrue = parsedData.filter(d => d.HSP).length;
        const IdTrue = parsedData.filter(d => d.id_card).length;
        const sscTrue = parsedData.filter(d => d.ss_card).length;

        setInsights({
          totalRows: parsedData.length,
          countNotes,
          countServices,
          unitOccupiedTrue,
          HSPTrue,
          IdTrue,
          sscTrue
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
