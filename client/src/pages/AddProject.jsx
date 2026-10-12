import { useEffect, useState } from "react";
import "./AddProject.css";

function AddProject({ 
  onAddProject, 
  onEditProject,
  onCancel,
  existingProject
}) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [intendedGroupSize, setIntendedGroupSize] = useState("");

  useEffect(() => {
    if (existingProject) {
      setProjectName(existingProject.name || "");
      setDescription(existingProject.description || "");
      setClient(existingProject.client || "");
      setClientEmail(existingProject.clientEmail || "");
      setProjectType(existingProject.projectType || "");
      setIntendedGroupSize(existingProject.intendedGroupSize || "");
    } else {
      setProjectName("");
      setDescription("");
      setClient("");
      setClientEmail("");
      setProjectType("");
      setIntendedGroupSize("");
    }
  }, [existingProject]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const projectData = {
      ...existingProject,
      name: projectName,
      description: description,
      client: client,
      clientEmail: clientEmail,
      projectType: projectType,
      intendedGroupSize: intendedGroupSize
    };

    if (existingProject) {
      onEditProject(projectData);
    } else {
      onAddProject(projectData);
    }
  };

  return (
    <div className="add-project-overlay">
      <div className="add-project-form">

        <div className="add-project-header">
          <h2>{existingProject ? "Edit Project" : "Add New Project"}</h2>

          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <label>
              Project Name
              <input
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Project Name"
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Project Description"
                rows="5"
                required
              />
            </label>

            <label>
              Client
              <textarea
                value={client}
                onChange={(event) => setClient(event.target.value)}
                placeholder="Client Name"
                required
              />
            </label>

            <label>
              Client Email
              <textarea
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                placeholder="Client Email"
                required
              />
            </label>

            <label>
              Project Type
              <input
                type="text"
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
                placeholder="Project Type"
                required
              />
            </label>

            <label>
              Intended Group Size
              <input
                type="number"
                min="1"
                value={intendedGroupSize}
                onChange={(event) => setIntendedGroupSize(event.target.value)}
                placeholder="Group Size"
                required
              />
            </label>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-project-btn"
            >
              {existingProject ? "Save Changes" : "Add Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProject;