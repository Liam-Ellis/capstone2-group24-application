import './App.css'
import UploadResume from "./components/uploadResume";
import Application from "./components/application";
import ProjectPage from "./components/projectPage";
import PreferencePage from "./components/preferencePage";
import Dashboard from "./components/dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/application" element={<Application />} />
          <Route path="/preference" element={<PreferencePage />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;