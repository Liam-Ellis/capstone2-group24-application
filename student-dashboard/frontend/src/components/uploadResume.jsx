/* Student upload resume or cover letter */
import { useState } from "react";

function UploadResume({ applicationUploaded }) {
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

        // to run the program when backend is not done
        console.log("Submit button clicked");
        console.log("selected file: ", application.document);
        applicationUploaded(application.document);
        alert("Resume or Cover Letter uploaded successfully!");
 
        const saveData = new FormData();

        saveData.append("document", application.document);

        try {
            const response = await fetch(
                "http://localhost:3000/api/applications/upload",
                {
                    method: "POST",
                    body: saveData
                }
            );

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }
            else {
                console.log("Submit button clicked");
                alert("Resume or cover letter uploaded successfully!");
            }
        }
        catch (err) {
            console.error("Unable to upload document: ", err);
        } 
    };

    return(
        <div className="form-container">
            <div className="form-box">
                <form onSubmit={handleSubmit}>
            
                    <label> Upload Resume or Cover Letter </label>    
                    <input
                        type="file"
                        name="document"
                        accept=".pdf"
                        onChange={inputChanges}
                        required
                    />

                    <button type="submit">
                        Submit
                    </button>    
                </form>
            </div>
        </div>
    )

}

export default UploadResume;