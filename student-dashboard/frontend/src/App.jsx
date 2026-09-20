import './App.css'
import { useState } from "react";
import UploadResume from "./components/uploadResume";
import ApplicationStatus from "./components/applicationStatus";
import ProjectPage from "./components/projectPage";
import RoundPage from "./components/roundPage";
import PreferencePage from "./components/preferencePage";

function App() {

  const [appStatus, setAppStatus] = useState("Not Applied");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [upload, setUpload] = useState(null);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowApplication(false);
  };

  const handleApply = () => {
    setShowApplication(true);
  };

  const handleUpload = (file) => {
    setUpload(file);
    setAppStatus("Applied");
  };

  const handleRounds = () => {
    setSelectedProject(null);
    setShowApplication(false);
  };

  return (
    <div className="app-container">
      <h1> 
        Student Dashboard
      </h1>

      {/* show rounds when no project has been selected */}
      <h2> Round Page </h2>
      {!selectedProject && (<RoundPage viewProject={handleViewProject} />)}
    
      {/* show project details */}
      {selectedProject && !showApplication && (
        <ProjectPage
          project={selectedProject}
          onApply={handleApply}
          onBack={handleRounds}
          />
      )}

      {/* show application page */}
      {selectedProject && showApplication && (
        <div>
          <button onClick={() => setShowApplication(false)}>
            Back to Project
          </button>

          <h2> Apply for {selectedProject.title} </h2>
          <UploadResume applicationUploaded={handleUpload} />

          <ApplicationStatus status={appStatus} />
        </div>
      )}
      
      <PreferencePage></PreferencePage>
    </div>
  );
}

export default App;