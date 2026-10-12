import { useState } from "react";
import "./Projects.css";
import AddProject from "./AddProject";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const addProject = (newProject) => {
    const projectWithId = {
      ...newProject,
      unique_id: Date.now()
    };

    setProjects((previousProjects) => [
      ...previousProjects,
      {
        id: previousProjects.length + 1,
        ...projectWithId
      }
    ]);

    setShowAddProject(false);
  };

  const editProject = (updatedProject) => {
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
                  {project.name}
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
                        {selectedProject.description}
                    </p>

                    <p>
                        <strong>Client: </strong>
                        {selectedProject.client}
                    </p>

                    <p>
                        <strong>Contact: </strong>
                        {selectedProject.clientEmail}
                    </p>

                    <p>
                        <strong>Project Type: </strong>
                        {selectedProject.projectType}
                    </p>

                    <p>
                        <strong>Intended Group Size: </strong>
                        {selectedProject.intendedGroupSize}
                    </p>
                </>
            ) : (
                <p>Select a project to view details.</p>
            )}

            {selectedProject && (
                <div className="project-buttons">
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