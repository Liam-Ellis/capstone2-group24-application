import { useEffect, useState } from "react";
import "./WorkProjects.css";
import backendURL from "../backendURL";

function WorkProjects({roundNum, roundsList}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = roundsList[roundNum - 1];

  useEffect(() => {
    setSelectedProject(null);
  }, roundNum);


  async function downloadApplications(selectedProject)
  {
    try
    {
      const getURL = backendURL + '/UC/api/getWorkProjectApplications/' + selectedProject.ID
      const response = await fetch(getURL, {
              method: 'GET',
              credentials: 'include'
      });
      if(!response.ok) {
        throw new Error(data.message);
      } else{
        const data = await response.blob();

        const url = URL.createObjectURL(data);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'project number ' + '100' +' applications.zip'; 
        a.click();
      }
    } catch (err)
    {
      
      console.error("Unable to download documents: ", err);
      alert("Failed to download documents");
        
    }
  }


  return (
    <div className="projects-box">
      <div className="projects-header">
        <h4>Work Projects</h4>
      </div>
        <div className="projects-container">

          <div className="project-list-section">
            <div className="project-list-header">
              <h3>Projects List</h3>
            </div>

            <div className="project-list">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-item"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.Name}
                </div>
              ))}
            </div>
          </div>

        <div className="project-details">
            <h3>Details</h3>

            {selectedProject ? (
                <>
                    <p>
                        <strong>Description: </strong>
                        {selectedProject.Description}
                    </p>

                    <p>
                        <strong>Client: </strong>
                        {selectedProject.Client}
                    </p>

                    <p>
                        <strong>Client Email: </strong>
                        {selectedProject.ClientEmail}
                    </p>
                </>
            ) : (
                <p>Select a project to view details.</p>
            )}

            {selectedProject && (
                <div>
                    <button
                        className="download-applications-btn"
                        onClick={() => downloadApplications(selectedProject)}
                    >
                        Download Applications
                    </button>
                </div>
            )}
        </div>

        </div>

    </div>
  );
}

export default WorkProjects;