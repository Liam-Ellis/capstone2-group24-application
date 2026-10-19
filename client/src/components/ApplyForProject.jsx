import { useEffect, useState } from "react";
import "./ApplyForProject.css";
import UploadCoverLeter from "./UploadCoverLetter";
import PreferenceComponent from "./PreferenceComponent";

function ApplyForProject({ 
  onCancel,
  project
}) {
  const [coverLetter, setCoverLetter] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        let appDetails = {
          file: coverLetter,
          ID: project.ID,
          Type: project.Type
        }

        const response = await fetch(
            'http://localhost:3000/student/application/upload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appDetails),
                credentials: 'include'
            }
        );

        const data = await response.text();
        if(response.ok) {
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

            setFormErrors({general: errorMsg || 'Preference failed to submit!'});
            return;
        }
    }
    catch (err) {
        console.error("Unable to upload application: ", err);
        setFormErrors({ general: 'Please try again!' });
    }
};

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