import "./UC_Dashboard.css";
import { useNavigate } from "react-router-dom";


function UC_Dashboard() {
  const navigate = useNavigate();
  const units = [
    {
      code: "ISAD3000 / WORK3008",
      name: "Capstone Project 1 / Semester 1 2026",
      path: "/ucdashboard/isad3000/"
    },
    {
      code: "ICTE3002",
      name: "Human Computer Interface / Semester 1 2026",
      path: "/ucdashboard/icte3002"
    }
  ];

  return (
    <div className="landing-container">

      <aside className="sidebar">
        <h2>UC Dashboard</h2>

        <nav>
          <ul>
            <li onClick={() => navigate("/ucdashboard")}>Units</li>
            <li onClick={() => navigate("/ucdashboard/rounds")}>Rounds</li>
            <li onClick={() => navigate("/ucdashboard/groups")}>Group Allocation</li>
          </ul> 
        </nav>
      </aside>


      {/* Main Content */}
      <main className="main-content">

        <section className="greeting">
          <h1>Hi "Username"!</h1>
          <p></p>
        </section>

        <SemesterSelector />
        {/* Units */}
        <section className="units-section">
            <h2>Units</h2>

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
  const [year, setYear] = useState("2026");

  return (
    <div className="semester-selector">
      <label htmlFor="year">Year:</label>
      <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
      </select>

      <label htmlFor="semester">Semester:</label>
      <select id="semester" value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">All Semesters</option>
        <option value="Semester 1">Semester 1</option>
        <option value="Semester 2">Semester 2</option>
      </select>
    </div>
  );
}
