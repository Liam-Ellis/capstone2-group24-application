import { useState } from 'react'
import './App.css'
import UC_Dashboard from './pages/UC_Dashboard'
import Rounds from "./pages/Rounds";
import ISAD3000 from "./pages/ISAD3000";
import StudentList  from './pages/StudentList';
import DownloadApplications from './pages/DownloadApplications'
import AddStudents  from './pages/AddStudents';
import AddStudent  from './pages/AddStudent';
import GroupAllocation from './pages/GroupAllocation';
import ICTE3002 from './pages/ICTE3002';
import { Routes, Route, Link } from "react-router-dom"

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>Homepage</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="next-steps">
        <div id="social">
          <h2>Other pages</h2>
          <ul>
            <li>
                <Link to="/ucdashboard">UC_Dashboard </Link>
            </li>
            <li>
              <a href="https://google.com/" target="_blank">
                Student dashboard. Not yet available
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ucdashboard" element={<UC_Dashboard />} />
      <Route path="/ucdashboard/isad3000/students" element={<StudentList />} />
      <Route path="/ucdashboard/isad3000/addstudents" element={<AddStudents />} />
      <Route path="/ucdashboard/isad3000/addstudent" element={<AddStudent />} />
      <Route path="/ucdashboard/icte3002/students" element={<StudentList />} />
      <Route path="/ucdashboard/icte3002/addstudents" element={<AddStudents />} />
      <Route path="/ucdashboard/icte3002/addstudent" element={<AddStudent />} />
      <Route path="/ucdashboard/rounds" element={<Rounds />} />
      <Route path="/ucdashboard/rounds/applications" element={<DownloadApplications />} />
      <Route path="/ucdashboard/isad3000" element={<ISAD3000 />} />
      <Route path="/ucdashboard/icte3002" element={<ICTE3002 />} />
      <Route path="/ucdashboard/groups" element={<GroupAllocation />} />
    </Routes>
  );
} 

export default App
