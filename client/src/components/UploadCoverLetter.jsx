/* Student upload cover letter */
import { useState } from 'react';

function UploadCoverLetter({ applicationUploaded }) {
    const [application, setApplication] = useState({
        document: null
    });
    
    const inputChanges = (e) => {
        const { name, files } = e.target;

        setApplication(prevDetails => ({
            ...prevDetails, 
            [name]: files[0] 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!application.document) {
            alert("Please upload a pdf file.");
            return;
        }

        // send pdf file to the backend and store in the database
        const saveData = new FormData();
        saveData.append("document", application.document);

        applicationUploaded(application.document);

        /*
        try {
            const response = await fetch(
                "http://localhost:3000/api/application/upload",
                {
                    method: "POST",
                    body: saveData
                }
            );

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }

            applicationUploaded(application.document);
            alert("Cover letter uploaded successfully!");
            
        }
        catch (err) {
            console.error("Unable to upload document: ", err);
            alert("Failed to upload document");
        }*/
    };

    return(
         <div className="form-container2">
            <div className="resume-card">
                <div className="form-section" onDrop={inputChanges}>
                    <form onSubmit={handleSubmit}>
                
                        <label> Upload Cover Letter   
                        <input
                            type="file"
                            name="document"
                            accept=".pdf"
                            onChange={inputChanges}
                            required
                        />
                        </label>

                        <button className="upload-resume-btn" type="submit">
                            Upload
                        </button>    
                    </form>
                </div>
            </div>
        </div>
    )

}

export default UploadCoverLetter;