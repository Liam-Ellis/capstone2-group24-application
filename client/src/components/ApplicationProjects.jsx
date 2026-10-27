import { useState } from "react";
import "./ApplicationProjects.css";
import ApplyForProject from './ApplyForProject';

function ApplicationProjects({round}) {
  const [hasApplied, setHasApplied] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showApplyProject, setShowApplyProject] = useState(false);

  const getProjects = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/student/projects/${round}`,
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
                }
            );

            const data = await response.json();
            console.log(data);
            if(!response.ok) {
                throw new Error(data.message);
            }
            setProjects(data);
            
        }
        catch (err) {
            console.error("Unable to get project: ", err);
        } 
  };

  getProjects();

  const applyProject = (project) => {
    if (selectedProject.ID === project.ID) {
      setHasApplied(true);
    }

    setShowApplyProject(false);
  };

  const applyForProject = (project) => {
    setShowApplyProject(true);
  };

  const getAppStatus = async (project) => {
    try {
      const response = await fetch(
          `http://localhost:3000/UC/api/applicationStatus`,
          {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({Project: project.ID}),
          credentials: 'include'
          }
      );

      const data = await response.json();

      if(!response.ok) {
          throw new Error(data);
      }

      setHasApplied(data);
    }
    catch (err) {
    }
  };

  const selectProject = async (project) => {
    setHasApplied(false);
    setSelectedProject(project);
    await getAppStatus(project);
  }

  return (
    <div className="projects-box">
      <div className="projects-header">
        <h4>Projects</h4>

        {showApplyProject && (
          <ApplyForProject
            project={selectedProject}
            onApply={() => applyProject(selectedProject)}
            onCancel={() => {
              setShowApplyProject(false);}}
          />
        )}
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
                  onClick={() => selectProject(project)}
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
                        <strong>Project Type: </strong>
                        {selectedProject.Type}
                    </p>
                </>
            ) : (
                <p>Select a project to view details.</p>
            )}

            {selectedProject && !hasApplied && (
                <div className="app-project-buttons">
                    <button
                        className="apply-project-btn"
                        onClick={() => applyForProject(selectedProject)}
                    >
                        Apply for Project
                    </button>
                </div>
            )}

            {selectedProject && hasApplied && (
                <p className="applied-msg">You have applied for this project</p>
            )}
        </div>

        </div>

    </div>
  );
}

export default ApplicationProjects;