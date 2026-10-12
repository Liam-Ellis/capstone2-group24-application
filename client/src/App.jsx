import './App.css'
import UC_Dashboard from './pages/UC_Dashboard'
import Rounds from "./pages/Rounds";
import ISAD3000 from "./pages/ISAD3000";
import StudentList  from './pages/StudentList';
import DownloadApplications from './pages/DownloadApplications'
import AddStudents  from './pages/AddStudents';
import AddStudent  from './pages/AddStudent';
import GroupAllocation from './pages/GroupAllocation';
import LogIn from './pages/Login';
import SetupAccount from './pages/SetupAccount';
import ForgotPassword from './pages/ForgotPassword';
import ICTE3002 from './pages/ICTE3002';
import StudentUnitPage from './components/StudentUnitPage';
import Student_ISAD3000 from './components/Student_ISAD3000';
import Student_ICTE3002 from './components/Student_ICTE3002';
import Student_WORK3008 from './components/Student_WORK3008';
import ApplicationPage from './components/ApplicationPage';

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
      <Route path="/ucdashboard/icte3002/students" element={<StudentList />} />
      <Route path="/ucdashboard/icte3002/addstudents" element={<AddStudents />} />
      <Route path="/ucdashboard/icte3002/addstudent" element={<AddStudent />} />
      <Route path="/ucdashboard/rounds" element={<Rounds />} />
      <Route path="/ucdashboard/rounds/applications" element={<DownloadApplications />} />
      <Route path="/ucdashboard/isad3000" element={<ISAD3000 />} />
      <Route path="/ucdashboard/icte3002" element={<ICTE3002 />} />
      <Route path="/ucdashboard/groups" element={<GroupAllocation />} />
      <Route path="/studentdashboard" element={<StudentUnitPage />} />
      <Route path="/studentdashboard/ISAD3000" element={<Student_ISAD3000 />} />
      <Route path="/studentdashboard/ICTE3002" element={<Student_ICTE3002 />} />
      <Route path="/studentdashboard/WORK3008" element={<Student_WORK3008 />} />
      <Route path="/studentdashboard/apply" element={<ApplicationPage />} />
    </Routes>
  );
} 

export default App
