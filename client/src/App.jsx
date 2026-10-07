import { useState } from 'react'
import './App.css'
import UC_Dashboard from './pages/UC_Dashboard'
import WORK3008 from "./pages/WORK3008";
import ISAD3000 from "./pages/ISAD3000";
import StudentList  from './pages/StudentList';
import DownloadApplications from './pages/DownloadApplications'
import AddStudents  from './pages/AddStudents';
import AddStudent  from './pages/AddStudent';
import GroupAllocation from './pages/GroupAllocation';

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
              <a href="https://chat.vite.dev/" target="_blank">
                Dashboard 2
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                Dashboard 3
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                Dashboard 4
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
      <Route path="/ucdashboard/work3008" element={<WORK3008 />} />
      <Route path="/ucdashboard/work3008/applications" element={<DownloadApplications />} />
      <Route path="/ucdashboard/isad3000" element={<ISAD3000 />} />
      <Route path="/ucdashboard/isad3000" element={<ISAD3000 />} />
      <Route path="/ucdashboard/isad3000/groups" element={<GroupAllocation />} />
    </Routes>
  );
} 

export default App
