import { useEffect, useState } from "react";
import "./AddProject.css";

function AddProject({
  round, 
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingProject) {
      setProjectName(existingProject.Name || "");
      setDescription(existingProject.Description || "");
      setClient(existingProject.Client || "");
      setClientEmail(existingProject.ClientEmail || "");
      setProjectType(existingProject.Type || "");
      setIntendedGroupSize(existingProject.IntendedSize || "");
    } else {
      setProjectName("");
      setDescription("");
      setClient("");
      setClientEmail("");
      setProjectType("");
      setIntendedGroupSize("");
    }
  }, [existingProject]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const projectData = {
      ...existingProject,
      Name: projectName,
      Description: description,
      Client: client,
      Round: round,
      ClientEmail: clientEmail,
      Type: projectType,
      IntendedSize: intendedGroupSize
    };

    if (existingProject) {
      try {
        const response = await fetch(
            "http://localhost:3000/UC/api/SaveEditedProject",
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData),
            }
        );

        const data = await response.text();
        if(!response.ok) {
          if (data.includes("{") && data.includes("message")) {
            setError(JSON.parse(data).message);
          } else {
            setError(data);
          }
        } else {
          onEditProject(JSON.parse(data));
        }
      }
      catch (err) {
        setError(err);
      }
    } else {
      try {
        const response = await fetch(
            "http://localhost:3000/UC/api/SaveNewProject",
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData),
            }
        );

        const data = await response.text();
        if(!response.ok) {
          if (data.includes("{") && data.includes("message")) {
            setError(JSON.parse(data).message);
          } else {
            setError(data);
          }
        } else {
          onAddProject(JSON.parse(data));
        }
      }
      catch (err) {
          setError(err);
      }
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
              <select
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
                required
              >
                <option value="">Select Project Type</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
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

          {error && (
            <div className="error-msg-div">
              <p>{error}</p>
            </div>)}
        </form>
      </div>
    </div>
  );
}

export default AddProject;