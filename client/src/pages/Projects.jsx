import { useState } from "react";
import "./Projects.css";
import AddProject from "./AddProject";

function Projects({round}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/UC/api/projects/${round}`,
            {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
            }
        );

        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message);
        }
        
        setProjects(data);
    }
    catch (err) {
        console.error("Unable to get projects: ", err);
    }
  };

  fetchProjects();

  const addProject = (newProject) => {
    setProjects((previousProjects) => [
      ...previousProjects,
      {
        ...newProject
      }
    ]);

    setShowAddProject(false);
  };

  const editProject = (updatedProject) => {
    setProjects((previousProjects) =>
      previousProjects.map((project) => {
        if (project.ID === updatedProject.ID) {
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

    setEditingProject(null);
    setShowAddProject(false);
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    setShowAddProject(true);
  };

   const deleteProject = (project) => {
    setProjects(projects.filter(proj => proj !== project));
    if (selectedProject === project) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="projects-box">
      <div className="projects-header">
        <h4>Available Projects</h4>
        <button
          className="add-project-btn"
          onClick={() => {
            setEditingProject(null);
            setShowAddProject(true);}}
        >
          + Add Project
        </button>

        {showAddProject && (
          <AddProject
            round={round}
            existingProject={editingProject}
            onAddProject={addProject}
            onEditProject={editProject}
            onCancel={() => {
              setEditingProject(null);
              setShowAddProject(false);}}
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
                        <strong>Contact: </strong>
                        {selectedProject.ClientEmail}
                    </p>

                    <p>
                        <strong>Project Type: </strong>
                        {selectedProject.Type}
                    </p>

                    <p>
                        <strong>Intended Group Size: </strong>
                        {selectedProject.IntendedSize}
                    </p>
                </>
            ) : (
                <p>Select a project to view details.</p>
            )}

            {selectedProject && (
                <div className="project-page-buttons">
                    <button
                        className="delete-project-btn"
                        onClick={() => deleteProject(selectedProject)}
                    >
                        Delete Project
                    </button>

                    <button
                        className="edit-project-btn"
                        onClick={() => openEditProject(selectedProject)}
                    >
                        Edit Project
                    </button>
                </div>
            )}
        </div>

        </div>

    </div>
  );
}

export default Projects;