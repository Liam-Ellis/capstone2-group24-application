import './App.css'
import UC_Dashboard from './pages/UC_Dashboard'
import WORK3008 from "./pages/WORK3008";
import ISAD3000 from "./pages/ISAD3000";
import StudentList  from './pages/StudentList';
import DownloadApplications from './pages/DownloadApplications'
import AddStudents  from './pages/AddStudents';
import AddStudent  from './pages/AddStudent';
import GroupAllocation from './pages/GroupAllocation';
import LogIn from './pages/Login';
import SetupAccount from './pages/SetupAccount';
import ForgotPassword from './pages/ForgotPassword';

import { Routes, Route, useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();

  const loadPage = async () => {
    const studentStatus = await fetch(
      'http://localhost:3000/auth/loggedInStudentStatus',
      {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: "include"
      }
    );

    const staffStatus = await fetch(
      'http://localhost:3000/auth/loggedInStaffStatus',
      {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: "include"
      }
    );

    if (studentStatus.ok) {
      navigate('/studentdashboard');
    }
    else if (staffStatus.ok) {
      navigate('/ucdashboard');
    }
    else {
      navigate('/login');
    }
  };

  loadPage();
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/setup" element={<SetupAccount />} />
      <Route path="/forgot" element={<ForgotPassword />} />
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
