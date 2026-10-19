import { useEffect, useState } from "react";
import "./ApplyForProject.css";
import UploadCoverLeter from "./UploadCoverLetter";
import PreferenceComponent from "./PreferenceComponent";

function ApplyForProject({ 
  onCancel,
  project
}) {

  return (
    <div className="add-project-overlay">
      <div className="add-project-form">

        <div className="add-project-header">
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
          <UploadCoverLeter />
        )}

        {project.Type.toLowerCase() === 'group' && (
          <PreferenceComponent />
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