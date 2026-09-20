import "./UC_Dashboard.css";
import logo from "./logo.webp";
import { useNavigate } from "react-router-dom";


function UC_Dashboard() {
  const navigate = useNavigate();
  const units = [
    {
      code: "ISAD3000",
      name: "Capstone Project 1 / Semester 1 2026",
      path: "/ucdashboard/isad3000"
    },
    {
      code: "ICTE3002",
      name: "Human Computer Interface / Semester 1 2026",
      path: "/ucdashboard/icte3002"
    },
    {
      code: "WORK3008",
      name: "Work Based Project / Semester 1 2026",
      path: "/ucdashboard/work3008"
    }
  ];

  return (
    <div className="landing-container">

      <aside className="sidebar">
        <h2>UC Dashboard</h2>

        <nav>
          <ul>
            <li>Institution Page</li>
            <li>Units</li>
            <li>Settings</li>
          </ul> 
        </nav>
      </aside>


      {/* Main Content */}
      <main className="main-content">

        {/* Greeting */}
        <section className="greeting">
          <h1>Hi "Username"!</h1>
          <p></p>
        </section>

        <img src={logo} alt="Logo" className="top-logo" />

        <SemesterSelector />
        {/* Units */}
        <section className="units-section">
            <h2>Your Units</h2>

            <div className="unit-grid">
                {units.map((unit) => (
                    <div className="unit-card" key={unit.code}>
                        <h3>{unit.code}</h3>

                        <p>{unit.name}</p>

                        <button onClick={() => navigate(unit.path)}>
                            Open Unit
                        </button>
                    </div>
                ))}
            </div>
        </section>

      </main>

    </div>
  );
}

export default UC_Dashboard;

import { useState } from "react";


function SemesterSelector() {
    const [semester, setSemester] = useState("");
    const [year, setYear] = useState("");

    return (
        <div className="semester-selector">
            <label>Year:</label>
            <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
            >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
            </select>

            <label>Semester:</label>
            <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
            >
                <option value="">All Semesters</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
            </select>
        </div>
    );
}
