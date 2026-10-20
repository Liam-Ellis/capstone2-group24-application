import { useEffect, useState } from "react";
import "./ApplyForProject.css";
import UploadResume from "./uploadResume";
import PreferencePage from "./preferencePage";

function ApplyForProject({ 
  onCancel,
  project
}) {

  return (
    <div className="apply-project-overlay">
      <div className="apply-project-form">

        <div className="apply-project-header">
          <h2>Apply For Project</h2>

          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
          >
            X
          </button>
        </div>

        {project.Type.toLowerCase() === 'work' && (
          <UploadResume />
        )}

        {project.Type.toLowerCase() === 'group' && (
          <PreferencePage />
        )}

        <form>
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyForProject;