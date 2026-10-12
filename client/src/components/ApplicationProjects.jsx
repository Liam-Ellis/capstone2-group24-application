import { useState } from "react";
import "./ApplicationProjects.css";
import ApplyForProject from './ApplyForProject';

function ApplicationProjects({round}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showApplyProject, setShowApplyProject] = useState(false);

  const getProjects = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/project/round/${round}`
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

  const applyProject = (updatedProject) => {
    setProjects((previousProjects) =>
      previousProjects.map((project) => {
        if (project.unique_id === updatedProject.unique_id) {
          if (selectedProject === project) {
            setSelectedProject(updatedProject);
          }
          return updatedProject;
        } else {
          return project;
        }
      }
      )
    );

    setShowApplyProject(false);
  };

  const applyForProject = (project) => {
    setShowApplyProject(true);
  };

  return (
    <div className="projects-box">
      <div className="projects-header">
        <h4>Projects</h4>

        {showApplyProject && (
          <ApplyForProject
            project={selectedProject}
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
                        <strong>Project Type: </strong>
                        {selectedProject.Type}
                    </p>
                </>
            ) : (
                <p>Select a project to view details.</p>
            )}

            {selectedProject && (
                <div className="project-buttons">
                    <button
                        className="apply-project-btn"
                        onClick={() => applyForProject(selectedProject)}
                    >
                        Apply for Project
                    </button>
                </div>
            )}
        </div>

        </div>

    </div>
  );
}

export default ApplicationProjects;