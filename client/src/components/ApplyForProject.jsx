import { useEffect, useState } from "react";
import "./ApplyForProject.css";
import UploadResume from "./UploadResume";
import UploadCoverLeter from "./UploadCoverLetter";
import PreferenceComponent from "./PreferenceComponent";

function ApplyForProject({ 
  onCancel,
  onApply,
  project
}) {
  const [coverLetter, setCoverLetter] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [hasResume, setHasResume] = useState("");

  const getResumeStatus = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/UC/api/DoesStudentHaveResume',
        {
            method: 'GET',
            credentials: 'include'
        }
      );

      const resumeStatus = await response.json();

      if (response.ok) {
        setHasResume(resumeStatus.hasResume);
      } else {
        setHasResume("false");
      }
    }
    catch (err) {
      setHasResume("false");
    }
  }

  getResumeStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const appDetails = new FormData();
        appDetails.append("document", coverLetter);
        appDetails.append("ID", project.ID);
        appDetails.append("Type", project.Type);


        const response = await fetch(
            'http://localhost:3000/student/application/upload',
            {
                method: 'POST',
                body: appDetails,
                credentials: 'include'
            }
        );

        const data = await response.text();
        if(response.ok) {
          onApply();
          onCancel();
        }
        else {
            let errorMsg;

            if (data.includes("{") &&
                data.includes("message")) {
                errorMsg = JSON.parse(data).message;
            } else {
                errorMsg = data
            }

            setFormErrors({general: errorMsg || 'Project Application failed to submit!'});
            return;
        }
    }
    catch (err) {
        console.error("Unable to upload application: ", err);
        setFormErrors({ general: 'Please try again!' });
    }
};

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

        {project.Type.toLowerCase() === 'work' && hasResume === 'false' && (
          <UploadResume />
        )}

        {project.Type.toLowerCase() === 'work' && (
          <UploadCoverLeter applicationUploaded={setCoverLetter} />
        )}

        {project.Type.toLowerCase() === 'group' && (
          <PreferenceComponent />
        )}

        {formErrors.general && (
          <div className="error-msg-div">
            <p> {formErrors.general} </p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-buttons">
            <button
              type="submit"
              className="apply-project-btn"
            >
              Apply
            </button>
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